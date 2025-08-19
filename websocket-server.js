#!/usr/bin/env node

/**
 * 🔗 FleetFlow WebSocket Notification Server
 *
 * Real-time notification synchronization across all FleetFlow portals
 * Supports WebSocket and Socket.IO protocols
 *
 * Usage:
 *   node websocket-server.js [--port 3001] [--cors-origin http://localhost:3000]
 */

const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Configuration from environment or command line
const PORT =
  process.env.WEBSOCKET_PORT ||
  process.argv.find((arg) => arg.startsWith('--port'))?.split('=')[1] ||
  3001;
const CORS_ORIGIN =
  process.env.SOCKET_IO_CORS_ORIGIN ||
  process.argv.find((arg) => arg.startsWith('--cors-origin'))?.split('=')[1] ||
  'http://localhost:3000';

// Server state
const clients = new Map();
const channels = new Map(); // portal -> Set<clientId>
const messageQueue = new Map(); // clientId -> [messages]
const stats = {
  totalConnections: 0,
  activeConnections: 0,
  messagesSent: 0,
  messagesReceived: 0,
  startTime: Date.now(),
};

console.log(`🚀 FleetFlow WebSocket Notification Server starting...`);
console.log(`📡 Port: ${PORT}`);
console.log(`🌐 CORS Origin: ${CORS_ORIGIN}`);

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health') {
    const uptime = Date.now() - stats.startTime;
    const healthStatus = {
      status: 'healthy',
      uptime: Math.floor(uptime / 1000),
      activeConnections: stats.activeConnections,
      totalConnections: stats.totalConnections,
      messagesSent: stats.messagesSent,
      messagesReceived: stats.messagesReceived,
      channels: Object.fromEntries(
        Array.from(channels.entries()).map(([channel, clientSet]) => [
          channel,
          clientSet.size,
        ])
      ),
      timestamp: new Date().toISOString(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthStatus, null, 2));
    return;
  }

  if (req.url === '/stats') {
    const detailedStats = {
      ...stats,
      uptime: Date.now() - stats.startTime,
      channels: Object.fromEntries(channels.entries()),
      clients: Array.from(clients.entries()).map(([id, client]) => ({
        id,
        portal: client.portal || 'unknown',
        connected: client.ws.readyState === WebSocket.OPEN,
        lastPing: client.lastPing,
        messagesReceived: client.messagesReceived || 0,
        messagesSent: client.messagesSent || 0,
      })),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(detailedStats, null, 2));
    return;
  }

  // Default response
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(
    'FleetFlow WebSocket Notification Server\n\nEndpoints:\n  /health - Health status\n  /stats - Detailed statistics'
  );
});

// Create WebSocket server
const wss = new WebSocket.Server({
  server,
  path: '/notifications',
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      windowBits: 13,
      level: 3,
    },
    threshold: 1024,
    concurrencyLimit: 10,
    serverMaxWindowBits: 13,
    clientMaxWindowBits: 13,
  },
});

console.log('🔗 WebSocket server initialized');

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = uuidv4();
  const clientInfo = {
    id: clientId,
    ws,
    connectedAt: new Date().toISOString(),
    lastPing: new Date().toISOString(),
    portal: null,
    userId: null,
    messagesReceived: 0,
    messagesSent: 0,
  };

  clients.set(clientId, clientInfo);
  stats.totalConnections++;
  stats.activeConnections++;

  console.log(
    `✅ Client connected: ${clientId} (${stats.activeConnections} active)`
  );

  // Send welcome message
  sendToClient(clientId, {
    type: 'system_status',
    timestamp: new Date().toISOString(),
    data: {
      clientId,
      welcome: true,
      serverInfo: {
        version: '1.0.0',
        capabilities: ['notifications', 'real-time-sync', 'channel-routing'],
        activeConnections: stats.activeConnections,
      },
    },
  });

  // Message handler
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(clientId, message);
    } catch (error) {
      console.error(`❌ Invalid message from ${clientId}:`, error);
      sendToClient(clientId, {
        type: 'error',
        timestamp: new Date().toISOString(),
        data: { error: 'Invalid message format' },
      });
    }
  });

  // Ping/Pong handler for connection health
  ws.on('pong', () => {
    if (clients.has(clientId)) {
      clients.get(clientId).lastPing = new Date().toISOString();
    }
  });

  // Connection close handler
  ws.on('close', (code, reason) => {
    console.log(`🔌 Client disconnected: ${clientId} (${code}: ${reason})`);

    // Remove from channels
    for (const [channel, clientSet] of channels.entries()) {
      if (clientSet.has(clientId)) {
        clientSet.delete(clientId);
        if (clientSet.size === 0) {
          channels.delete(channel);
        }
      }
    }

    // Remove from clients
    clients.delete(clientId);
    stats.activeConnections--;

    // Clean up message queue
    messageQueue.delete(clientId);
  });

  // Error handler
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${clientId}:`, error);
  });
});

// Handle incoming messages
function handleMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  client.messagesReceived++;
  stats.messagesReceived++;

  console.log(`📨 Message from ${clientId}:`, message.type);

  switch (message.type) {
    case 'register':
      handleClientRegistration(clientId, message);
      break;

    case 'broadcast_notification':
      handleNotificationBroadcast(clientId, message);
      break;

    case 'ping':
      sendToClient(clientId, {
        type: 'pong',
        timestamp: new Date().toISOString(),
      });
      break;

    case 'join_channel':
      handleChannelJoin(clientId, message.channel);
      break;

    case 'leave_channel':
      handleChannelLeave(clientId, message.channel);
      break;

    case 'direct_message':
      handleDirectMessage(clientId, message);
      break;

    default:
      console.log(`📋 Unknown message type from ${clientId}:`, message.type);
      sendToClient(clientId, {
        type: 'error',
        timestamp: new Date().toISOString(),
        data: { error: `Unknown message type: ${message.type}` },
      });
  }
}

// Handle client registration
function handleClientRegistration(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  // Update client info
  client.portal = message.portal || 'unknown';
  client.userId = message.userId || null;
  client.service = message.service || 'unknown';

  console.log(
    `📝 Client ${clientId} registered: ${client.service} (${client.portal} portal)`
  );

  // Add to portal channel
  const channelName = `portal:${client.portal}`;
  if (!channels.has(channelName)) {
    channels.set(channelName, new Set());
  }
  channels.get(channelName).add(clientId);

  // Send registration confirmation
  sendToClient(clientId, {
    type: 'registration_confirmed',
    timestamp: new Date().toISOString(),
    data: {
      clientId,
      portal: client.portal,
      channel: channelName,
      activeConnections: stats.activeConnections,
    },
  });
}

// Handle notification broadcast
function handleNotificationBroadcast(clientId, message) {
  if (!message.notification) {
    console.warn(`⚠️ Broadcast from ${clientId} missing notification data`);
    return;
  }

  const notification = message.notification;
  console.log(
    `📢 Broadcasting notification: ${notification.title} to ${notification.targetPortals?.join(', ') || 'all portals'}`
  );

  // Determine target clients
  const targetClients = new Set();

  if (notification.targetPortals && notification.targetPortals.length > 0) {
    // Target specific portals
    notification.targetPortals.forEach((portal) => {
      const channelName = `portal:${portal}`;
      const portalClients = channels.get(channelName);
      if (portalClients) {
        portalClients.forEach((clientId) => targetClients.add(clientId));
      }
    });
  } else {
    // Broadcast to all clients
    clients.forEach((client, id) => targetClients.add(id));
  }

  // Remove sender from targets (don't echo back)
  targetClients.delete(clientId);

  // Send to target clients
  const broadcastMessage = {
    type: 'notification',
    notification,
    timestamp: new Date().toISOString(),
    from: clientId,
  };

  let sentCount = 0;
  targetClients.forEach((targetClientId) => {
    if (sendToClient(targetClientId, broadcastMessage)) {
      sentCount++;
    }
  });

  console.log(
    `📤 Notification sent to ${sentCount}/${targetClients.size} clients`
  );

  // Send broadcast confirmation to sender
  sendToClient(clientId, {
    type: 'broadcast_confirmed',
    timestamp: new Date().toISOString(),
    data: {
      notificationId: notification.id,
      recipientCount: sentCount,
      targetPortals: notification.targetPortals || ['all'],
    },
  });
}

// Handle channel join
function handleChannelJoin(clientId, channelName) {
  if (!channelName) return;

  if (!channels.has(channelName)) {
    channels.set(channelName, new Set());
  }

  channels.get(channelName).add(clientId);
  console.log(`📺 Client ${clientId} joined channel: ${channelName}`);

  sendToClient(clientId, {
    type: 'channel_joined',
    timestamp: new Date().toISOString(),
    data: { channel: channelName },
  });
}

// Handle channel leave
function handleChannelLeave(clientId, channelName) {
  if (!channelName || !channels.has(channelName)) return;

  channels.get(channelName).delete(clientId);

  // Clean up empty channels
  if (channels.get(channelName).size === 0) {
    channels.delete(channelName);
  }

  console.log(`📺 Client ${clientId} left channel: ${channelName}`);

  sendToClient(clientId, {
    type: 'channel_left',
    timestamp: new Date().toISOString(),
    data: { channel: channelName },
  });
}

// Handle direct messages between clients
function handleDirectMessage(clientId, message) {
  const { targetClientId, data } = message;

  if (!targetClientId || !clients.has(targetClientId)) {
    sendToClient(clientId, {
      type: 'error',
      timestamp: new Date().toISOString(),
      data: { error: 'Target client not found or offline' },
    });
    return;
  }

  const directMessage = {
    type: 'direct_message',
    from: clientId,
    timestamp: new Date().toISOString(),
    data,
  };

  if (sendToClient(targetClientId, directMessage)) {
    sendToClient(clientId, {
      type: 'message_delivered',
      timestamp: new Date().toISOString(),
      data: { targetClientId },
    });
  }
}

// Send message to specific client
function sendToClient(clientId, message) {
  const client = clients.get(clientId);
  if (!client || client.ws.readyState !== WebSocket.OPEN) {
    // Queue message for later delivery
    if (!messageQueue.has(clientId)) {
      messageQueue.set(clientId, []);
    }
    messageQueue.get(clientId).push(message);
    return false;
  }

  try {
    client.ws.send(JSON.stringify(message));
    client.messagesSent++;
    stats.messagesSent++;
    return true;
  } catch (error) {
    console.error(`❌ Failed to send message to ${clientId}:`, error);
    return false;
  }
}

// Broadcast to all clients in a channel
function broadcastToChannel(channelName, message, excludeClientId = null) {
  const channelClients = channels.get(channelName);
  if (!channelClients) return 0;

  let sentCount = 0;
  channelClients.forEach((clientId) => {
    if (clientId !== excludeClientId) {
      if (sendToClient(clientId, message)) {
        sentCount++;
      }
    }
  });

  return sentCount;
}

// Health check ping to all clients
function performHealthCheck() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  clients.forEach((client, clientId) => {
    // Remove stale clients
    if (new Date(client.lastPing) < fiveMinutesAgo) {
      console.log(`🧹 Removing stale client: ${clientId}`);
      client.ws.terminate();
      clients.delete(clientId);
      stats.activeConnections--;
      return;
    }

    // Ping active clients
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.ping();
    }
  });

  console.log(`💓 Health check completed: ${clients.size} active connections`);
}

// Cleanup and shutdown handler
function gracefulShutdown() {
  console.log('🛑 Shutting down WebSocket server...');

  // Close all client connections
  clients.forEach((client, clientId) => {
    client.ws.close(1001, 'Server shutdown');
  });

  // Close server
  wss.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
}

// Set up periodic health checks
setInterval(performHealthCheck, 2 * 60 * 1000); // Every 2 minutes

// Set up graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
server.listen(PORT, () => {
  console.log(
    `🚀 FleetFlow WebSocket Notification Server running on port ${PORT}`
  );
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Statistics: http://localhost:${PORT}/stats`);
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}/notifications`);
  console.log('');
  console.log('✅ Server ready for connections!');
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`🚫 Port ${PORT} is already in use`);
    console.error(
      '💡 Try using a different port: node websocket-server.js --port=3002'
    );
  }
  process.exit(1);
});

// Export for programmatic usage
module.exports = { server, wss, clients, channels, stats };
