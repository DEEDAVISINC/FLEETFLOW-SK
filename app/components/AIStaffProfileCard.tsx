'use client';

import { useState } from 'react';
import { 
  Book, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Star, 
  User 
} from 'lucide-react';
import { DEPOINTEStaffMember } from './DEPOINTEStaffRoster';
import AIStaffLearningMaterials from './AIStaffLearningMaterials';
import AIStaffLearningService from '../services/ai-learning/AIStaffLearningService';

interface AIStaffProfileCardProps {
  staffMember: DEPOINTEStaffMember;
  expanded?: boolean;
}

export default function AIStaffProfileCard({ 
  staffMember,
  expanded = false
}: AIStaffProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [activeTab, setActiveTab] = useState<'profile' | 'learning'>('profile');
  
  // Get learning materials for this staff member
  const learningMaterials = staffMember.learningMaterials || 
    AIStaffLearningService.getLearningMaterialsForStaff(staffMember.id);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
            {staffMember.avatar}
          </div>
          <div>
            <h3 className="font-medium text-slate-800">{staffMember.fullName}</h3>
            <p className="text-sm text-slate-500">
              {staffMember.internalRole} • {staffMember.department}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full p-1 hover:bg-slate-200"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div>
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 border-b-2 py-2 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="mr-1 inline-block h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`flex-1 border-b-2 py-2 text-sm font-medium ${
                activeTab === 'learning'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Book className="mr-1 inline-block h-4 w-4" />
              Learning Materials
              <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                {learningMaterials.length}
              </span>
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'profile' ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">{staffMember.personality}</p>
                
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-700">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {staffMember.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-700">Contact Methods</h4>
                  <div className="flex gap-2">
                    {staffMember.contactMethods.includes('email') && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        <Mail className="h-3 w-3" />
                        Email
                      </span>
                    )}
                    {staffMember.contactMethods.includes('phone') && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        <Phone className="h-3 w-3" />
                        Phone
                      </span>
                    )}
                    {staffMember.contactMethods.includes('chat') && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                        <span className="text-xs">💬</span>
                        Chat
                      </span>
                    )}
                    {staffMember.contactMethods.includes('linkedin') && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        <span className="text-xs">🔗</span>
                        LinkedIn
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <AIStaffLearningMaterials
                staffName={staffMember.fullName}
                materials={learningMaterials}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}


