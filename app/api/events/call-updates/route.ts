// Server-Sent Events for Real-time Call Updates
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for active connections (in production, use Redis)
const activeConnections = new Map<string, Set<WritableStreamDefaultWriter>>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new Response('Tenant ID required', { status: 400 });
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      console.log(`📡 SSE connection opened for tenant: ${tenantId}`);

      // Send initial connection event
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: 'connected',
            tenantId,
            timestamp: new Date().toISOString(),
          })}\n\n`
        )
      );

      // Store the controller for this tenant
      if (!activeConnections.has(tenantId)) {
        activeConnections.set(tenantId, new Set());
      }

      // Create a writer for this connection
      const writer = {
        write: (data: string) => {
          try {
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          } catch (error) {
            console.error('Error writing to SSE stream:', error);
          }
        },
        close: () => {
          try {
            controller.close();
          } catch (error) {
            console.error('Error closing SSE stream:', error);
          }
        },
      };

      activeConnections.get(tenantId)!.add(writer as any);

      // Set up periodic heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'heartbeat',
                timestamp: new Date().toISOString(),
              })}\n\n`
            )
          );
        } catch (error) {
          console.error('Heartbeat error:', error);
          clearInterval(heartbeat);
        }
      }, 30000); // 30 seconds

      // Cleanup on connection close
      const cleanup = () => {
        clearInterval(heartbeat);
        const connections = activeConnections.get(tenantId);
        if (connections) {
          connections.delete(writer as any);
          if (connections.size === 0) {
            activeConnections.delete(tenantId);
          }
        }
        console.log(`📡 SSE connection closed for tenant: ${tenantId}`);
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);

      // Handle stream errors
      controller.error = (error: any) => {
        console.error('SSE stream error:', error);
        cleanup();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, event, data } = body;

    if (!tenantId || !event || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantId, event, data' },
        { status: 400 }
      );
    }

    // Broadcast to all connections for this tenant
    const connections = activeConnections.get(tenantId);
    if (connections && connections.size > 0) {
      const message = JSON.stringify({
        type: event,
        data,
        timestamp: new Date().toISOString(),
      });

      let successCount = 0;
      let errorCount = 0;

      connections.forEach((writer) => {
        try {
          (writer as any).write(message);
          successCount++;
        } catch (error) {
          console.error('Error broadcasting to connection:', error);
          errorCount++;
          // Remove failed connections
          connections.delete(writer);
        }
      });

      console.log(
        `📡 Broadcasted ${event} to ${successCount} connections for tenant ${tenantId}`
      );

      if (errorCount > 0) {
        console.warn(`⚠️ Failed to broadcast to ${errorCount} connections`);
      }

      return NextResponse.json({
        success: true,
        message: `Broadcasted to ${successCount} connections`,
        connectionsCount: connections.size,
      });
    } else {
      console.log(`📡 No active connections for tenant ${tenantId}`);
      return NextResponse.json({
        success: true,
        message: 'No active connections',
        connectionsCount: 0,
      });
    }
  } catch (error) {
    console.error('Error broadcasting event:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast event' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    },
  });
}

// Utility function to get connection stats
export async function getConnectionStats() {
  const stats = new Map();

  for (const [tenantId, connections] of activeConnections.entries()) {
    stats.set(tenantId, {
      connectionCount: connections.size,
      lastActivity: new Date().toISOString(),
    });
  }

  return {
    totalTenants: activeConnections.size,
    totalConnections: Array.from(activeConnections.values()).reduce(
      (sum, connections) => sum + connections.size,
      0
    ),
    tenantStats: Object.fromEntries(stats),
  };
}

