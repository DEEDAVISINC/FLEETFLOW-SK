import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('loads')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase!',
      data: data
    })

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      type: 'connection_error'
    }, { status: 500 })
  }
} 