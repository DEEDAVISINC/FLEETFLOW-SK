import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    overall: 'unknown',
    tests: {
      connection: { status: 'unknown', message: '' },
      tables: { status: 'unknown', message: '', details: {} },
      operations: { status: 'unknown', message: '', details: {} }
    }
  };

  try {
    // Test 1: Basic connection
    const { data: connectionData, error: connectionError } = await supabase
      .from('loads')
      .select('count')
      .limit(1);

    if (connectionError) {
      testResults.tests.connection = {
        status: 'error',
        message: connectionError.message
      };
      testResults.overall = 'failed';
    } else {
      testResults.tests.connection = {
        status: 'success',
        message: 'Supabase connection successful'
      };
    }

    // Test 2: Table access
    const tables = ['loads', 'drivers', 'vehicles'];
    const tableTests = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          tableTests[table] = {
            status: 'error',
            message: error.message
          };
        } else {
          tableTests[table] = {
            status: 'success',
            message: `Table ${table} accessible`,
            count: data?.length || 0
          };
        }
      } catch (err: any) {
        tableTests[table] = {
          status: 'error',
          message: err.message
        };
      }
    }

    testResults.tests.tables = {
      status: Object.values(tableTests).every(test => test.status === 'success') ? 'success' : 'partial',
      message: 'Table access test completed',
      details: tableTests
    };

    // Test 3: CRUD operations (read-only for safety)
    const operationTests = {};

    try {
      // Test read operation
      const { data: readData, error: readError } = await supabase
        .from('loads')
        .select('*')
        .limit(5);

      if (readError) {
        operationTests.read = {
          status: 'error',
          message: readError.message
        };
      } else {
        operationTests.read = {
          status: 'success',
          message: `Successfully read ${readData?.length || 0} records`
        };
      }
    } catch (err: any) {
      operationTests.read = {
        status: 'error',
        message: err.message
      };
    }

    // Test count operation
    try {
      const { count, error: countError } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        operationTests.count = {
          status: 'error',
          message: countError.message
        };
      } else {
        operationTests.count = {
          status: 'success',
          message: `Total records: ${count || 0}`
        };
      }
    } catch (err: any) {
      operationTests.count = {
        status: 'error',
        message: err.message
      };
    }

    testResults.tests.operations = {
      status: Object.values(operationTests).every(test => test.status === 'success') ? 'success' : 'partial',
      message: 'Database operations test completed',
      details: operationTests
    };

    // Determine overall status
    const allTests = [
      testResults.tests.connection.status,
      testResults.tests.tables.status,
      testResults.tests.operations.status
    ];

    if (allTests.every(test => test === 'success')) {
      testResults.overall = 'success';
    } else if (allTests.some(test => test === 'error')) {
      testResults.overall = 'failed';
    } else {
      testResults.overall = 'partial';
    }

  } catch (err: any) {
    testResults.overall = 'failed';
    testResults.tests.connection = {
      status: 'error',
      message: err.message
    };
  }

  const statusCode = testResults.overall === 'success' ? 200 : 
                    testResults.overall === 'partial' ? 207 : 503;

  return NextResponse.json(testResults, { status: statusCode });
} 