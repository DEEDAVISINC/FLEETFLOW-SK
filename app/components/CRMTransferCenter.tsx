'use client';

import { useEffect, useState } from 'react';
import {
  CentralInteraction,
  TransferRequest,
  UserIdentifier,
  centralCRMService,
} from '../services/CentralCRMService';

interface CRMTransferCenterProps {
  currentUser?: UserIdentifier;
  onTransferComplete?: (transferId: string) => void;
}

export default function CRMTransferCenter({
  currentUser,
  onTransferComplete,
}: CRMTransferCenterProps) {
  const [users, setUsers] = useState<UserIdentifier[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserIdentifier | null>(null);
  const [transferData, setTransferData] = useState({
    contactId: '',
    contactName: '',
    contactCompany: '',
    reason: '',
    notes: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'immediate',
    currentCall: false,
    loadId: '',
    specialInstructions: '',
  });
  const [isTransferring, setIsTransferring] = useState(false);
  const [recentInteractions, setRecentInteractions] = useState<
    CentralInteraction[]
  >([]);
  const [showTransferForm, setShowTransferForm] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRecentInteractions();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await centralCRMService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadRecentInteractions = async () => {
    try {
      const interactions = await centralCRMService.getActivityFeed();
      setRecentInteractions(interactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load interactions:', error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedUser || !currentUser) return;

    setIsTransferring(true);
    try {
      const transferRequest: TransferRequest = {
        fromUser: currentUser,
        toUser: selectedUser,
        contactId: transferData.contactId || 'CONTACT_TEMP',
        contactName: transferData.contactName,
        contactCompany: transferData.contactCompany,
        reason: transferData.reason,
        notes: transferData.notes,
        urgency: transferData.urgency,
        context: {
          currentCall: transferData.currentCall,
          loadDetails: transferData.loadId
            ? {
                loadId: transferData.loadId,
                status: 'pending_dispatch',
              }
            : undefined,
          specialInstructions: transferData.specialInstructions,
        },
      };

      const result = await centralCRMService.initiateTransfer(transferRequest);

      if (result.success) {
        // Reset form
        setTransferData({
          contactId: '',
          contactName: '',
          contactCompany: '',
          reason: '',
          notes: '',
          urgency: 'normal',
          currentCall: false,
          loadId: '',
          specialInstructions: '',
        });
        setSelectedUser(null);
        setShowTransferForm(false);

        // Reload interactions
        loadRecentInteractions();

        if (onTransferComplete) {
          onTransferComplete(result.transferId);
        }

        alert(
          `✅ Transfer successful! ${selectedUser.firstName} has been notified.`
        );
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('❌ Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'DC':
        return '#3b82f6'; // Blue - Dispatcher
      case 'BB':
        return '#f97316'; // Orange - Broker
      case 'DM':
        return '#eab308'; // Yellow - Driver
      case 'MGR':
        return '#8b5cf6'; // Purple - Manager
      case 'CS':
        return '#22c55e'; // Green - Customer Service
      case 'SALES':
        return '#ef4444'; // Red - Sales
      default:
        return '#6b7280';
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return '📞';
      case 'email':
        return '📧';
      case 'sms':
        return '💬';
      case 'transfer':
        return '🔄';
      case 'note':
        return '📝';
      case 'task':
        return '✅';
      case 'meeting':
        return '🤝';
      default:
        return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  return (
    <div>
      <h1>CRM Transfer Center</h1>
    </div>
  );
}
