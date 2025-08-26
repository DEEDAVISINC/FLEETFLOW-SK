import { NextRequest, NextResponse } from 'next/server';
import { aiAuditLogger } from '../services/AIAuditLogger';
import { aiDataSanitizer } from '../services/AIDataSanitizer';
import { aiResponseFilter } from '../services/AIResponseFilter';
import { aiRoleBasedAccessService } from '../services/AIRoleBasedAccessService';
import { aiSecurityService } from '../services/AISecurityService';
import { aiTenantContextService } from '../services/AITenantContextService';
import { aiTenantIsolationService } from '../services/AITenantIsolationService';

/**
 * Middleware to protect AI-related API routes from prompt injection,
 * data leakage, and unauthorized access
 */
export async function aiSecurityMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();

  // Extract operation details from request
  const url = req.nextUrl.pathname;
  const operation = getOperationFromUrl(url);
  const body = await req.json().catch(() => ({}));

  // Skip security checks for non-AI operations
  if (!isAIOperation(operation)) {
    return handler(req);
  }

  // Extract security context
  const userId = req.headers.get('x-user-id') || 'anonymous';
  const userRole = req.headers.get('x-user-role') || 'driver';
  const tenantId = req.headers.get('x-tenant-id');
  const sessionId = req.headers.get('x-session-id') || `session_${Date.now()}`;
  const ipAddress =
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const userAgent = req.headers.get('user-agent');

  // ================================
  // MULTI-TENANT CONTEXT VALIDATION
  // ================================
  if (!tenantId) {
    return NextResponse.json(
      {
        error: 'Tenant context required',
        message: 'All AI operations must be associated with a tenant',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Set tenant context for AI operations
  aiTenantContextService.setTenantContext(sessionId, tenantId);
  console.log(
    `🏢 AI request for tenant: ${tenantId}, session: ${sessionId}, operation: ${operation}`
  );

  // Validate tenant has AI access
  const tenantConfig = aiTenantContextService.getTenantAIConfig(tenantId);
  if (!tenantConfig.aiFeatures.enabled.length) {
    return NextResponse.json(
      {
        error: 'AI features not enabled',
        message: 'AI features are not enabled for this tenant',
        tenantId,
      },
      { status: 403 }
    );
  }

  try {
    // Extract prompt and data from request
    const prompt = extractPrompt(body, operation);
    const data = extractData(body, operation);

    // Apply tenant-specific data context filtering
    const tenantFilteredData =
      aiTenantContextService.getTenantAIConfig(tenantId);
    console.log(
      `🔍 Applied tenant-specific context for ${tenantConfig.organizationName} (${tenantConfig.businessType})`
    );

    // Merge tenant business context into data
    const contextEnhancedData = {
      ...data,
      tenantContext: {
        businessType: tenantConfig.businessType,
        organizationName: tenantConfig.organizationName,
        primaryLanes: tenantConfig.dataContext.operations.primaryLanes,
        equipmentTypes: tenantConfig.dataContext.operations.equipmentTypes,
        riskTolerance: tenantConfig.businessContext.riskTolerance,
        communicationStyle: tenantConfig.aiPersonality.communicationStyle,
      },
    };

    // ================================
    // SECURITY LAYER 1: ROLE-BASED ACCESS CONTROL
    // ================================
    const accessRequest = {
      userId,
      userRole,
      requestedResource: operation,
      requestedAction: 'execute',
      dataContext: { ...contextEnhancedData, prompt },
      sessionInfo: {
        sessionId,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
    };

    const accessResult = aiRoleBasedAccessService.checkAIAccess(accessRequest);
    if (!accessResult.allowed) {
      // Log access denial
      aiAuditLogger.logAIEvent({
        eventType: 'access_denied',
        userId,
        tenantId,
        sessionId,
        operation,
        violations: [
          {
            type: 'access_denied',
            severity: 'medium',
            description: `Access denied: ${accessResult.deniedReasons.join(', ')}`,
            evidence: accessResult.deniedReasons,
            action: 'blocked',
            resolved: true,
          },
        ],
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Access denied',
          details: accessResult.deniedReasons,
          auditId: accessResult.auditId,
        },
        { status: 403 }
      );
    }

    // ================================
    // SECURITY LAYER 2: TENANT ISOLATION
    // ================================
    if (tenantId) {
      const isolationContext = {
        operationType: operation,
        requestedData: Object.keys(contextEnhancedData),
        aiModel: tenantConfig.aiFeatures.models[0] || 'unknown',
        purpose: operation,
        userRole,
        sessionId,
      };

      const isolationResult = aiTenantIsolationService.validateTenantIsolation(
        tenantId,
        isolationContext,
        { ...contextEnhancedData, prompt }
      );

      if (!isolationResult.allowed) {
        // Log tenant isolation violation
        aiAuditLogger.logAIEvent({
          eventType: 'tenant_isolation_violation',
          userId,
          tenantId,
          sessionId,
          operation,
          violations: isolationResult.violations.map((v) => ({
            type: v.type,
            severity: v.severity,
            description: v.description,
            evidence: v.evidence,
            action: 'blocked',
            resolved: true,
          })),
          ipAddress,
          userAgent,
        });

        return NextResponse.json(
          {
            error: 'Tenant isolation violation',
            details: isolationResult.violations.map((v) => v.description),
            auditId: isolationResult.auditTrail,
          },
          { status: 403 }
        );
      }

      // Use isolated data and merge with tenant context
      Object.assign(contextEnhancedData, isolationResult.sanitizedData);
    }

    // ================================
    // SECURITY LAYER 3: TENANT-AWARE DATA SANITIZATION
    // ================================
    const sanitizationConfig = {
      level:
        tenantConfig.securityProfile.dataClassification === 'restricted'
          ? 'standard'
          : tenantConfig.securityProfile.dataClassification === 'confidential'
            ? 'strict'
            : ('maximum' as const),
      preserveStructure: true,
      allowAnalytics:
        ['manager', 'admin'].includes(userRole) &&
        tenantConfig.aiFeatures.enabled.includes('business_analytics'),
      tenantId,
      industryContext:
        tenantConfig.businessType === 'freight_broker'
          ? 'transportation'
          : tenantConfig.businessType,
    };

    // Apply tenant-specific data filtering before sanitization
    const tenantFilteredData =
      await aiTenantContextService.processTenantAwareRequest({
        tenantId,
        operation,
        context: getOperationContext(operation),
        data: contextEnhancedData,
        userRole,
        sessionId,
      });

    console.log(
      `🏢 Applied ${tenantConfig.organizationName} business context and rules`
    );

    const sanitizationResult = aiDataSanitizer.sanitizeForAI(
      tenantFilteredData.response || contextEnhancedData,
      prompt,
      sanitizationConfig
    );

    if (!sanitizationResult.safe) {
      // Log data sanitization failure
      aiAuditLogger.logAIEvent({
        eventType: 'security_violation',
        userId,
        tenantId,
        sessionId,
        operation,
        violations: [
          {
            type: 'data_sanitization_failure',
            severity: 'critical',
            description:
              'Data contains unsafe content that cannot be sanitized',
            evidence: sanitizationResult.redactedFields,
            action: 'blocked',
            resolved: true,
          },
        ],
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Data safety violation',
          details: 'Request contains unsafe content',
          riskScore: sanitizationResult.riskScore,
        },
        { status: 403 }
      );
    }

    // ================================
    // SECURITY LAYER 4: FINAL SECURITY VALIDATION
    // ================================
    const policyId = getPolicyIdForOperation(operation);
    const securityValidation = aiSecurityService.validateOperation(
      {
        operation,
        prompt: sanitizationResult.sanitizedText,
        data: sanitizationResult.sanitizedData,
        metadata: {
          source: 'api',
          purpose: operation,
          userId,
          tenantId,
          sessionId,
          ipAddress,
        },
      },
      policyId
    );

    if (!securityValidation.allowed) {
      // Log security violation
      aiAuditLogger.logAIEvent({
        eventType: 'security_violation',
        userId,
        tenantId,
        sessionId,
        operation,
        violations: securityValidation.blockReasons.map((reason) => ({
          type: 'security_policy_violation',
          severity: 'high',
          description: reason,
          evidence: [reason],
          action: 'blocked',
          resolved: true,
        })),
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Security validation failed',
          details: securityValidation.blockReasons,
          auditId: securityValidation.auditId,
        },
        { status: 403 }
      );
    }

    // ================================
    // SECURITY LAYER 5: CREATE SECURE REQUEST
    // ================================
    const secureBody = { ...body };

    // Update with sanitized data
    updatePromptInBody(secureBody, operation, sanitizationResult.sanitizedText);
    Object.assign(secureBody, sanitizationResult.sanitizedData);

    // Create secure request
    const secureReq = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(secureBody),
      redirect: req.redirect,
      signal: req.signal,
    });

    // Add security context headers
    secureReq.headers.set('x-ai-security-validated', 'true');
    secureReq.headers.set('x-ai-security-audit-id', securityValidation.auditId);
    secureReq.headers.set('x-ai-sanitization-applied', 'true');
    secureReq.headers.set(
      'x-ai-risk-level',
      sanitizationResult.riskScore.toString()
    );

    // ================================
    // EXECUTE SECURE REQUEST
    // ================================
    const response = await handler(secureReq as unknown as NextRequest);

    // ================================
    // SECURITY LAYER 6: RESPONSE FILTERING
    // ================================
    if (response.ok) {
      try {
        const responseBody = await response.text();

        // Determine context for response filtering
        const context = operation.includes('customer')
          ? 'customer_facing'
          : 'internal';
        const filterConfig = {
          userRole,
          tenantId,
          dataAccessLevel:
            accessResult.effectivePermissions[0]?.dataFilters?.includes(
              'basic_info_only'
            )
              ? ('public' as const)
              : userRole === 'admin'
                ? ('restricted' as const)
                : userRole === 'manager'
                  ? ('confidential' as const)
                  : ('internal' as const),
          context: context as
            | 'customer_facing'
            | 'internal'
            | 'admin'
            | 'debug',
          complianceRequirements: ['GDPR', 'CCPA'],
          filterLevel: sanitizationConfig.level,
        };

        const filteredResult = aiResponseFilter.filterResponse(
          responseBody,
          filterConfig
        );

        // Create filtered response
        const filteredResponse = new Response(filteredResult.filteredResponse, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

        // Add filtering metadata headers
        filteredResponse.headers.set('x-ai-response-filtered', 'true');
        filteredResponse.headers.set(
          'x-ai-filter-censors',
          JSON.stringify(filteredResult.censorsApplied)
        );
        filteredResponse.headers.set(
          'x-ai-response-safe',
          filteredResult.safe.toString()
        );

        // ================================
        // SECURITY LAYER 7: COMPREHENSIVE AUDIT LOGGING
        // ================================
        const processingTime = Date.now() - startTime;

        aiAuditLogger.logAIEvent({
          eventType: 'ai_request',
          userId,
          tenantId,
          sessionId,
          operation,
          aiModel: 'unknown', // Could be extracted from response
          inputData: {
            promptLength: prompt.length,
            dataSize: JSON.stringify(data).length,
            hasPersonalData: sanitizationResult.redactedFields.some((f) =>
              f.includes('pii')
            ),
            hasFinancialData: sanitizationResult.redactedFields.some((f) =>
              f.includes('financial')
            ),
            hasCrossTenantData: false, // Would be detected by tenant isolation
            riskLevel:
              sanitizationResult.riskScore > 75
                ? 'critical'
                : sanitizationResult.riskScore > 50
                  ? 'high'
                  : sanitizationResult.riskScore > 25
                    ? 'medium'
                    : 'low',
          },
          outputData: {
            responseLength: filteredResult.filteredResponse.length,
            containsSensitiveInfo:
              filteredResult.sensitiveDataRemoved.length > 0,
            wasFiltered: filteredResult.censorsApplied.length > 0,
            riskLevel: filteredResult.riskLevel,
          },
          securityChecks: {
            tenantIsolationPassed: true,
            roleBasedAccessPassed: accessResult.allowed,
            dataFilteringApplied: sanitizationResult.redactedFields.length > 0,
            threatScanPassed: securityValidation.allowed,
          },
          performance: {
            processingTime,
            securityOverhead: processingTime * 0.3, // Estimate security processing time
            cost: 0.1, // Estimated cost
          },
          violations: [],
          ipAddress,
          userAgent,
          metadata: {
            sanitizationLevel: sanitizationConfig.level,
            filteringApplied: filteredResult.censorsApplied,
            originalPromptLength: prompt.length,
            finalPromptLength: sanitizationResult.sanitizedText.length,
            responseReduction:
              (
                ((responseBody.length -
                  filteredResult.filteredResponse.length) /
                  responseBody.length) *
                100
              ).toFixed(2) + '%',
          },
        });

        return filteredResponse;
      } catch (error) {
        console.error('Response filtering error:', error);

        // Log error but return original response
        aiAuditLogger.logAIEvent({
          eventType: 'system_error',
          userId,
          tenantId,
          sessionId,
          operation,
          violations: [
            {
              type: 'response_filtering_error',
              severity: 'medium',
              description:
                'Response filtering failed, original response returned',
              evidence: [error?.toString() || 'Unknown error'],
              action: 'logged',
              resolved: false,
            },
          ],
          ipAddress,
          userAgent,
        });

        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('AI Security Middleware Error:', error);

    // Log critical system error
    aiAuditLogger.logAIEvent({
      eventType: 'system_error',
      userId,
      tenantId,
      sessionId,
      operation,
      violations: [
        {
          type: 'middleware_error',
          severity: 'critical',
          description: 'AI security middleware encountered a critical error',
          evidence: [error?.toString() || 'Unknown error'],
          action: 'blocked',
          resolved: true,
        },
      ],
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        error: 'AI Security System Error',
        message:
          'A critical security error occurred. Request has been blocked for safety.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Determine if an operation is AI-related and requires security checks
 */
function isAIOperation(operation: string): boolean {
  // Explicit AI operation prefixes
  const aiOperationPrefixes = [
    // General AI prefixes
    'ai.',
    'llm.',
    'ml.',
    'model.',

    // Specific AI systems
    'openai.',
    'claude.',
    'gpt.',
    'gemini.',
    'anthropic.',
    'mistral.',
    'cohere.',
    'huggingface.',

    // AI capabilities
    'embedding.',
    'vector.',
    'completion.',
    'chat.',
    'generation.',
    'summarization.',
    'classification.',
    'translation.',
    'transcription.',
    'analysis.',
    'sentiment.',
    'recommendation.',
    'prediction.',

    // FleetFlow specific AI integrations
    'brokersnapshot.',
    'ai-flow.',
    'ai-agent.',
    'ai-company-dashboard.',
    'ai-email.',
    'ai-insurance.',
    'ai-staff.',
    'ai-voice.',
  ];

  // Check for direct prefix match
  if (aiOperationPrefixes.some((prefix) => operation.startsWith(prefix))) {
    return true;
  }

  // Check for AI-related keywords in the operation name
  const aiKeywords = [
    'analyze',
    'predict',
    'generate',
    'summarize',
    'classify',
    'recommend',
    'optimize',
    'detect',
    'extract',
    'infer',
    'learn',
    'train',
    'intelligence',
    'smart',
    'neural',
    'cognitive',
    'nlp',
    'vision',
    'speech',
  ];

  for (const keyword of aiKeywords) {
    if (operation.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Extract operation name from URL path
 */
function getOperationFromUrl(url: string): string {
  // Map URL patterns to operation names
  const urlMappings: Record<string, string> = {
    // BROKERSNAPSHOT operations
    '/api/brokersnapshot/review/post': 'brokersnapshot.review.post',
    '/api/brokersnapshot/review/remove': 'brokersnapshot.review.remove',

    // General AI operations
    '/api/ai/generate': 'ai.generate',
    '/api/ai/chat': 'ai.chat',
    '/api/ai/complete': 'ai.complete',
    '/api/ai/embedding': 'ai.embedding',

    // Email AI operations
    '/api/automation/email-intelligence/route': 'ai.email.intelligence',
    '/api/automation/sales-email/route': 'ai.email.sales',
    '/api/email/universal/route': 'ai.email.universal',

    // Customer service AI
    '/api/ai/customer-service/response': 'ai.response.generate',
    '/api/ai/customer-service/sentiment': 'ai.sentiment.analyze',
    '/api/ai/customer-service/summarize': 'ai.ticket.summarize',

    // Logistics AI
    '/api/ai/logistics/route-optimization': 'ai.route.optimize',
    '/api/ai/logistics/load-matching': 'ai.load.match',
    '/api/ai/logistics/driver-recommendation': 'ai.driver.recommend',
    '/api/ai/logistics/eta-prediction': 'ai.eta.predict',

    // Finance AI
    '/api/ai/finance/invoice-analysis': 'ai.invoice.analyze',
    '/api/ai/finance/payment-prediction': 'ai.payment.predict',
    '/api/ai/finance/expense-categorization': 'ai.expense.categorize',
    '/api/ai/finance/anomaly-detection': 'ai.anomaly.detect',

    // Voice AI
    '/api/twilio-calls/transcribe': 'ai.voice.transcribe',

    // Multi-state quotes
    '/api/multi-state-quotes/route': 'ai.quotes.multi-state',

    // Go with the flow AI
    '/api/go-with-the-flow/admin/route': 'ai.flow.admin',
    '/api/go-with-the-flow/driver/route': 'ai.flow.driver',
    '/api/go-with-the-flow/shipper/route': 'ai.flow.shipper',
  };

  // Check for exact matches
  if (urlMappings[url]) {
    return urlMappings[url];
  }

  // Check for pattern matches using regex
  const patternMappings: [RegExp, string][] = [
    // BROKERSNAPSHOT operations
    [/^\/api\/brokersnapshot\//, 'brokersnapshot.api'],

    // General AI operations
    [/^\/api\/ai\//, 'ai.api'],
    [/^\/api\/llm\//, 'llm.api'],
    [/^\/api\/ml\//, 'ml.api'],

    // Email AI operations
    [/^\/api\/automation\/email/, 'ai.email'],
    [/^\/api\/email\//, 'ai.email'],

    // Customer service AI
    [/^\/api\/customer-service\/ai/, 'ai.customer-service'],

    // Logistics AI
    [/^\/api\/logistics\/ai/, 'ai.logistics'],
    [/^\/api\/dispatch\/ai/, 'ai.dispatch'],

    // Finance AI
    [/^\/api\/finance\/ai/, 'ai.finance'],
    [/^\/api\/billing\/ai/, 'ai.billing'],
    [/^\/api\/accounting\/ai/, 'ai.accounting'],

    // Voice AI
    [/^\/api\/twilio-calls\//, 'ai.voice'],

    // Multi-state quotes
    [/^\/api\/multi-state-quotes\//, 'ai.quotes'],

    // Go with the flow AI
    [/^\/api\/go-with-the-flow\//, 'ai.flow'],

    // Load optimization
    [/^\/api\/load-optimization\//, 'ai.load.optimization'],

    // AI components
    [/^\/api\/ai-flow\//, 'ai-flow.api'],
    [/^\/api\/ai-agent\//, 'ai-agent.api'],
    [/^\/api\/ai-company-dashboard\//, 'ai-company-dashboard.api'],
    [/^\/api\/ai-email\//, 'ai-email.api'],
    [/^\/api\/ai-insurance\//, 'ai-insurance.api'],
    [/^\/api\/ai-staff\//, 'ai-staff.api'],
    [/^\/api\/ai-voice\//, 'ai-voice.api'],
  ];

  for (const [pattern, operation] of patternMappings) {
    if (pattern.test(url)) {
      return operation;
    }
  }

  // Extract operation from URL path segments
  const segments = url.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[0] === 'api') {
    // Look for AI-related keywords in the path segments
    for (const segment of segments) {
      if (
        segment.includes('ai') ||
        segment.includes('ml') ||
        segment.includes('gpt') ||
        segment.includes('analyze') ||
        segment.includes('predict') ||
        segment.includes('generate')
      ) {
        return `${segments[1]}.${segment}`;
      }
    }

    // Fallback to api.{service}.{operation} format
    return `api.${segments[1]}.${segments[segments.length - 1]}`;
  }

  // Default fallback
  return 'unknown.operation';
}

/**
 * Extract prompt from request body based on operation type
 */
function extractPrompt(body: any, operation: string): string {
  if (!body) return '';

  // Different operations might store prompts in different fields
  if (operation.startsWith('brokersnapshot.review')) {
    return body.comment || body.review?.comment || '';
  }

  // Email operations
  if (operation.includes('email')) {
    return (
      body.emailContent ||
      body.subject ||
      body.body ||
      body.template ||
      body.message ||
      body.emailBody ||
      ''
    );
  }

  // Voice operations
  if (operation.includes('voice') || operation.includes('transcribe')) {
    return body.transcript || body.audioText || body.speechInput || '';
  }

  // Customer service operations
  if (
    operation.includes('customer') ||
    operation.includes('support') ||
    operation.includes('ticket')
  ) {
    return (
      body.customerQuery || body.ticketDescription || body.userMessage || ''
    );
  }

  // Logistics operations
  if (
    operation.includes('route') ||
    operation.includes('logistics') ||
    operation.includes('dispatch')
  ) {
    return (
      body.routeDescription ||
      body.loadDetails ||
      body.dispatchInstructions ||
      ''
    );
  }

  // Finance operations
  if (
    operation.includes('finance') ||
    operation.includes('invoice') ||
    operation.includes('payment')
  ) {
    return (
      body.financialData || body.invoiceDescription || body.paymentDetails || ''
    );
  }

  // Standard AI operations
  if (
    operation.startsWith('ai.') ||
    operation.startsWith('llm.') ||
    operation.startsWith('gpt.') ||
    operation.startsWith('claude.')
  ) {
    // Handle different AI input formats
    if (body.messages && Array.isArray(body.messages)) {
      // Chat format (array of messages)
      return body.messages[body.messages.length - 1]?.content || '';
    }

    if (body.prompt) {
      // Direct prompt
      return body.prompt;
    }

    if (body.inputs && typeof body.inputs === 'object') {
      // Structured inputs (common in some AI APIs)
      return JSON.stringify(body.inputs);
    }
  }

  // Default to common field names
  return (
    body.prompt ||
    body.input ||
    body.text ||
    body.content ||
    body.query ||
    body.instruction ||
    body.request ||
    ''
  );
}

/**
 * Extract relevant data from request body based on operation type
 */
function extractData(body: any, operation: string): any {
  if (!body) return {};

  // Different operations might have different data structures
  if (operation.startsWith('brokersnapshot.review')) {
    return {
      carrier_details: {
        mcNumber: body.mcNumber || '',
        carrierName: body.carrierName || '',
      },
      review_details: {
        reviewType: body.reviewType || '',
        rating: body.rating || 0,
      },
    };
  }

  // Email operations
  if (operation.includes('email')) {
    return {
      email_details: {
        subject: body.subject || '',
        recipient: body.recipient ? maskEmailAddress(body.recipient) : '',
        sender: body.sender ? maskEmailAddress(body.sender) : '',
        cc: body.cc ? maskEmailAddresses(body.cc) : [],
        bcc: body.bcc ? maskEmailAddresses(body.bcc) : [],
        hasAttachments: !!body.attachments,
      },
      email_metadata: {
        templateId: body.templateId || '',
        category: body.category || '',
        priority: body.priority || '',
      },
    };
  }

  // Voice operations
  if (operation.includes('voice') || operation.includes('transcribe')) {
    return {
      call_details: {
        callId: body.callId || '',
        duration: body.duration || '',
        callType: body.callType || '',
        hasRecording: !!body.recording,
      },
      caller_details: {
        callerType: body.callerType || '',
        // Mask phone numbers
        phoneNumber: body.phoneNumber ? maskPhoneNumber(body.phoneNumber) : '',
      },
    };
  }

  // Customer service operations
  if (
    operation.includes('customer') ||
    operation.includes('support') ||
    operation.includes('ticket')
  ) {
    return {
      ticket_details: {
        ticketId: body.ticketId || '',
        category: body.category || '',
        priority: body.priority || '',
        status: body.status || '',
      },
      customer_details: {
        customerType: body.customerType || '',
        accountId: body.accountId || '',
      },
    };
  }

  // Logistics operations
  if (
    operation.includes('route') ||
    operation.includes('logistics') ||
    operation.includes('dispatch')
  ) {
    return {
      route_details: {
        origin: body.origin || '',
        destination: body.destination || '',
        distance: body.distance || '',
        estimatedTime: body.estimatedTime || '',
      },
      load_details: {
        loadId: body.loadId || '',
        weight: body.weight || '',
        dimensions: body.dimensions || '',
        commodity: body.commodity || '',
      },
      vehicle_details: {
        vehicleType: body.vehicleType || '',
        capacity: body.capacity || '',
      },
    };
  }

  // Finance operations
  if (
    operation.includes('finance') ||
    operation.includes('invoice') ||
    operation.includes('payment')
  ) {
    return {
      invoice_details: {
        invoiceId: body.invoiceId || '',
        amount: body.amount || '',
        currency: body.currency || '',
        dueDate: body.dueDate || '',
        status: body.status || '',
      },
      // Mask any payment method details
      payment_details: maskPaymentDetails(body.paymentDetails || {}),
    };
  }

  // For other operations, return a safe subset of the body
  const safeCopy = { ...body };

  // Remove potentially sensitive fields
  const sensitiveFields = [
    'apiKey',
    'key',
    'secret',
    'token',
    'password',
    'credentials',
    'auth',
    'authorization',
    'jwt',
    'accessToken',
    'refreshToken',
    'privateKey',
    'clientSecret',
    'ssn',
    'socialSecurityNumber',
    'dob',
    'dateOfBirth',
    'cardNumber',
    'cvv',
    'cvc',
    'pin',
    'accountNumber',
    'routingNumber',
    'taxId',
    'ein',
    'passport',
  ];

  sensitiveFields.forEach((field) => {
    delete safeCopy[field];

    // Also check for camelCase, snake_case, and PascalCase variants
    delete safeCopy[field.charAt(0).toUpperCase() + field.slice(1)];
    delete safeCopy[field.toLowerCase()];
    delete safeCopy[field.replace(/([A-Z])/g, '_$1').toLowerCase()];
  });

  return safeCopy;
}

/**
 * Helper function to mask email addresses
 */
function maskEmailAddress(email: string): string {
  if (!email || typeof email !== 'string') return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;

  const name = parts[0];
  const domain = parts[1];

  // Show first character and last character of name part
  const maskedName =
    name.length > 2
      ? `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`
      : name;

  return `${maskedName}@${domain}`;
}

/**
 * Helper function to mask multiple email addresses
 */
function maskEmailAddresses(emails: string | string[]): string[] {
  if (!emails) return [];

  if (typeof emails === 'string') {
    // Split by comma if it's a comma-separated string
    const emailArray = emails.split(',').map((e) => e.trim());
    return emailArray.map(maskEmailAddress);
  }

  if (Array.isArray(emails)) {
    return emails.map(maskEmailAddress);
  }

  return [];
}

/**
 * Helper function to mask phone numbers
 */
function maskPhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // Remove non-numeric characters
  const digits = phone.replace(/\D/g, '');

  // Keep country code and last 2 digits visible
  if (digits.length > 4) {
    const visibleStart = digits.length > 10 ? 3 : 0; // Keep country code if present
    return `${digits.substring(0, visibleStart)}${'*'.repeat(digits.length - visibleStart - 2)}${digits.slice(-2)}`;
  }

  return phone;
}

/**
 * Helper function to mask payment details
 */
function maskPaymentDetails(details: any): any {
  if (!details || typeof details !== 'object') return {};

  const masked = { ...details };

  // Mask card number
  if (masked.cardNumber) {
    masked.cardNumber = masked.cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  // Remove CVV completely
  delete masked.cvv;
  delete masked.cvc;
  delete masked.securityCode;

  // Mask account number
  if (masked.accountNumber) {
    masked.accountNumber = `****${masked.accountNumber.slice(-4)}`;
  }

  // Mask routing number
  if (masked.routingNumber) {
    masked.routingNumber = `****${masked.routingNumber.slice(-4)}`;
  }

  return masked;
}

/**
 * Update prompt in request body based on operation type
 */
function updatePromptInBody(
  body: any,
  operation: string,
  sanitizedPrompt: string
): void {
  if (!body) return;

  // BROKERSNAPSHOT operations
  if (operation.startsWith('brokersnapshot.review')) {
    if (body.comment) {
      body.comment = sanitizedPrompt;
    } else if (body.review?.comment) {
      body.review.comment = sanitizedPrompt;
    }
    return;
  }

  // Email operations
  if (operation.includes('email')) {
    if (body.emailContent) body.emailContent = sanitizedPrompt;
    if (body.subject) body.subject = sanitizedPrompt;
    if (body.body) body.body = sanitizedPrompt;
    if (body.template) body.template = sanitizedPrompt;
    if (body.message) body.message = sanitizedPrompt;
    if (body.emailBody) body.emailBody = sanitizedPrompt;
    return;
  }

  // Voice operations
  if (operation.includes('voice') || operation.includes('transcribe')) {
    if (body.transcript) body.transcript = sanitizedPrompt;
    if (body.audioText) body.audioText = sanitizedPrompt;
    if (body.speechInput) body.speechInput = sanitizedPrompt;
    return;
  }

  // Customer service operations
  if (
    operation.includes('customer') ||
    operation.includes('support') ||
    operation.includes('ticket')
  ) {
    if (body.customerQuery) body.customerQuery = sanitizedPrompt;
    if (body.ticketDescription) body.ticketDescription = sanitizedPrompt;
    if (body.userMessage) body.userMessage = sanitizedPrompt;
    return;
  }

  // Logistics operations
  if (
    operation.includes('route') ||
    operation.includes('logistics') ||
    operation.includes('dispatch')
  ) {
    if (body.routeDescription) body.routeDescription = sanitizedPrompt;
    if (body.loadDetails) body.loadDetails = sanitizedPrompt;
    if (body.dispatchInstructions) body.dispatchInstructions = sanitizedPrompt;
    return;
  }

  // Finance operations
  if (
    operation.includes('finance') ||
    operation.includes('invoice') ||
    operation.includes('payment')
  ) {
    if (body.financialData) body.financialData = sanitizedPrompt;
    if (body.invoiceDescription) body.invoiceDescription = sanitizedPrompt;
    if (body.paymentDetails) body.paymentDetails = sanitizedPrompt;
    return;
  }

  // Standard AI operations
  if (
    operation.startsWith('ai.') ||
    operation.startsWith('llm.') ||
    operation.startsWith('gpt.') ||
    operation.startsWith('claude.')
  ) {
    // Handle different AI input formats
    if (
      body.messages &&
      Array.isArray(body.messages) &&
      body.messages.length > 0
    ) {
      // Chat format (array of messages)
      body.messages[body.messages.length - 1].content = sanitizedPrompt;
      return;
    }

    if (body.prompt !== undefined) {
      // Direct prompt
      body.prompt = sanitizedPrompt;
      return;
    }

    if (body.inputs && typeof body.inputs === 'object') {
      // For structured inputs, we need to be careful about how we sanitize
      // Since we can't know the exact structure, we'll add a sanitized version
      body.sanitized_inputs = sanitizedPrompt;
      return;
    }
  }

  // Try common field names as a fallback
  const commonFields = [
    'prompt',
    'input',
    'text',
    'content',
    'query',
    'instruction',
    'request',
    'message',
    'data',
  ];

  let updated = false;
  for (const field of commonFields) {
    if (body[field] !== undefined) {
      body[field] = sanitizedPrompt;
      updated = true;
    }
  }

  // If we couldn't find a field to update, add a new field as a last resort
  if (!updated) {
    body.sanitized_input = sanitizedPrompt;
  }
}

/**
 * Determine which security policy to apply based on operation
 */
function getPolicyIdForOperation(operation: string): string {
  // Apply specific policies based on operation prefix
  if (operation.startsWith('brokersnapshot.')) {
    return 'policy_brokersnapshot_default';
  }

  // Customer service operations
  if (
    operation.startsWith('ai.chat') ||
    operation.startsWith('ai.email') ||
    operation.startsWith('ai.response') ||
    operation.startsWith('ai.ticket') ||
    operation.startsWith('ai.sentiment')
  ) {
    return 'policy_customer_service';
  }

  // Logistics operations
  if (
    operation.startsWith('ai.route') ||
    operation.startsWith('ai.load') ||
    operation.startsWith('ai.driver') ||
    operation.startsWith('ai.eta') ||
    operation.startsWith('ai.delay') ||
    operation.startsWith('ai.dispatch')
  ) {
    return 'policy_logistics';
  }

  // Finance operations
  if (
    operation.startsWith('ai.invoice') ||
    operation.startsWith('ai.payment') ||
    operation.startsWith('ai.expense') ||
    operation.startsWith('ai.revenue') ||
    operation.startsWith('ai.anomaly') ||
    operation.startsWith('ai.billing') ||
    operation.startsWith('ai.accounting')
  ) {
    return 'policy_finance';
  }

  // Default to global policy for all other AI operations
  return 'policy_global_default';
}

/**
 * Map AI operation to tenant-aware context
 */
function getOperationContext(
  operation: string
): 'customer_service' | 'dispatch' | 'pricing' | 'analytics' | 'negotiation' {
  // Customer service operations
  if (
    operation.includes('chat') ||
    operation.includes('email') ||
    operation.includes('ticket') ||
    operation.includes('response') ||
    operation.includes('sentiment')
  ) {
    return 'customer_service';
  }

  // Dispatch and logistics operations
  if (
    operation.includes('route') ||
    operation.includes('load') ||
    operation.includes('dispatch') ||
    operation.includes('driver') ||
    operation.includes('eta') ||
    operation.includes('delay')
  ) {
    return 'dispatch';
  }

  // Pricing and rate operations
  if (
    operation.includes('rate') ||
    operation.includes('price') ||
    operation.includes('quote') ||
    operation.includes('negotiate') ||
    operation.includes('bid')
  ) {
    return 'pricing';
  }

  // Analytics and reporting
  if (
    operation.includes('analytic') ||
    operation.includes('report') ||
    operation.includes('insight') ||
    operation.includes('forecast') ||
    operation.includes('trend')
  ) {
    return 'analytics';
  }

  // Negotiation operations
  if (
    operation.includes('negotiate') ||
    operation.includes('counter') ||
    operation.includes('offer')
  ) {
    return 'negotiation';
  }

  // Default to customer service for unknown operations
  return 'customer_service';
}
