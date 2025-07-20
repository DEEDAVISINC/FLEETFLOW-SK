const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
  console.log('🔍 Checking existing tables in your Supabase database...')
  console.log('')

  try {
    // Check for specific FleetFlow tables by trying to query them
    const fleetflowTables = ['loads', 'drivers', 'vehicles', 'load_confirmations', 'deliveries', 'file_records', 'notifications', 'users']
    console.log('🎯 Checking for FleetFlow tables:')
    
    for (const tableName of fleetflowTables) {
      try {
        // Try to query the table to see if it exists
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          if (error.code === '42P01') {
            console.log(`   ❌ ${tableName} - MISSING (relation does not exist)`)
          } else {
            console.log(`   ⚠️  ${tableName} - EXISTS but has error: ${error.message}`)
          }
        } else {
          console.log(`   ✅ ${tableName} - EXISTS (${data?.length || 0} records)`)
        }
      } catch (err) {
        console.log(`   ❌ ${tableName} - ERROR: ${err.message}`)
      }
    }

    console.log('')
    console.log('💡 Next steps:')
    console.log('   1. If FleetFlow tables are missing, run the schema setup')
    console.log('   2. If tables exist but are empty, run the data seeding')
    console.log('   3. Visit http://localhost:3000/test-supabase to test')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkTables() 