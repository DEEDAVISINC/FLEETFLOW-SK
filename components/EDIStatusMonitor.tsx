/**
 * 📡 EDI Status Monitor Component
 * Displays real-time EDI transaction status and trading partner connectivity
 */

import React, { useState, useEffect } from 'react';
import { ediService, EDIMessage, TradingPartner } from '@/lib/ediService';

interface EDIStatusMonitorProps {
  className?: string;
}

export const EDIStatusMonitor: React.FC<EDIStatusMonitorProps> = ({ className }) => {
  const [ediMessages, setEdiMessages] = useState<EDIMessage[]>([]);
  const [tradingPartners, setTradingPartners] = useState<TradingPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEDIData();
    // Refresh every 30 seconds
    const interval = setInterval(loadEDIData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadEDIData = async () => {
    try {
      const partners = ediService.getAllTradingPartners();
      const pending = ediService.getPendingMessages();
      
      setTradingPartners(partners);
      setEdiMessages(pending);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading EDI data:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'acknowledged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
      case 'retry':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTransactionTypeDescription = (type: string) => {
    const types: Record<string, string> = {
      '214': 'Shipment Status',
      '204': 'Load Tender Response',
      '210': 'Invoice',
      '997': 'Functional Acknowledgment',
      '990': 'Response to Load Tender',
      '820': 'Payment/Remittance'
    };
    return types[type] || type;
  };

  const resendMessage = async (messageId: string) => {
    try {
      await ediService.sendEDI(messageId);
      loadEDIData(); // Refresh data
    } catch (error) {
      console.error('Error resending EDI message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            📡 EDI Status Monitor
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            📡 EDI Status Monitor
          </h3>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200">
            {tradingPartners.filter(p => p.isActive).length} Active Partners
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Trading Partners Status */}
        <div>
          <h4 className="font-medium mb-3 text-gray-900">Trading Partners</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tradingPartners.map((partner) => (
              <div 
                key={partner.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <div className="font-medium text-sm text-gray-900">{partner.name}</div>
                  <div className="text-xs text-gray-500">
                    {partner.ediId} • {partner.communicationMethod}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {partner.testMode && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                      TEST
                    </span>
                  )}
                  <div className={`w-3 h-3 rounded-full ${
                    partner.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent EDI Messages */}
        <div>
          <h4 className="font-medium mb-3 text-gray-900">Recent EDI Messages</h4>
          {ediMessages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">No pending EDI messages</div>
              <div className="text-sm">Messages will appear here when generated</div>
            </div>
          ) : (
            <div className="space-y-3">
              {ediMessages.slice(0, 5).map((message) => (
                <div 
                  key={message.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded border border-blue-200">
                        EDI {message.transactionSet}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {getTransactionTypeDescription(message.transactionSet)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      To: {message.receiverId} • {new Date(message.timestamp).toLocaleString()}
                    </div>
                    {message.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">
                        {message.errorMessage}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    {message.status === 'error' && (
                      <button
                        onClick={() => resendMessage(message.id)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDI Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {ediMessages.filter(m => m.status === 'sent').length}
            </div>
            <div className="text-xs text-gray-500">Sent Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {ediMessages.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {ediMessages.filter(m => m.status === 'error').length}
            </div>
            <div className="text-xs text-gray-500">Failed</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={loadEDIData}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔄 Refresh EDI Status
          </button>
        </div>
      </div>
    </div>
  );
};
