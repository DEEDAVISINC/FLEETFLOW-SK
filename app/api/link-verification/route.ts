import { NextRequest, NextResponse } from 'next/server';
import { resourceLinkVerifier } from '../../services/ResourceLinkVerifier';

export async function GET(request: NextRequest) {
  try {
    console.info('🔍 Starting comprehensive link verification...');

    // Get link statistics
    const stats = resourceLinkVerifier.getLinkStatistics();

    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    let externalResults, internalResults, report;

    if (isBrowser) {
      // In browser environment, use mock data for external links
      console.info(
        '🌐 Browser environment detected - using mock external link data'
      );
      externalResults = resourceLinkVerifier.getMockVerificationResults();
      internalResults = await resourceLinkVerifier.verifyInternalLinks();

      // Generate report with mock data
      const validExternalLinks = externalResults.filter(
        (r) => r.status === 'valid'
      ).length;
      const invalidExternalLinks = externalResults.filter(
        (r) => r.status !== 'valid'
      ).length;
      const validInternalLinks = internalResults.filter((r) => r.exists).length;
      const invalidInternalLinks = internalResults.filter(
        (r) => !r.exists
      ).length;

      const brokenLinks = externalResults.filter((r) => r.status !== 'valid');
      const missingPages = internalResults.filter((r) => !r.exists);

      const recommendations: string[] = [];

      if (brokenLinks.length > 0) {
        recommendations.push(`Fix ${brokenLinks.length} broken external links`);
      }

      if (missingPages.length > 0) {
        recommendations.push(
          `Create ${missingPages.length} missing internal pages`
        );
      }

      if (invalidExternalLinks > 0) {
        recommendations.push(
          'Consider replacing unreliable external links with alternatives'
        );
      }

      if (invalidInternalLinks > 0) {
        recommendations.push('Implement proper 404 handling for missing pages');
      }

      recommendations.push(
        'External link verification requires server-side implementation due to CORS restrictions'
      );

      report = {
        totalExternalLinks: stats.totalExternalLinks,
        validExternalLinks,
        invalidExternalLinks,
        totalInternalLinks: stats.totalInternalLinks,
        validInternalLinks,
        invalidInternalLinks,
        brokenLinks,
        missingPages,
        recommendations,
      };
    } else {
      // Server-side environment - run actual verification
      console.info('🔗 Verifying external links...');
      externalResults = await resourceLinkVerifier.verifyExternalLinks();

      console.info('🏠 Verifying internal links...');
      internalResults = await resourceLinkVerifier.verifyInternalLinks();

      console.info('📊 Generating verification report...');
      report = await resourceLinkVerifier.generateVerificationReport();
    }

    // Get production readiness checklist
    const checklist = resourceLinkVerifier.getProductionReadinessChecklist();

    const response = {
      timestamp: new Date().toISOString(),
      summary: report,
      statistics: stats,
      externalResults,
      internalResults,
      productionChecklist: checklist,
      status: 'completed',
      environment: isBrowser ? 'browser' : 'server',
      note: isBrowser
        ? 'External link verification uses mock data due to CORS restrictions'
        : 'Full verification completed',
    };

    console.info('✅ Link verification completed successfully');
    console.info(
      `📈 Results: ${report.validExternalLinks}/${report.totalExternalLinks} external links valid, ${report.validInternalLinks}/${report.totalInternalLinks} internal links valid`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error during link verification:', error);
    return NextResponse.json(
      {
        error: 'Link verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'verify-external':
        const externalResults =
          await resourceLinkVerifier.verifyExternalLinks();
        return NextResponse.json({ externalResults });

      case 'verify-internal':
        const internalResults =
          await resourceLinkVerifier.verifyInternalLinks();
        return NextResponse.json({ internalResults });

      case 'get-report':
        const report = await resourceLinkVerifier.generateVerificationReport();
        return NextResponse.json({ report });

      case 'get-checklist':
        const checklist =
          resourceLinkVerifier.getProductionReadinessChecklist();
        return NextResponse.json({ checklist });

      case 'get-mock-data':
        const mockResults = resourceLinkVerifier.getMockVerificationResults();
        return NextResponse.json({ mockResults });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Error in link verification API:', error);
    return NextResponse.json(
      {
        error: 'API request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
