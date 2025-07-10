'use client';

import { useState, useEffect } from 'react';

interface ClearinghouseRecord {
  recordId: string;
  type: 'violation' | 'return_to_duty' | 'follow_up' | 'negative_return';
  substanceType: string;
  testType: string;
  date: string;
  employer: string;
  status: 'pending' | 'resolved' | 'active';
  details: string;
}

interface DriverClearinghouseData {
  driverId: string;
  licenseNumber: string;
  firstName: string;
  lastName: string;
  clearinghouseStatus: 'clear' | 'prohibited' | 'pending_info' | 'not_enrolled';
  enrollmentDate: string | null;
  lastQueryDate: string;
  prohibitionsActive: number;
  violationsResolved: number;
  records: ClearinghouseRecord[];
  consentStatus: 'active' | 'expired' | 'revoked' | 'pending';
  consentExpiryDate: string | null;
}

interface ClearinghouseStatusProps {
  driverId?: string;
  licenseNumber?: string;
  onRefresh?: () => void;
}

export default function ClearinghouseStatus({ 
  driverId, 
  licenseNumber, 
  onRefresh 
}: ClearinghouseStatusProps) {
  const [data, setData] = useState<DriverClearinghouseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockData: DriverClearinghouseData = {
    driverId: driverId || "DRV-001",
    licenseNumber: licenseNumber || "WA123456789",
    firstName: "John",
    lastName: "Driver",
    clearinghouseStatus: "clear",
    enrollmentDate: "2023-01-15",
    lastQueryDate: "2024-07-08",
    prohibitionsActive: 0,
    violationsResolved: 1,
    records: [
      {
        recordId: "CH-2023-001",
        type: "return_to_duty",
        substanceType: "Alcohol",
        testType: "Random",
        date: "2023-06-15",
        employer: "Previous Carrier Inc",
        status: "resolved",
        details: "Successfully completed SAP program and return-to-duty process"
      }
    ],
    consentStatus: "active",
    consentExpiryDate: "2025-01-15"
  };

  const fetchClearinghouseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual DOT Clearinghouse API call
      // const response = await fetch(`/api/compliance/clearinghouse?driverId=${driverId}`);
      // const result = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch Clearinghouse data');
      console.error('Clearinghouse API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverId || licenseNumber) {
      fetchClearinghouseData();
    }
  }, [driverId, licenseNumber]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-100 text-green-800';
      case 'prohibited': return 'bg-red-100 text-red-800';
      case 'pending_info': return 'bg-yellow-100 text-yellow-800';
      case 'not_enrolled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'prohibited': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending_info': return <Calendar className="w-4 h-4 text-yellow-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConsentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'violation': return '⚠️';
      case 'return_to_duty': return '✅';
      case 'follow_up': return '🔄';
      case 'negative_return': return '❌';
      default: return '📋';
    }
  };

  const isConsentExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expDate = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiration <= 30;
  };

  const handleRefresh = () => {
    fetchClearinghouseData();
    onRefresh?.();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            DOT Clearinghouse Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            DOT Clearinghouse Status
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">{error}</div>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            DOT Clearinghouse Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-sm">Select a driver to view Clearinghouse status</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4" />
          DOT Clearinghouse Status
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://clearinghouse.fmcsa.dot.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Portal
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {data.firstName} {data.lastName}
            </span>
            <div className="flex items-center gap-2">
              {getStatusIcon(data.clearinghouseStatus)}
              <Badge className={getStatusColor(data.clearinghouseStatus)}>
                {data.clearinghouseStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            CDL: {data.licenseNumber} | ID: {data.driverId}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{data.prohibitionsActive}</div>
            <div className="text-xs text-gray-600">Active Prohibitions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{data.violationsResolved}</div>
            <div className="text-xs text-gray-600">Resolved Cases</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{data.records.length}</div>
            <div className="text-xs text-gray-600">Total Records</div>
          </div>
        </div>

        {/* Consent Status */}
        <div className="space-y-2">
          <div className="font-medium text-gray-700 text-sm">Consent Status</div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Badge className={getConsentStatusColor(data.consentStatus)}>
                {data.consentStatus.toUpperCase()}
              </Badge>
              {data.consentExpiryDate && (
                <span className={`text-xs ${
                  isConsentExpiringSoon(data.consentExpiryDate) 
                    ? 'text-red-600 font-medium' 
                    : 'text-gray-600'
                }`}>
                  Expires: {new Date(data.consentExpiryDate).toLocaleDateString()}
                  {isConsentExpiringSoon(data.consentExpiryDate) && ' ⚠️'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Enrollment Date</div>
            <div>
              {data.enrollmentDate 
                ? new Date(data.enrollmentDate).toLocaleDateString()
                : 'Not enrolled'
              }
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Last Query</div>
            <div>{new Date(data.lastQueryDate).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Records */}
        {data.records.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-gray-700 text-sm">Recent Records</div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {data.records.map((record) => (
                <div key={record.recordId} className="p-3 border rounded text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getRecordTypeIcon(record.type)}</span>
                      <span className="font-medium capitalize">
                        {record.type.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        record.status === 'resolved' 
                          ? 'border-green-200 text-green-700' 
                          : record.status === 'active'
                          ? 'border-red-200 text-red-700'
                          : 'border-yellow-200 text-yellow-700'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div><strong>Test:</strong> {record.testType} - {record.substanceType}</div>
                    <div><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</div>
                    <div><strong>Employer:</strong> {record.employer}</div>
                    {record.details && (
                      <div><strong>Details:</strong> {record.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Actions */}
        {data.clearinghouseStatus === 'prohibited' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center gap-2 text-red-800 font-medium text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              Action Required
            </div>
            <div className="text-red-700 text-xs">
              Driver is currently prohibited from operating CMVs. Complete SAP program and return-to-duty process required.
            </div>
          </div>
        )}

        {isConsentExpiringSoon(data.consentExpiryDate) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center gap-2 text-yellow-800 font-medium text-sm mb-1">
              <Calendar className="w-4 h-4" />
              Consent Expiring Soon
            </div>
            <div className="text-yellow-700 text-xs">
              Driver consent expires in less than 30 days. Renewal required to continue queries.
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Last queried: {new Date(data.lastQueryDate).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
