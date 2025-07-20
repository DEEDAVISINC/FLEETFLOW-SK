'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserIdentificationService, { UserIdentificationData, UserIdentifiers } from '../services/UserIdentificationService'
import { getAllAvailablePermissions, hasGranularPermission, UserWithGranularPermissions, PermissionOption, getUserPagePermissions } from '../config/granularAccess'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Broker Agent' | 'Viewer'
  department: string
  hiredDate: string
  phoneNumber: string
  location: string
  brokerInitials: string
  status: 'Active' | 'Inactive' | 'Pending'
  userIdentifiers: UserIdentifiers
  createdDate: string
  lastLogin: string
  permissions: string[]
  accessConditions: {
    officeAccess: boolean
    systemAccess: boolean
    documentsAccess: boolean
    financialAccess: boolean
    adminAccess: boolean
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  notes: string
}

interface NewUserFormData {
  firstName: string
  lastName: string
  email: string
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Broker Agent' | 'Viewer' | ''
  department: string
  hiredDate: string
  phoneNumber: string
  location: string
  brokerInitials: string
  status: 'Active' | 'Inactive' | 'Pending'
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  notes: string
}

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeView, setActiveView] = useState('rolodex')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Driver',
    department: 'DM',
    hiredDate: '',
    location: '',
    phoneNumber: '',
    status: 'Pending' as 'Active' | 'Inactive' | 'Pending',
    brokerInitials: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    notes: ''
  })

  // Navigation-style permission system state variables
  const [expandedPermissionCategory, setExpandedPermissionCategory] = useState<string>('')
  const [expandedSubCategory, setExpandedSubCategory] = useState<string>('')
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({})

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(12)

  // Comprehensive Permission Management State
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Dashboard']))
  const [permissionFilter, setPermissionFilter] = useState<string>('all')
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState<PermissionOption[]>([])

  // Load all available permissions
  useEffect(() => {
    setAvailablePermissions(getAllAvailablePermissions())
  }, [])

  // Permission Management Functions
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const selectAllInCategory = (category: string) => {
    const categoryPermissions = availablePermissions
      .filter(p => p.category === category)
      .map(p => p.id)
    
    setSelectedPermissions(prev => Array.from(new Set([...prev, ...categoryPermissions])))
  }

  const deselectAllInCategory = (category: string) => {
    const categoryPermissions = availablePermissions
      .filter(p => p.category === category)
      .map(p => p.id)
    
    setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)))
  }

  const applyRoleTemplate = (role: string) => {
    // Apply predefined permission sets based on role
    let templatePermissions: string[] = []
    
    switch(role) {
      case 'Admin':
        templatePermissions = availablePermissions.map(p => p.id)
        break
      case 'Manager':
        templatePermissions = availablePermissions.filter(p => 
          !p.id.includes('delete') && !p.id.includes('system_config')
        ).map(p => p.id)
        break
      case 'Dispatcher':
        templatePermissions = availablePermissions.filter(p => 
          p.category === 'Dispatch Central' || p.category === 'Fleet Management' || p.category === 'Routes' 
        ).map(p => p.id)
        break
      case 'Broker':
        templatePermissions = availablePermissions.filter(p => 
          p.category === 'Broker Box' || p.category === 'FreightFlow RFx' || p.category === 'Freight Quoting' || p.category === 'Shipper Portfolio'
        ).map(p => p.id)
        break
    }
    
    setSelectedPermissions(templatePermissions)
  }

  // Filter permissions based on search and category
  const filteredPermissions = availablePermissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(permissionSearchTerm.toLowerCase())
    const matchesFilter = permissionFilter === 'all' || permission.category === permissionFilter
    return matchesSearch && matchesFilter
  })

  // Group permissions by category
  const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, PermissionOption[]>)

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(availablePermissions.map(p => p.category)))

  // Generate mock users for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Frank',
        lastName: 'Miller',
        email: 'frank.miller@company.com',
        role: 'Admin',
        department: 'Management',
        hiredDate: '2023-01-05',
        phoneNumber: '555-0101',
        location: 'Atlanta, GA',
        brokerInitials: 'FM',
        status: 'Active',
        userIdentifiers: {
          userId: 'FM-MGR-2023005',
          brokerInitials: 'FM',
          departmentCode: 'MGR',
          hireDateCode: '2023005',
          departmentColor: 'purple',
          systemId: 'SYS-FM-MGR-2023005',
          employeeCode: 'EMP-FM-001',
          accessCode: 'ACC-FM-001',
          securityLevel: 5,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-FM-001',
            emailPrefix: 'frank.miller',
            phoneExtension: '1001',
            parkingSpot: 'MGR-001',
            officeLocation: 'MGR-1',
            reportingCode: 'RPT-MGR-FM'
          }
        },
        createdDate: '2023-01-05',
        lastLogin: '2024-12-19 09:30',
        permissions: ['all'],
        accessConditions: {
          officeAccess: true,
          systemAccess: true,
          documentsAccess: true,
          financialAccess: true,
          adminAccess: true
        },
        emergencyContact: {
          name: 'Sarah Miller',
          phone: '555-0102',
          relationship: 'Spouse'
        },
        notes: 'Senior administrator with full system access. Primary contact for IT escalations.'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Dispatcher',
        department: 'Dispatcher',
        hiredDate: '2024-01-14',
        phoneNumber: '555-0103',
        location: 'Miami, FL',
        brokerInitials: 'SJ',
        status: 'Active',
        userIdentifiers: {
          userId: 'SJ-DC-2024014',
          brokerInitials: 'SJ',
          departmentCode: 'DC',
          hireDateCode: '2024014',
          departmentColor: 'blue',
          systemId: 'SYS-SJ-DC-2024014',
          employeeCode: 'EMP-SJ-002',
          accessCode: 'ACC-SJ-002',
          securityLevel: 3,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-SJ-002',
            emailPrefix: 'sarah.johnson',
            phoneExtension: '1002',
            parkingSpot: 'DC-002',
            officeLocation: 'DC-1',
            reportingCode: 'RPT-DC-SJ'
          }
        },
        createdDate: '2024-01-14',
        lastLogin: '2024-12-19 11:45',
        permissions: ['dispatch', 'tracking', 'communications'],
        accessConditions: {
          officeAccess: true,
          systemAccess: true,
          documentsAccess: true,
          financialAccess: false,
          adminAccess: false
        },
        emergencyContact: {
          name: 'Mike Johnson',
          phone: '555-0104',
          relationship: 'Husband'
        },
        notes: 'Experienced dispatcher specializing in Southeast region routes. Available for overtime.'
      },
      {
        id: '3',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        role: 'Driver',
        department: 'Driver',
        hiredDate: '2024-01-31',
        phoneNumber: '555-0105',
        location: 'Dallas, TX',
        brokerInitials: 'JS',
        status: 'Active',
        userIdentifiers: {
          userId: 'JS-DM-2024031',
          brokerInitials: 'JS',
          departmentCode: 'DM',
          hireDateCode: '2024031',
          departmentColor: 'yellow',
          systemId: 'SYS-JS-DM-2024031',
          employeeCode: 'EMP-JS-003',
          accessCode: 'ACC-JS-003',
          securityLevel: 2,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-JS-003',
            emailPrefix: 'john.smith',
            phoneExtension: '1003',
            parkingSpot: 'DM-003',
            officeLocation: 'DM-1',
            reportingCode: 'RPT-DM-JS'
          }
        },
        createdDate: '2024-01-31',
        lastLogin: '2024-12-19 08:15',
        permissions: ['driver_portal', 'load_updates', 'document_upload'],
        accessConditions: {
          officeAccess: true,
          systemAccess: true,
          documentsAccess: true,
          financialAccess: false,
          adminAccess: false
        },
        emergencyContact: {
          name: 'Mary Smith',
          phone: '555-0106',
          relationship: 'Wife'
        },
        notes: 'CDL Class A driver with hazmat endorsement. Prefers long-haul routes.'
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@company.com',
        role: 'Broker Agent',
        department: 'Broker Agent',
        hiredDate: '2024-03-01',
        phoneNumber: '555-0107',
        location: 'Los Angeles, CA',
        brokerInitials: 'ED',
        status: 'Active',
        userIdentifiers: {
          userId: 'ED-BB-2024061',
          brokerInitials: 'ED',
          departmentCode: 'BB',
          hireDateCode: '2024061',
          departmentColor: 'orange',
          systemId: 'SYS-ED-BB-2024061',
          employeeCode: 'EMP-ED-004',
          accessCode: 'ACC-ED-004',
          securityLevel: 3,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-ED-004',
            emailPrefix: 'emily.davis',
            phoneExtension: '1004',
            parkingSpot: 'BB-004',
            officeLocation: 'BB-1',
            reportingCode: 'RPT-BB-ED'
          }
        },
        createdDate: '2024-03-01',
        lastLogin: '2024-12-19 14:30',
        permissions: ['broker_operations', 'customer_management', 'quoting'],
        accessConditions: {
          officeAccess: true,
          systemAccess: true,
          documentsAccess: true,
          financialAccess: true,
          adminAccess: false
        },
        emergencyContact: {
          name: 'Robert Davis',
          phone: '555-0108',
          relationship: 'Father'
        },
        notes: 'Top performing broker agent with expertise in West Coast logistics. Bilingual (English/Spanish).'
      },
      {
        id: '5',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@company.com',
        role: 'Manager',
        department: 'Management',
        hiredDate: '2024-02-15',
        phoneNumber: '555-0109',
        location: 'Chicago, IL',
        brokerInitials: 'MW',
        status: 'Active',
        userIdentifiers: {
          userId: 'MW-MGR-2024046',
          brokerInitials: 'MW',
          departmentCode: 'MGR',
          hireDateCode: '2024046',
          departmentColor: 'purple',
          systemId: 'SYS-MW-MGR-2024046',
          employeeCode: 'EMP-MW-005',
          accessCode: 'ACC-MW-005',
          securityLevel: 4,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-MW-005',
            emailPrefix: 'mike.wilson',
            phoneExtension: '1005',
            parkingSpot: 'MGR-005',
            officeLocation: 'MGR-1',
            reportingCode: 'RPT-MGR-MW'
          }
        },
        createdDate: '2024-02-15',
        lastLogin: '2024-12-19 10:22',
        permissions: ['financial_reports', 'analytics', 'user_management'],
        accessConditions: {
          officeAccess: true,
          systemAccess: true,
          documentsAccess: true,
          financialAccess: true,
          adminAccess: false
        },
        emergencyContact: {
          name: 'Jennifer Wilson',
          phone: '555-0110',
          relationship: 'Wife'
        },
        notes: 'Finance manager with CPA certification. Handles all financial reporting and analysis.'
      },
      {
        id: '6',
        firstName: 'Alex',
        lastName: 'Thompson',
        email: 'alex.thompson@company.com',
        role: 'Dispatcher',
        department: 'Dispatcher',
        hiredDate: '2024-04-10',
        phoneNumber: '555-0111',
        location: 'Phoenix, AZ',
        brokerInitials: 'AT',
        status: 'Pending',
        userIdentifiers: {
          userId: 'AT-DC-2024101',
          brokerInitials: 'AT',
          departmentCode: 'DC',
          hireDateCode: '2024101',
          departmentColor: 'blue',
          systemId: 'SYS-AT-DC-2024101',
          employeeCode: 'EMP-AT-006',
          accessCode: 'ACC-AT-006',
          securityLevel: 3,
          additionalIdentifiers: {
            badgeNumber: 'BADGE-AT-006',
            emailPrefix: 'alex.thompson',
            phoneExtension: '1006',
            parkingSpot: 'DC-006',
            officeLocation: 'DC-1',
            reportingCode: 'RPT-DC-AT'
          }
        },
        createdDate: '2024-04-10',
        lastLogin: 'Never',
        permissions: ['dispatch', 'tracking'],
        accessConditions: {
          officeAccess: true,
          systemAccess: false,
          documentsAccess: false,
          financialAccess: false,
          adminAccess: false
        },
        emergencyContact: {
          name: 'Lisa Thompson',
          phone: '555-0112',
          relationship: 'Sister'
        },
        notes: 'New hire pending system access setup. Completed orientation on 2024-04-15.'
      }
    ]
    setUsers(mockUsers)
  }, [])

  // Generate user identifiers when form data changes
  useEffect(() => {
    if (newUserData.firstName && newUserData.lastName && newUserData.department && newUserData.hiredDate && newUserData.location) {
      const userIdentificationData: UserIdentificationData = {
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        department: newUserData.department,
        role: newUserData.role as any,
        hiredDate: newUserData.hiredDate,
        location: newUserData.location
      }

      const userIdentifiers = UserIdentificationService.generateUserIdentifiers(userIdentificationData)
      
      setNewUserData(prev => ({ 
        ...prev, 
        brokerInitials: userIdentifiers.brokerInitials
      }))
    }
  }, [newUserData.firstName, newUserData.lastName, newUserData.department, newUserData.hiredDate, newUserData.location, newUserData.role])

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userIdentifiers.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.brokerInitials.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  // Get department color based on department code
  const getDepartmentColor = (departmentCode: string) => {
    switch (departmentCode) {
      case 'DC': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: '#93c5fd' } // blue
      case 'BB': return { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316', border: '#fdba74' } // orange
      case 'DM': return { bg: 'rgba(234, 179, 8, 0.2)', text: '#eab308', border: '#fcd34d' } // yellow
      case 'MGR': return { bg: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6', border: '#c4b5fd' } // purple
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' } // gray
    }
  }

  // Get role color (keeping original for role badges)
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }
      case 'Manager': return { bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' }
      case 'Dispatcher': return { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' }
      case 'Driver': return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' }
      case 'Broker Agent': return { bg: '#fed7aa', text: '#ea580c', border: '#fdba74' }
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
    }
  }

  // Handle user creation
  const handleCreateUser = () => {
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email || !newUserData.role) {
      alert('Please fill in all required fields')
      return
    }

    const userIdentificationData: UserIdentificationData = {
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      department: newUserData.department,
      role: newUserData.role as any,
      hiredDate: newUserData.hiredDate,
      location: newUserData.location
    }

    const userIdentifiers = UserIdentificationService.generateUserIdentifiers(userIdentificationData)

    const newUser: User = {
      id: (users.length + 1).toString(),
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      role: newUserData.role as any,
      department: newUserData.department,
      hiredDate: newUserData.hiredDate,
      phoneNumber: newUserData.phoneNumber,
      location: newUserData.location,
      brokerInitials: userIdentifiers.brokerInitials,
      status: newUserData.status,
      userIdentifiers: userIdentifiers,
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      permissions: [],
      accessConditions: {
        officeAccess: false,
        systemAccess: false,
        documentsAccess: false,
        financialAccess: false,
        adminAccess: false
      },
      emergencyContact: {
        name: newUserData.emergencyContactName,
        phone: newUserData.emergencyContactPhone,
        relationship: newUserData.emergencyContactRelationship
      },
      notes: newUserData.notes
    }

    setUsers([...users, newUser])
    setNewUserData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: '',
      hiredDate: '',
      phoneNumber: '',
      location: '',
      brokerInitials: '',
      status: 'Pending',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      notes: ''
    })
    setActiveView('rolodex')
  }

  // Handle user status toggle
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' }
        : user
        ))
  }

  // Book-style navigation functions
  const goToNextUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % filteredUsers.length);
  };

  const goToPrevUser = () => {
    setCurrentUserIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
  };

  const goToUser = (index: number) => {
    setCurrentUserIndex(index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)
      `,
      backgroundSize: '100% 100%, 800px 800px, 600px 600px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Back Button */}
      <div style={{ padding: '16px 24px' }}>
        <Link href="/">
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                Digital Rolodex
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
                margin: '0 0 16px 0'
              }}>
                Scalable user management system with comprehensive employee profiles
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#10b981',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {users.length} Total Users • {filteredUsers.length} Filtered
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#8b5cf6',
                  border: '1px solid #8b5cf6',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Refresh page data"
              >
                🔄 Refresh
              </button>
              <div style={{ height: '20px', width: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
              <button
                onClick={() => setActiveView('rolodex')}
                style={{
                  background: activeView === 'rolodex' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                👥 View Users
              </button>
              <button
                onClick={() => setActiveView('create')}
                style={{
                  background: activeView === 'create' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                ➕ Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Rolodex View */}
        {activeView === 'rolodex' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minHeight: '600px'
          }}>
            {/* Search and Filter Bar */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search users, IDs, or initials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  minWidth: '300px',
                  flex: 1
                }}
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Driver">Driver</option>
                <option value="Broker Agent">Broker Agent</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Departments</option>
                <option value="Management">Management</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Driver">Driver</option>
                <option value="Broker Agent">Broker Agent</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Book-Style Navigation */}
            {filteredUsers.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {/* Navigation Header with Counter */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    📖 User Profile Browser
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      User {currentUserIndex + 1} of {filteredUsers.length}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={goToPrevUser}
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={goToNextUser}
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Individual User Tab Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  flexWrap: 'wrap'
                }}>
                  {filteredUsers.map((user, index) => {
                    const departmentColor = getDepartmentColor(user.userIdentifiers.departmentCode);
                    return (
                      <button
                        key={user.id}
                        onClick={() => goToUser(index)}
                        style={{
                          background: index === currentUserIndex ? departmentColor.bg : 'rgba(255, 255, 255, 0.1)',
                          color: index === currentUserIndex ? departmentColor.text : 'rgba(255, 255, 255, 0.7)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          border: index === currentUserIndex ? `2px solid ${departmentColor.bg}` : '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {user.firstName[0]}{user.lastName[0]}-{user.userIdentifiers.departmentCode}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comprehensive Single User Display - ALL Information */}
            {filteredUsers.length > 0 ? (
              (() => {
                const currentUser = filteredUsers[currentUserIndex];
                const roleColor = getRoleColor(currentUser.role);
                const departmentColor = getDepartmentColor(currentUser.userIdentifiers.departmentCode);
                
                return (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${departmentColor.bg}`,
                    borderRadius: '12px',
                    padding: '20px',
                    maxWidth: '850px',
                    margin: '0 auto'
                  }}>
                    {/* User Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div>
                        <h1 style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: 'white',
                          margin: '0 0 8px 0'
                        }}>
                          {currentUser.firstName} {currentUser.lastName}
                        </h1>
                        <div style={{
                          background: departmentColor.bg,
                          color: departmentColor.text,
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          display: 'inline-block',
                          marginBottom: '12px'
                        }}>
                          {currentUser.department} ({currentUser.userIdentifiers.departmentCode})
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.4' }}>
                          <div style={{ marginBottom: '4px' }}>📧 {currentUser.email}</div>
                          <div style={{ marginBottom: '4px' }}>📱 {currentUser.phoneNumber}</div>
                          <div style={{ marginBottom: '4px' }}>📍 {currentUser.location}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px', marginTop: '8px' }}>
                            🆔 <span style={{ fontWeight: '600', color: '#60a5fa' }}>{currentUser.userIdentifiers.userId}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <span style={{
                          background: roleColor.bg,
                          color: roleColor.text,
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {currentUser.role}
                        </span>
                        <span style={{
                          background: currentUser.status === 'Active' ? 'rgba(34, 197, 94, 0.3)' : 
                                     currentUser.status === 'Inactive' ? 'rgba(239, 68, 68, 0.3)' : 
                                     'rgba(251, 191, 36, 0.3)',
                          color: currentUser.status === 'Active' ? '#22c55e' : 
                                 currentUser.status === 'Inactive' ? '#ef4444' : 
                                 '#f59e0b',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          ● {currentUser.status}
                        </span>
                      </div>
                    </div>

                    {/* Comprehensive Information Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      {/* Account Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                          👤 Account Details
                        </h3>
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Hired Date</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{currentUser.hiredDate}</div>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Last Login</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{currentUser.lastLogin}</div>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Broker Initials</div>
                            <div style={{ color: '#a855f7', fontWeight: '700', fontSize: '14px', fontFamily: 'monospace' }}>
                              {currentUser.brokerInitials}
                            </div>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Created</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{currentUser.createdDate}</div>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                          🚨 Emergency Contact
                        </h3>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Name</div>
                          <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{currentUser.emergencyContact.name}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Phone</div>
                          <div style={{ color: '#22c55e', fontWeight: '600', fontSize: '14px' }}>{currentUser.emergencyContact.phone}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Relationship</div>
                          <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{currentUser.emergencyContact.relationship}</div>
                        </div>
                      </div>

                      {/* System Identifiers */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'none'
                      }}>
                        <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                          🔧 System IDs
                        </h3>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>System ID</div>
                          <div style={{ color: '#60a5fa', fontWeight: '600', fontSize: '12px', fontFamily: 'monospace' }}>
                            {currentUser.userIdentifiers.systemId}
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Employee Code</div>
                          <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '12px', fontFamily: 'monospace' }}>
                            {currentUser.userIdentifiers.employeeCode}
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Access Code</div>
                          <div style={{ color: '#f87171', fontWeight: '600', fontSize: '12px', fontFamily: 'monospace' }}>
                            {currentUser.userIdentifiers.accessCode}
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Security Level</div>
                          <div style={{ color: '#a855f7', fontWeight: '700', fontSize: '14px' }}>
                            Level {currentUser.userIdentifiers.securityLevel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional System Information */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      {/* Extended Identifiers */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'none'
                      }}>
                        <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                          📋 Additional Identifiers
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Badge Number</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
                              {currentUser.userIdentifiers.additionalIdentifiers.badgeNumber}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Phone Ext</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
                              {currentUser.userIdentifiers.additionalIdentifiers.phoneExtension}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Parking Spot</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
                              {currentUser.userIdentifiers.additionalIdentifiers.parkingSpot}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Office Location</div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
                              {currentUser.userIdentifiers.additionalIdentifiers.officeLocation}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* COMPACT NAVIGATION-STYLE PERMISSION DROPDOWNS */}
                      <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '10px' }}>
                        {/* 🚛 Operations */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Operations' ? '' : 'Operations')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'Operations' ? '▼' : '▶'} 🚛 Operations
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>3 Sub-categories</span>
                          </div>
                          
                          {expandedPermissionCategory === 'Operations' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* Dispatch Central */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'DispatchCentral' ? '' : 'DispatchCentral')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#3b82f6', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'DispatchCentral' ? '▼' : '▶'} Dispatch Central
                                  </span>
                                </div>
                                {expandedSubCategory === 'DispatchCentral' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View All Loads', 'Create New Load', 'Assign Drivers', 'Edit Load Status',
                                      'View Driver Status', 'Dispatch Loads', 'View Workflow Status', 'Override Workflow',
                                      'AI Route Optimization'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`dispatch_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`dispatch_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Broker Box */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'BrokerBox' ? '' : 'BrokerBox')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'BrokerBox' ? '▼' : '▶'} Broker Box
                                  </span>
                                </div>
                                {expandedSubCategory === 'BrokerBox' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View All Customers', 'Create New Customer', 'Manage Customers', 'Generate Quotes',
                                      'View RFx Responses', 'Process Payments', 'Commission Tracking', 'Market Intelligence'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`broker_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`broker_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Freight Quoting */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'FreightQuoting' ? '' : 'FreightQuoting')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#10b981', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'FreightQuoting' ? '▼' : '▶'} Freight Quoting
                                  </span>
                                </div>
                                {expandedSubCategory === 'FreightQuoting' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Create Quotes', 'Edit Quotes', 'Quote Analytics', 'Pricing Management',
                                      'Customer Quotes', 'Rate Calculation', 'Market Pricing', 'Quote Approval'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`quoting_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`quoting_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 👨‍💼 Driver Management */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'DriverManagement' ? '' : 'DriverManagement')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'DriverManagement' ? '▼' : '▶'} 👨‍💼 Driver Management
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>1 Sub-category</span>
                          </div>
                          
                          {expandedPermissionCategory === 'DriverManagement' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* Driver Portal */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'DriverPortal' ? '' : 'DriverPortal')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(234, 179, 8, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#eab308', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'DriverPortal' ? '▼' : '▶'} Driver Portal
                                  </span>
                                </div>
                                {expandedSubCategory === 'DriverPortal' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View Driver Profiles', 'Add New Driver', 'Edit Driver Info', 'Track Performance',
                                      'Manage Schedules', 'Driver Communication', 'License Tracking', 'Training Records',
                                      'Payroll Integration', 'Safety Compliance'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`driver_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`driver_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 🚛 FleetFlow */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'FleetFlow' ? '' : 'FleetFlow')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'FleetFlow' ? '▼' : '▶'} 🚛 FleetFlow
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>3 Sub-categories</span>
                          </div>
                          
                          {expandedPermissionCategory === 'FleetFlow' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* Fleet Management */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'FleetManagement' ? '' : 'FleetManagement')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'FleetManagement' ? '▼' : '▶'} Fleet Management
                                  </span>
                                </div>
                                {expandedSubCategory === 'FleetManagement' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View Vehicles', 'Add Vehicle', 'Edit Vehicle Info', 'Track Location',
                                      'Fuel Management', 'Insurance Tracking', 'Registration', 'Vehicle Analytics'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`fleet_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`fleet_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Route Optimization */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'RouteOptimization' ? '' : 'RouteOptimization')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'RouteOptimization' ? '▼' : '▶'} Route Optimization
                                  </span>
                                </div>
                                {expandedSubCategory === 'RouteOptimization' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Plan Routes', 'Optimize Routes', 'View Route Analytics', 'Edit Routes',
                                      'Real-time Tracking', 'Fuel Optimization', 'Time Management', 'Traffic Analysis'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`route_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`route_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Maintenance */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'Maintenance' ? '' : 'Maintenance')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'Maintenance' ? '▼' : '▶'} Maintenance
                                  </span>
                                </div>
                                {expandedSubCategory === 'Maintenance' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Schedule Service', 'Track Repairs', 'Vendor Management', 'Cost Tracking',
                                      'Predictive Alerts', 'Inspection Records', 'Parts Inventory', 'Service History'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`maintenance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`maintenance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 📊 Analytics */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Analytics' ? '' : 'Analytics')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'Analytics' ? '▼' : '▶'} 📊 Analytics
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>2 Sub-categories</span>
                          </div>
                          
                          {expandedPermissionCategory === 'Analytics' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* Performance Analytics */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'PerformanceAnalytics' ? '' : 'PerformanceAnalytics')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(6, 182, 212, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#06b6d4', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'PerformanceAnalytics' ? '▼' : '▶'} Performance Analytics
                                  </span>
                                </div>
                                {expandedSubCategory === 'PerformanceAnalytics' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Driver Performance', 'Vehicle Efficiency', 'Route Performance', 'Load Analytics',
                                      'Time Tracking', 'Fuel Analytics', 'Safety Metrics', 'Revenue Analytics'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`performance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`performance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Financial Analytics */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'FinancialAnalytics' ? '' : 'FinancialAnalytics')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(6, 182, 212, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#06b6d4', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'FinancialAnalytics' ? '▼' : '▶'} Financial Analytics
                                  </span>
                                </div>
                                {expandedSubCategory === 'FinancialAnalytics' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Revenue Reports', 'Cost Analysis', 'Profit Margins', 'Budget Tracking',
                                      'Financial Forecasting', 'Invoice Analytics', 'Expense Management', 'ROI Analysis'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`financial_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`financial_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ✅ Compliance */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Compliance' ? '' : 'Compliance')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'Compliance' ? '▼' : '▶'} ✅ Compliance
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>1 Sub-category</span>
                          </div>
                          
                          {expandedPermissionCategory === 'Compliance' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* DOT Compliance */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'DOTCompliance' ? '' : 'DOTCompliance')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#10b981', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'DOTCompliance' ? '▼' : '▶'} DOT Compliance
                                  </span>
                                </div>
                                {expandedSubCategory === 'DOTCompliance' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'Hours of Service', 'Driver Logs', 'Vehicle Inspections', 'Safety Records',
                                      'Drug Testing', 'Medical Certificates', 'License Verification', 'Audit Reports',
                                      'Violation Tracking', 'Compliance Alerts'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`compliance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`compliance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 📚 Resources */}
                        <div style={{ marginBottom: '6px' }}>
                          <div 
                            onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Resources' ? '' : 'Resources')}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '3px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>
                              {expandedPermissionCategory === 'Resources' ? '▼' : '▶'} 📚 Resources
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>2 Sub-categories</span>
                          </div>
                          
                          {expandedPermissionCategory === 'Resources' && (
                            <div style={{ marginLeft: '8px', marginBottom: '4px' }}>
                              {/* FleetFlow University */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'FleetFlowUniversity' ? '' : 'FleetFlowUniversity')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'FleetFlowUniversity' ? '▼' : '▶'} FleetFlow University
                                  </span>
                                </div>
                                {expandedSubCategory === 'FleetFlowUniversity' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View Courses', 'Create Courses', 'Assign Training', 'Track Progress',
                                      'Certifications', 'Training Records', 'Course Materials', 'Assessment Tools'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`university_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`university_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Documentation */}
                              <div style={{ marginBottom: '4px' }}>
                                <div 
                                  onClick={() => setExpandedSubCategory(expandedSubCategory === 'Documentation' ? '' : 'Documentation')}
                                  style={{
                                    padding: '4px 6px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '2px'
                                  }}
                                >
                                  <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '10px' }}>
                                    {expandedSubCategory === 'Documentation' ? '▼' : '▶'} Documentation
                                  </span>
                                </div>
                                {expandedSubCategory === 'Documentation' && (
                                  <div style={{ marginLeft: '6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                    {[
                                      'View Docs', 'Create Docs', 'Edit Docs', 'Document Management',
                                      'Version Control', 'Access Control', 'Search Docs', 'Document Analytics'
                                    ].map(permission => (
                                      <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={userPermissions[`docs_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                          onChange={(e) => setUserPermissions(prev => ({
                                            ...prev,
                                            [`docs_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                          }))}
                                          style={{ marginRight: '3px', transform: 'scale(0.8)' }}
                                        />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>{permission}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COMPACT PERMISSION CONTROLS */}
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>
                          Selected: {Object.values(userPermissions).filter(Boolean).length} permissions
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '9px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            💾 Save Changes
                          </button>
                          <button
                            onClick={() => setUserPermissions({})}
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '9px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Clear All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
                padding: '40px'
              }}>
                No users found matching your search criteria
              </div>
            )}
          </div>
        )}

        {/* Create User View */}
        {activeView === 'create' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minHeight: '600px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: 'white',
              margin: '0 0 24px 0'
            }}>
              Create New User
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px'
            }}>
              {/* Form Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', marginBottom: '16px' }}>Basic Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={newUserData.firstName}
                      onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={newUserData.lastName}
                      onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Role *
                    </label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({...newUserData, role: e.target.value as any})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Dispatcher">Dispatcher</option>
                      <option value="Driver">Driver</option>
                      <option value="Broker Agent">Broker Agent</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Department *
                    </label>
                    <select
                      value={newUserData.department}
                      onChange={(e) => setNewUserData({...newUserData, department: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    >
                      <option value="">Select Department</option>
                      <option value="Management">Management</option>
                      <option value="Dispatcher">Dispatcher</option>
                      <option value="Driver">Driver</option>
                      <option value="Broker Agent">Broker Agent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newUserData.phoneNumber}
                      onChange={(e) => setNewUserData({...newUserData, phoneNumber: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Hired Date *
                    </label>
                    <input
                      type="date"
                      value={newUserData.hiredDate}
                      onChange={(e) => setNewUserData({...newUserData, hiredDate: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newUserData.location}
                    onChange={(e) => setNewUserData({...newUserData, location: e.target.value})}
                    placeholder="e.g., Atlanta, GA"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                </div>

                <h3 style={{ color: 'white', marginBottom: '16px', marginTop: '24px' }}>Emergency Contact</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={newUserData.emergencyContactName}
                      onChange={(e) => setNewUserData({...newUserData, emergencyContactName: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newUserData.emergencyContactPhone}
                      onChange={(e) => setNewUserData({...newUserData, emergencyContactPhone: e.target.value})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '14px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    Relationship
                  </label>
                  <select
                    value={newUserData.emergencyContactRelationship}
                    onChange={(e) => setNewUserData({...newUserData, emergencyContactRelationship: e.target.value})}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    Notes
                  </label>
                  <textarea
                    value={newUserData.notes}
                    onChange={(e) => setNewUserData({...newUserData, notes: e.target.value})}
                    placeholder="Additional notes about the user..."
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '14px',
                      width: '100%',
                      height: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  onClick={handleCreateUser}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create User
                </button>
              </div>

              {/* Preview Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', marginBottom: '16px' }}>Generated Identification Preview</h3>
                
                {newUserData.firstName && newUserData.lastName && newUserData.department && newUserData.hiredDate && newUserData.location && newUserData.role ? (
                  <div>
                    {(() => {
                      const identifiers = UserIdentificationService.generateUserIdentifiers({
                        firstName: newUserData.firstName,
                        lastName: newUserData.lastName,
                        email: newUserData.email,
                        department: newUserData.department,
                        role: newUserData.role as any,
                        hiredDate: newUserData.hiredDate,
                        location: newUserData.location
                      })
                      const departmentColor = getDepartmentColor(identifiers.departmentCode)
                      
                      return (
                        <>
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                              User ID Format: {identifiers.brokerInitials}-{identifiers.departmentCode}-{identifiers.hireDateCode}
                            </div>
                            <div style={{
                              background: departmentColor.bg,
                              color: departmentColor.text,
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '16px',
                              fontFamily: 'monospace',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              {identifiers.userId}
                            </div>
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                              Components Breakdown:
                            </div>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '12px',
                              fontSize: '12px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>User Initials:</span>
                                <span style={{ color: 'white', fontWeight: '600' }}>{identifiers.brokerInitials}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department Code:</span>
                                <span style={{ color: departmentColor.text, fontWeight: '600' }}>{identifiers.departmentCode}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Hire Date Code:</span>
                                <span style={{ color: 'white', fontWeight: '600' }}>{identifiers.hireDateCode}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department Color:</span>
                                <span style={{ color: departmentColor.text, fontWeight: '600', textTransform: 'capitalize' }}>{identifiers.departmentColor}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                              System ID:
                            </div>
                            <div style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              fontWeight: '600'
                            }}>
                              {identifiers.systemId}
                            </div>
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                              Security Level:
                            </div>
                            <div style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              Level {identifiers.securityLevel}
                            </div>
                          </div>

                          <div style={{ marginTop: '24px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                              Additional Identifiers:
                            </div>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '12px',
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                              <div>Badge: {identifiers.additionalIdentifiers.badgeNumber}</div>
                              <div>Email: {identifiers.additionalIdentifiers.emailPrefix}@company.com</div>
                              <div>Extension: {identifiers.additionalIdentifiers.phoneExtension}</div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '24px'
                  }}>
                    Fill in user information to see generated identification numbers
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', margin: 0 }}>
                User Profile
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

            {/* User Header */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                    {selectedUser.email}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      background: getRoleColor(selectedUser.role).bg,
                      color: getRoleColor(selectedUser.role).text,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      background: getDepartmentColor(selectedUser.userIdentifiers.departmentCode).bg,
                      color: getDepartmentColor(selectedUser.userIdentifiers.departmentCode).text,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedUser.department}
                    </span>
                    <span style={{
                      background: selectedUser.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 
                                 selectedUser.status === 'Inactive' ? 'rgba(239, 68, 68, 0.2)' : 
                                 'rgba(251, 191, 36, 0.2)',
                      color: selectedUser.status === 'Active' ? '#4ade80' : 
                             selectedUser.status === 'Inactive' ? '#f87171' : 
                             '#fbbf24',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Department</div>
                  <div style={{ color: 'white', fontWeight: '500' }}>{selectedUser.department}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Location</div>
                  <div style={{ color: 'white', fontWeight: '500' }}>{selectedUser.location}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Phone</div>
                  <div style={{ color: 'white', fontWeight: '500' }}>{selectedUser.phoneNumber}</div>
                </div>
              </div>
            </div>

            {/* Three Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              {/* Identification Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}>Identification</h4>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>User ID</div>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: '600'
                  }}>
                    {selectedUser.userIdentifiers.userId}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>System ID</div>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: '600'
                  }}>
                    {selectedUser.userIdentifiers.systemId}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Initials</div>
                  <div style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#a855f7',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: '600'
                  }}>
                    {selectedUser.brokerInitials}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Badge</div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}>
                    {selectedUser.userIdentifiers.additionalIdentifiers.badgeNumber}
                  </div>
                </div>
              </div>

              {/* Access Conditions Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}>Access Conditions</h4>
                {Object.entries(selectedUser.accessConditions).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div style={{
                      background: value ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: value ? '#4ade80' : '#f87171',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {value ? 'Granted' : 'Denied'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Contact Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}>Emergency Contact</h4>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Name</div>
                  <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                    {selectedUser.emergencyContact.name}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Phone</div>
                  <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                    {selectedUser.emergencyContact.phone}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Relationship</div>
                  <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                    {selectedUser.emergencyContact.relationship}
                  </div>
                </div>
              </div>

              {/* PERMISSION MANAGEMENT CONTROLS */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 }}>
                    🔐 Permission Management
                  </h3>
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>
                    Bulk Assign
                  </button>
                </div>
                
                {/* Permission Categories */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  {/* Dashboard Permissions */}
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Dashboard</div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} defaultChecked />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>View Dashboard</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Create Loads</span>
                    </label>
                  </div>

                  {/* Dispatch Permissions */}
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Dispatch</div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} defaultChecked />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>View Loads</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Assign Drivers</span>
                    </label>
                  </div>

                  {/* Financial Permissions */}
                  <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Financial</div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>View Invoices</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Process Payments</span>
                    </label>
                  </div>

                  {/* Settings Permissions */}
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ color: '#a855f7', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Settings</div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Create Users</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginRight: '4px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Manage Permissions</span>
                    </label>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid #22c55e',
                    borderRadius: '4px',
                    color: '#22c55e',
                    padding: '2px 6px',
                    fontSize: '9px',
                    cursor: 'pointer'
                  }}>
                    Grant All
                  </button>
                  <button style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    borderRadius: '4px',
                    color: '#ef4444',
                    padding: '2px 6px',
                    fontSize: '9px',
                    cursor: 'pointer'
                  }}>
                    Revoke All
                  </button>
                  <button style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    color: '#3b82f6',
                    padding: '2px 6px',
                    fontSize: '9px',
                    cursor: 'pointer'
                  }}>
                    Apply Template
                  </button>
                </div>
              </div>
            </div>

            {/* Notes and Actions */}
            <div style={{ marginTop: '24px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px'
              }}>
                <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '16px' }}>Notes</h4>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                  {selectedUser.notes || 'No notes available'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => toggleUserStatus(selectedUser.id)}
                  style={{
                    background: selectedUser.status === 'Active' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {selectedUser.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 