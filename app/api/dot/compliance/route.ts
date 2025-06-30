import { NextRequest, NextResponse } from 'next/server'
import DOTComplianceService from '@/lib/dot-compliance-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, dotNumber, documentType, parameters, carrierId } = body

    const complianceService = DOTComplianceService.getInstance()

    switch (action) {
      case 'getProfile':
        if (!dotNumber) {
          return NextResponse.json({ error: 'DOT number is required' }, { status: 400 })
        }

        const profile = await complianceService.generateComplianceProfile(dotNumber)
        const alerts = await complianceService.getComplianceAlerts(profile.carrierId)

        return NextResponse.json({
          success: true,
          profile,
          alerts
        })

      case 'generateDocument':
        if (!documentType) {
          return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
        }

        const document = await complianceService.generateComplianceDocument(documentType, parameters || {})

        return NextResponse.json({
          success: true,
          document
        })

      case 'performAudit':
        if (!carrierId) {
          return NextResponse.json({ error: 'Carrier ID is required' }, { status: 400 })
        }

        const audit = await complianceService.performComplianceAudit(carrierId)

        return NextResponse.json({
          success: true,
          audit
        })

      case 'getTraining':
        const training = complianceService.generateComplianceTraining()

        return NextResponse.json({
          success: true,
          training
        })

      case 'getCostAnalysis':
        if (!dotNumber) {
          return NextResponse.json({ error: 'DOT number is required' }, { status: 400 })
        }

        const complianceProfile = await complianceService.generateComplianceProfile(dotNumber)
        const costAnalysis = complianceService.calculateComplianceCosts(complianceProfile)

        return NextResponse.json({
          success: true,
          costAnalysis
        })

      case 'getPricing':
        const pricing = complianceService.getServicePricing()

        return NextResponse.json({
          success: true,
          pricing
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('DOT Compliance API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DOT Compliance API',
    endpoints: [
      'POST /api/dot/compliance - Main compliance operations',
    ],
    actions: [
      'getProfile - Get compliance profile for DOT number',
      'generateDocument - Generate compliance documents',
      'performAudit - Perform compliance audit',
      'getTraining - Get training programs',
      'getCostAnalysis - Get cost analysis',
      'getPricing - Get service pricing'
    ]
  })
}
