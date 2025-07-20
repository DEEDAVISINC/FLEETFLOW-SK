const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🗄️ Setting up Supabase database schema...')

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📄 SQL schema loaded successfully')
    console.log('⚠️  IMPORTANT: This script will create all tables and sample data.')
    console.log('   If tables already exist, you may see errors (which is normal).')
    console.log('')

    // Split the SQL into individual statements
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            // Some errors are expected (like duplicate tables)
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key') ||
                error.message.includes('relation already exists')) {
              console.log(`   ⚠️  Statement ${i + 1}: ${error.message.split('\n')[0]}`)
            } else {
              console.error(`   ❌ Statement ${i + 1}: ${error.message}`)
              errorCount++
            }
          } else {
            successCount++
          }
        } catch (err) {
          console.error(`   ❌ Statement ${i + 1}: ${err.message}`)
          errorCount++
        }
      }
    }

    console.log('')
    console.log('📊 Schema setup completed:')
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log('')
    console.log('🎉 Database setup completed!')
    console.log('🌐 Visit http://localhost:3000/test-supabase to see your data!')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    console.log('')
    console.log('💡 Alternative: Copy the contents of supabase-schema.sql')
    console.log('   and paste it into your Supabase SQL Editor at:')
    console.log('   https://supabase.com/dashboard/project/[your-project]/sql')
  }
}

setupDatabase() 