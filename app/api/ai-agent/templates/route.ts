import { NextRequest, NextResponse } from 'next/server';
import { AITemplateEngine } from '../../../services/AITemplateEngine';

// GET /api/ai-agent/templates - Get templates for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const templateId = searchParams.get('templateId');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const tags = searchParams.get('tags')?.split(',');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    if (templateId) {
      // Get specific template
      const template = await AITemplateEngine.getTemplate(templateId);
      if (!template || template.tenantId !== tenantId) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(template);
    } else {
      // Get templates with filters
      const filters: any = {};
      if (category) filters.category = category;
      if (isActive !== null) filters.isActive = isActive === 'true';
      if (tags) filters.tags = tags;

      const templates = await AITemplateEngine.getTenantTemplates(
        tenantId,
        filters
      );
      return NextResponse.json({ templates });
    }
  } catch (error) {
    console.error('Error in Templates GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai-agent/templates - Create new template or test existing template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenantId, ...data } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        const newTemplate = await AITemplateEngine.createTemplate(
          tenantId,
          data
        );
        return NextResponse.json(newTemplate, { status: 201 });

      case 'test':
        if (!data.templateId || !data.testContext) {
          return NextResponse.json(
            { error: 'Template ID and test context are required' },
            { status: 400 }
          );
        }

        const testResult = await AITemplateEngine.testTemplate(
          data.templateId,
          data.testContext
        );
        return NextResponse.json(testResult);

      case 'clone':
        if (!data.sourceTemplateId || !data.targetTenantId) {
          return NextResponse.json(
            { error: 'Source template ID and target tenant ID are required' },
            { status: 400 }
          );
        }

        const clonedTemplate = await AITemplateEngine.cloneTemplate(
          data.sourceTemplateId,
          data.targetTenantId,
          data.customizations
        );
        return NextResponse.json(clonedTemplate, { status: 201 });

      case 'process':
        if (!data.templateId || !data.context) {
          return NextResponse.json(
            { error: 'Template ID and context are required' },
            { status: 400 }
          );
        }

        const processResult = await AITemplateEngine.processTemplate(
          data.templateId,
          data.context
        );
        return NextResponse.json(processResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in Templates POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-agent/templates - Update template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, updates } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const updatedTemplate = await AITemplateEngine.updateTemplate(
      templateId,
      updates
    );
    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error in Templates PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-agent/templates - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting inactive
    await AITemplateEngine.updateTemplate(templateId, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Templates DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
