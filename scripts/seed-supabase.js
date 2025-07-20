const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log('🌱 Seeding Supabase database with sample data...')

  try {
    // Insert sample drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .insert([
        {
          name: 'John Smith',
          email: 'john.smith@fleetflow.com',
          phone: '(555) 123-4567',
          license_number: 'DL123456789',
          status: 'active'
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@fleetflow.com',
          phone: '(555) 234-5678',
          license_number: 'DL987654321',
          status: 'active'
        },
        {
          name: 'Mike Wilson',
          email: 'mike.wilson@fleetflow.com',
          phone: '(555) 345-6789',
          license_number: 'DL456789123',
          status: 'inactive'
        }
      ])
      .select()

    if (driversError) {
      console.error('❌ Error inserting drivers:', driversError)
    } else {
      console.log('✅ Inserted', drivers.length, 'drivers')
    }

    // Insert sample vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert([
        {
          vehicle_id: 'V001',
          make: 'Freightliner',
          model: 'Cascadia',
          year: '2022',
          vin: '1FUJA6CV12L123456',
          license_plate: 'CA12345',
          status: 'active',
          driver_id: drivers?.[0]?.id || null
        },
        {
          vehicle_id: 'V002',
          make: 'Peterbilt',
          model: '579',
          year: '2021',
          vin: '1XPBD49X7MD123456',
          license_plate: 'CA67890',
          status: 'active',
          driver_id: drivers?.[1]?.id || null
        },
        {
          vehicle_id: 'V003',
          make: 'Kenworth',
          model: 'T680',
          year: '2023',
          vin: '1XKWD49X7MD123456',
          license_plate: 'CA11111',
          status: 'maintenance',
          driver_id: null
        }
      ])
      .select()

    if (vehiclesError) {
      console.error('❌ Error inserting vehicles:', vehiclesError)
    } else {
      console.log('✅ Inserted', vehicles.length, 'vehicles')
    }

    // Insert sample loads
    const { data: loads, error: loadsError } = await supabase
      .from('loads')
      .insert([
        {
          load_id: 'L001',
          origin: 'Los Angeles, CA',
          destination: 'Phoenix, AZ',
          weight: '45,000 lbs',
          rate: '$2,500',
          status: 'in_transit',
          driver: 'John Smith',
          pickup_date: '2024-01-15',
          delivery_date: '2024-01-16',
          customer: 'ABC Logistics',
          miles: '375',
          profit: '$800'
        },
        {
          load_id: 'L002',
          origin: 'Phoenix, AZ',
          destination: 'Las Vegas, NV',
          weight: '38,000 lbs',
          rate: '$1,800',
          status: 'completed',
          driver: 'Sarah Johnson',
          pickup_date: '2024-01-14',
          delivery_date: '2024-01-15',
          customer: 'XYZ Transport',
          miles: '300',
          profit: '$600'
        },
        {
          load_id: 'L003',
          origin: 'Las Vegas, NV',
          destination: 'Salt Lake City, UT',
          weight: '42,000 lbs',
          rate: '$2,200',
          status: 'pending',
          driver: 'Mike Wilson',
          pickup_date: '2024-01-17',
          delivery_date: '2024-01-18',
          customer: 'Mountain Express',
          miles: '420',
          profit: '$750'
        }
      ])
      .select()

    if (loadsError) {
      console.error('❌ Error inserting loads:', loadsError)
    } else {
      console.log('✅ Inserted', loads.length, 'loads')
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Sample data summary:')
    console.log('   - Drivers:', drivers?.length || 0)
    console.log('   - Vehicles:', vehicles?.length || 0)
    console.log('   - Loads:', loads?.length || 0)
    console.log('\n🌐 Visit http://localhost:3000/test-supabase to see your data!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

seedDatabase() 