/**
 * FreeSWITCH Integration Service
 * Open-source telephony platform integration for cost-effective calling
 */

export interface FreeSWITCHConfig {
  host: string;
  port: number;
  password: string;
  username: string;
  domain: string;
  gateway: string;
  codec: 'PCMU' | 'PCMA' | 'G729' | 'G722';
  recordingEnabled: boolean;
  recordingPath: string;
}

export interface FreeSWITCHCall {
  uuid: string;
  sessionId: string;
  callerNumber: string;
  calleeNumber: string;
  status: 'ringing' | 'answered' | 'hangup' | 'busy' | 'failed';
  direction: 'inbound' | 'outbound';
  startTime: string;
  answerTime?: string;
  endTime?: string;
  duration: number;
  billableSeconds: number;
  hangupCause: string;
  recording?: {
    enabled: boolean;
    filePath: string;
    duration: number;
    size: number;
  };
  quality: {
    jitter: number;
    packetLoss: number;
    mos: number; // Mean Opinion Score 1-5
    rtt: number; // Round Trip Time
  };
  cost: {
    setup: number;
    perMinute: number;
    total: number;
    currency: 'USD';
  };
}

export interface FreeSWITCHChannel {
  uuid: string;
  name: string;
  state:
    | 'CS_NEW'
    | 'CS_INIT'
    | 'CS_ROUTING'
    | 'CS_SOFT_EXECUTE'
    | 'CS_EXECUTE'
    | 'CS_EXCHANGE_MEDIA'
    | 'CS_PARK'
    | 'CS_CONSUME_MEDIA'
    | 'CS_HIBERNATE'
    | 'CS_RESET'
    | 'CS_HANGUP'
    | 'CS_REPORTING'
    | 'CS_DESTROY';
  direction: 'inbound' | 'outbound';
  createdTime: string;
  callerIdName: string;
  callerIdNumber: string;
  destinationNumber: string;
  context: string;
  readCodec: string;
  writeCodec: string;
  secure: boolean;
}

export interface FreeSWITCHGateway {
  name: string;
  profile: string;
  scheme: 'sip' | 'iax';
  realm: string;
  username: string;
  password: string;
  proxy: string;
  registrar: string;
  expire: number;
  registerFrequency: number;
  retrySeconds: number;
  callerIdInFrom: boolean;
  status:
    | 'NOREG'
    | 'UNREG'
    | 'UNAUTH'
    | 'REGED'
    | 'FAILED'
    | 'FAIL_WAIT'
    | 'EXPIRED'
    | 'NOREG_WAIT';
  state: 'UP' | 'DOWN';
  ping: number;
  pings: number;
}

export interface FreeSWITCHStats {
  uptime: {
    years: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  version: string;
  sessions: {
    count: number;
    max: number;
    peak: number;
    peakFiveMin: number;
    total: number;
    since_startup: number;
  };
  idleCpu: number;
  sessionsSinceStartup: number;
  sessionsPerSecond: number;
  sessionsPerSecondLast: number;
  sessionsPerSecondMax: number;
  recvdPackets: number;
  sentPackets: number;
}

class FreeSWITCHService {
  private config: FreeSWITCHConfig;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private activeCalls: Map<string, FreeSWITCHCall> = new Map();
  private isConnected: boolean = false;

  constructor(config?: Partial<FreeSWITCHConfig>) {
    this.config = {
      host: config?.host || 'localhost',
      port: config?.port || 8021,
      password: config?.password || 'ClueCon',
      username: config?.username || 'freeswitch',
      domain: config?.domain || 'fleetflow.local',
      gateway: config?.gateway || 'fleetflow_gateway',
      codec: config?.codec || 'PCMU',
      recordingEnabled: config?.recordingEnabled ?? true,
      recordingPath: config?.recordingPath || '/var/recordings/fleetflow',
    };
  }

  // Connect to FreeSWITCH Event Socket Layer (ESL)
  async connect(): Promise<boolean> {
    try {
      // In a real implementation, this would connect to FreeSWITCH ESL
      // For demo purposes, we'll simulate the connection

      console.info(
        `Connecting to FreeSWITCH at ${this.config.host}:${this.config.port}`
      );

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.isConnected = true;
      this.emit('connected', { timestamp: new Date().toISOString() });

      // Start heartbeat
      this.startHeartbeat();

      console.info('FreeSWITCH connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to FreeSWITCH:', error);
      this.isConnected = false;
      this.emit('error', { error: error.message || 'Connection failed' });
      return false;
    }
  }

  // Disconnect from FreeSWITCH
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.isConnected = false;
    this.emit('disconnected', { timestamp: new Date().toISOString() });
  }

  // Make an outbound call
  async makeCall(
    from: string,
    to: string,
    options?: {
      recordCall?: boolean;
      callerIdName?: string;
      timeout?: number;
      variables?: Record<string, string>;
    }
  ): Promise<FreeSWITCHCall> {
    if (!this.isConnected) {
      throw new Error('Not connected to FreeSWITCH');
    }

    const callUuid = this.generateUUID();
    const sessionId = `session-${Date.now()}`;

    const call: FreeSWITCHCall = {
      uuid: callUuid,
      sessionId,
      callerNumber: from,
      calleeNumber: to,
      status: 'ringing',
      direction: 'outbound',
      startTime: new Date().toISOString(),
      duration: 0,
      billableSeconds: 0,
      hangupCause: '',
      quality: {
        jitter: 0,
        packetLoss: 0,
        mos: 4.2,
        rtt: 45,
      },
      cost: {
        setup: 0.01,
        perMinute: 0.02, // Much cheaper than Twilio
        total: 0.01,
        currency: 'USD',
      },
    };

    // Add recording if enabled
    if (options?.recordCall && this.config.recordingEnabled) {
      call.recording = {
        enabled: true,
        filePath: `${this.config.recordingPath}/${callUuid}.wav`,
        duration: 0,
        size: 0,
      };
    }

    this.activeCalls.set(callUuid, call);

    try {
      // Simulate FreeSWITCH originate command
      console.info(`Originating call from ${from} to ${to}`);

      // Simulate call progression
      setTimeout(() => this.simulateCallProgress(callUuid), 2000);

      this.emit('callStarted', call);
      return call;
    } catch (error) {
      console.error('Failed to make call:', error);
      call.status = 'failed';
      call.hangupCause = 'ORIGINATOR_CANCEL';
      throw error;
    }
  }

  // Answer an inbound call
  async answerCall(callUuid: string): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      call.status = 'answered';
      call.answerTime = new Date().toISOString();

      this.emit('callAnswered', call);
      console.info(`Call ${callUuid} answered`);
      return true;
    } catch (error) {
      console.error('Failed to answer call:', error);
      return false;
    }
  }

  // Hangup a call
  async hangupCall(callUuid: string, cause?: string): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(call.startTime);
      const duration = Math.floor(
        (new Date(endTime).getTime() - startTime.getTime()) / 1000
      );

      call.status = 'hangup';
      call.endTime = endTime;
      call.duration = duration;
      call.billableSeconds = call.answerTime ? duration : 0;
      call.hangupCause = cause || 'NORMAL_CLEARING';

      // Calculate final cost
      if (call.billableSeconds > 0) {
        const minutes = Math.ceil(call.billableSeconds / 60);
        call.cost.total = call.cost.setup + minutes * call.cost.perMinute;
      }

      // Update recording info if enabled
      if (call.recording) {
        call.recording.duration = call.billableSeconds;
        call.recording.size = call.billableSeconds * 8000; // Approximate size
      }

      this.activeCalls.delete(callUuid);
      this.emit('callEnded', call);

      console.info(
        `Call ${callUuid} ended - Duration: ${duration}s, Cost: $${call.cost.total.toFixed(4)}`
      );
      return true;
    } catch (error) {
      console.error('Failed to hangup call:', error);
      return false;
    }
  }

  // Transfer a call
  async transferCall(
    callUuid: string,
    destination: string,
    type: 'blind' | 'attended' = 'blind'
  ): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      console.info(
        `Transferring call ${callUuid} to ${destination} (${type} transfer)`
      );

      this.emit('callTransferred', {
        ...call,
        transferDestination: destination,
        transferType: type,
      });

      return true;
    } catch (error) {
      console.error('Failed to transfer call:', error);
      return false;
    }
  }

  // Hold/Unhold a call
  async holdCall(callUuid: string, hold: boolean): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      console.info(`${hold ? 'Holding' : 'Unholding'} call ${callUuid}`);

      this.emit('callHold', {
        ...call,
        onHold: hold,
      });

      return true;
    } catch (error) {
      console.error(`Failed to ${hold ? 'hold' : 'unhold'} call:`, error);
      return false;
    }
  }

  // Get active calls
  getActiveCalls(): FreeSWITCHCall[] {
    return Array.from(this.activeCalls.values());
  }

  // Get call by UUID
  getCall(callUuid: string): FreeSWITCHCall | null {
    return this.activeCalls.get(callUuid) || null;
  }

  // Get system statistics
  async getStats(): Promise<FreeSWITCHStats> {
    // In a real implementation, this would query FreeSWITCH status
    return {
      uptime: {
        years: 0,
        days: 5,
        hours: 14,
        minutes: 32,
        seconds: 18,
        milliseconds: 234,
      },
      version: '1.10.7',
      sessions: {
        count: this.activeCalls.size,
        max: 1000,
        peak: 47,
        peakFiveMin: 23,
        total: 2847,
        since_startup: 2847,
      },
      idleCpu: 87.3,
      sessionsSinceStartup: 2847,
      sessionsPerSecond: 1.2,
      sessionsPerSecondLast: 0.8,
      sessionsPerSecondMax: 15.4,
      recvdPackets: 1847392,
      sentPackets: 1847389,
    };
  }

  // Get gateway status
  async getGatewayStatus(): Promise<FreeSWITCHGateway[]> {
    return [
      {
        name: this.config.gateway,
        profile: 'external',
        scheme: 'sip',
        realm: 'sip.provider.com',
        username: 'fleetflow_user',
        password: '***',
        proxy: 'sip.provider.com:5060',
        registrar: 'sip.provider.com',
        expire: 3600,
        registerFrequency: 3600,
        retrySeconds: 30,
        callerIdInFrom: true,
        status: 'REGED',
        state: 'UP',
        ping: 45,
        pings: 1234,
      },
    ];
  }

  // Get active channels
  async getChannels(): Promise<FreeSWITCHChannel[]> {
    const channels: FreeSWITCHChannel[] = [];

    this.activeCalls.forEach((call) => {
      channels.push({
        uuid: call.uuid,
        name: `sofia/external/${call.calleeNumber}@${this.config.gateway}`,
        state:
          call.status === 'answered'
            ? 'CS_EXCHANGE_MEDIA'
            : call.status === 'ringing'
              ? 'CS_ROUTING'
              : 'CS_HANGUP',
        direction: call.direction,
        createdTime: call.startTime,
        callerIdName: 'FleetFlow',
        callerIdNumber: call.callerNumber,
        destinationNumber: call.calleeNumber,
        context: 'public',
        readCodec: this.config.codec,
        writeCodec: this.config.codec,
        secure: false,
      });
    });

    return channels;
  }

  // Play audio file to call
  async playAudio(callUuid: string, filePath: string): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      console.info(`Playing audio file ${filePath} to call ${callUuid}`);

      this.emit('audioPlaying', {
        callUuid,
        filePath,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      return false;
    }
  }

  // Start call recording
  async startRecording(callUuid: string, filePath?: string): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call) {
      throw new Error('Call not found');
    }

    try {
      const recordingPath =
        filePath || `${this.config.recordingPath}/${callUuid}.wav`;

      if (!call.recording) {
        call.recording = {
          enabled: true,
          filePath: recordingPath,
          duration: 0,
          size: 0,
        };
      }

      console.info(`Started recording call ${callUuid} to ${recordingPath}`);

      this.emit('recordingStarted', {
        callUuid,
        filePath: recordingPath,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  // Stop call recording
  async stopRecording(callUuid: string): Promise<boolean> {
    const call = this.activeCalls.get(callUuid);
    if (!call || !call.recording) {
      throw new Error('Call not found or not recording');
    }

    try {
      const duration = Math.floor(
        (new Date().getTime() - new Date(call.startTime).getTime()) / 1000
      );
      call.recording.duration = duration;
      call.recording.size = duration * 8000; // Approximate

      console.info(`Stopped recording call ${callUuid}`);

      this.emit('recordingStopped', {
        callUuid,
        filePath: call.recording.filePath,
        duration: call.recording.duration,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return false;
    }
  }

  // Event handling
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Simulate call progress for demo
  private simulateCallProgress(callUuid: string): void {
    const call = this.activeCalls.get(callUuid);
    if (!call) return;

    // Simulate ringing -> answered -> hangup
    setTimeout(() => {
      if (call.status === 'ringing') {
        this.answerCall(callUuid);
      }
    }, 3000);

    // Auto-hangup after 30 seconds for demo
    setTimeout(() => {
      if (this.activeCalls.has(callUuid)) {
        this.hangupCall(callUuid, 'NORMAL_CLEARING');
      }
    }, 30000);
  }

  // Start heartbeat to maintain connection
  private startHeartbeat(): void {
    setInterval(() => {
      if (this.isConnected) {
        this.emit('heartbeat', {
          timestamp: new Date().toISOString(),
          activeCalls: this.activeCalls.size,
        });
      }
    }, 30000);
  }

  // Generate UUID for calls
  private generateUUID(): string {
    return (
      'fs-' + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  // Get connection status
  isConnectedToFreeSWITCH(): boolean {
    return this.isConnected;
  }

  // Get configuration
  getConfig(): FreeSWITCHConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<FreeSWITCHConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Cost comparison with Twilio
  getCostComparison(): {
    freeswitch: { setup: number; perMinute: number };
    twilio: { setup: number; perMinute: number };
    savings: { setup: number; perMinute: number; percentage: number };
  } {
    const twilioCost = { setup: 0.005, perMinute: 0.085 }; // Typical Twilio rates
    const freeswitchCost = { setup: 0.01, perMinute: 0.02 }; // Much lower with SIP provider

    return {
      freeswitch: freeswitchCost,
      twilio: twilioCost,
      savings: {
        setup: twilioCost.setup - freeswitchCost.setup,
        perMinute: twilioCost.perMinute - freeswitchCost.perMinute,
        percentage:
          ((twilioCost.perMinute - freeswitchCost.perMinute) /
            twilioCost.perMinute) *
          100,
      },
    };
  }
}

export const freeSWITCHService = new FreeSWITCHService();
