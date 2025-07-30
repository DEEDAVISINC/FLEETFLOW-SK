// Instructor management utilities
export interface InstructorInfo {
  id: string;
  name: string;
  title: string;
  credentials: string;
  specializations: string[];
  bio: string;
  assignedModules: string[];
  email: string;
}

// Mock instructor data - In production, this would come from a database
const instructors: InstructorInfo[] = [
  {
    id: 'U005',
    name: 'Dr. Emily Carter',
    title: 'Senior Training Director',
    credentials: 'PhD Transportation Management, DOT Certified',
    specializations: ['dispatch', 'compliance', 'safety'],
    bio: 'Dr. Carter has over 15 years of experience in transportation logistics and fleet management. She specializes in dispatch operations, DOT compliance, and safety protocols.',
    assignedModules: ['dispatch', 'compliance', 'safety'],
    email: 'e.carter@fleetflow.com'
  },
  {
    id: 'U006',
    name: 'James Rodriguez',
    title: 'Technology Training Specialist',
    credentials: 'MS Information Systems, Fleet Technology Certified',
    specializations: ['technology', 'sms-workflow', 'workflow'],
    bio: 'James is a technology expert with deep knowledge of fleet management systems and digital workflow optimization.',
    assignedModules: ['technology', 'sms-workflow', 'workflow'],
    email: 'j.rodriguez@fleetflow.com'
  },
  {
    id: 'U007',
    name: 'Maria Santos',
    title: 'Freight Operations Instructor',
    credentials: 'MBA Logistics, Certified Transportation Broker',
    specializations: ['broker', 'customer'],
    bio: 'Maria brings extensive experience in freight brokerage and customer relations to the training program.',
    assignedModules: ['broker', 'customer'],
    email: 'm.santos@fleetflow.com'
  }
];

export function getInstructorForModule(moduleId: string): InstructorInfo | null {
  return instructors.find(instructor => 
    instructor.assignedModules.includes(moduleId)
  ) || null;
}

export function getAllInstructors(): InstructorInfo[] {
  return instructors;
}

export function getInstructorById(id: string): InstructorInfo | null {
  return instructors.find(instructor => instructor.id === id) || null;
}

// Generate unique certificate ID
export function generateCertificateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random.toUpperCase()}`;
}

// Format certificate serial number
export function formatCertificateSerial(id: string): string {
  return id.replace('CERT-', 'FF-CERT-');
}
