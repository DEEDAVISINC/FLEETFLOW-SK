import { NextRequest, NextResponse } from 'next/server';
import { AIAgentAnalyticsService } from '../../services/AIAgentAnalyticsService';
import { AIAgentOrchestrator } from '../../services/AIAgentOrchestrator';
import { AITemplateEngine } from '../../services/AITemplateEngine';

// GET /api/ai-agent - Get agent configuration or list all agents for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const action = searchParams.get('action');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'list':
        // List all agents for tenant
        const agents = await AIAgentOrchestrator.getTenantAgents(tenantId);
        return NextResponse.json({ agents });

      case 'status':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID is required for status' },
            { status: 400 }
          );
        }
        const status = await AIAgentOrchestrator.getAgentStatus(agentId);
        return NextResponse.json(status);

      case 'analytics':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID is required for analytics' },
            { status: 400 }
          );
        }
        const startDate = searchParams.get('startDate')
          ? new Date(searchParams.get('startDate')!)
          : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        const endDate = searchParams.get('endDate')
          ? new Date(searchParams.get('endDate')!)
          : new Date();

        const analytics = await AIAgentAnalyticsService.getPerformanceReport(
          tenantId,
          agentId,
          startDate,
          endDate
        );
        return NextResponse.json(analytics);

      case 'metrics':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID is required for metrics' },
            { status: 400 }
          );
        }
        const metrics = await AIAgentAnalyticsService.getRealTimeMetrics(
          tenantId,
          agentId
        );
        return NextResponse.json(metrics);

      default:
        if (agentId) {
          // Get specific agent configuration
          const agent = await AIAgentOrchestrator.getAgentConfig(agentId);
          if (!agent) {
            return NextResponse.json(
              { error: 'Agent not found' },
              { status: 404 }
            );
          }
          return NextResponse.json(agent);
        } else {
          // List all agents for tenant (default behavior)
          const agents = await AIAgentOrchestrator.getTenantAgents(tenantId);
          return NextResponse.json({ agents });
        }
    }
  } catch (error) {
    console.error('Error in AI Agent GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai-agent - Create new agent or execute agent actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenantId, contractorId, agentId, ...data } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        if (!contractorId) {
          return NextResponse.json(
            { error: 'Contractor ID is required for creation' },
            { status: 400 }
          );
        }

        const newAgent = await AIAgentOrchestrator.initializeAgent(
          tenantId,
          contractorId,
          data
        );
        return NextResponse.json(newAgent, { status: 201 });

      case 'execute':
        if (!agentId || !data.actionId) {
          return NextResponse.json(
            { error: 'Agent ID and Action ID are required for execution' },
            { status: 400 }
          );
        }

        const result = await AIAgentOrchestrator.executeAgentAction(
          agentId,
          data.actionId
        );
        return NextResponse.json(result);

      case 'process-lead':
        if (!data.leadData) {
          return NextResponse.json(
            { error: 'Lead data is required' },
            { status: 400 }
          );
        }

        await AIAgentOrchestrator.processIncomingLead(tenantId, data.leadData);
        return NextResponse.json({ success: true });

      case 'send-message':
        if (!agentId || !data.message) {
          return NextResponse.json(
            { error: 'Agent ID and message data are required' },
            { status: 400 }
          );
        }

        // Process message sending through agent
        const messageResult = await processAgentMessage(agentId, data.message);
        return NextResponse.json(messageResult);

      case 'record-interaction':
        if (!agentId || !data.interaction) {
          return NextResponse.json(
            { error: 'Agent ID and interaction data are required' },
            { status: 400 }
          );
        }

        await AIAgentAnalyticsService.recordInteraction(
          tenantId,
          agentId,
          data.interaction
        );
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in AI Agent POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-agent - Update agent configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, updates } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const updatedAgent = await AIAgentOrchestrator.updateAgentConfig(
      agentId,
      updates
    );
    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Error in AI Agent PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-agent - Deactivate or delete agent
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const permanent = searchParams.get('permanent') === 'true';

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    if (permanent) {
      // Permanently delete agent (implement based on your needs)
      await AIAgentOrchestrator.deleteAgent(agentId);
    } else {
      // Deactivate agent
      await AIAgentOrchestrator.updateAgentConfig(agentId, {
        is_active: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in AI Agent DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to process agent messages
async function processAgentMessage(agentId: string, messageData: any) {
  // This would integrate with your communication services
  // (Gmail, Twilio, social media APIs, etc.)

  try {
    const { channel, recipients, template, variables } = messageData;

    // Process template if provided
    let content = messageData.content;
    if (template && variables) {
      const templateResult = await AITemplateEngine.processTemplate(template, {
        variables,
        tenantId: messageData.tenantId,
        agentId,
        leadId: messageData.leadId,
      });
      content = templateResult.content;
    }

    // Route to appropriate communication channel
    switch (channel) {
      case 'email':
        // Integrate with Gmail API or SMTP service
        return await sendEmail({
          to: recipients,
          subject: messageData.subject,
          content,
          agentId,
        });

      case 'sms':
        // Integrate with Twilio SMS
        return await sendSMS({
          to: recipients,
          content,
          agentId,
        });

      case 'voice':
        // Integrate with Twilio Voice or FreeSWITCH
        return await makeCall({
          to: recipients,
          script: content,
          agentId,
        });

      case 'social_media':
        // Integrate with social media APIs
        return await postToSocialMedia({
          platform: messageData.platform,
          content,
          agentId,
        });

      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  } catch (error) {
    console.error('Error processing agent message:', error);
    throw error;
  }
}

// Placeholder communication functions (to be implemented)
async function sendEmail(params: any) {
  // Implementation would use Gmail API, SMTP, or email service
  console.log('Sending email:', params);
  return { success: true, messageId: 'email_' + Date.now() };
}

async function sendSMS(params: any) {
  // Implementation would use Twilio SMS API
  console.log('Sending SMS:', params);
  return { success: true, messageId: 'sms_' + Date.now() };
}

async function makeCall(params: any) {
  // Implementation would use Twilio Voice or FreeSWITCH
  console.log('Making call:', params);
  return { success: true, callId: 'call_' + Date.now() };
}

async function postToSocialMedia(params: any) {
  // Implementation would use social media APIs (Facebook, LinkedIn, Twitter)
  console.log('Posting to social media:', params);
  return { success: true, postId: 'post_' + Date.now() };
}
