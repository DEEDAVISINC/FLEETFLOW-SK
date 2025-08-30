const RecentActivity = () => {
  const activities = [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'alert':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'alert':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className='card'>
      <div className='mb-4 flex items-center justify-between'>
        <h3
          style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}
        >
          Recent Activity
        </h3>
        <button className='btn btn-secondary'>View All</button>
      </div>

      <div className='space-y-4'>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className='flex items-start gap-3 bg-gray-50 p-3'
            style={{ borderRadius: '6px' }}
          >
            <div style={{ fontSize: '1.25rem' }}>
              {getStatusIcon(activity.status)}
            </div>

            <div className='flex-1'>
              <p className='mb-1 text-gray-900' style={{ fontWeight: '500' }}>
                {activity.message}
              </p>
              <div
                className='flex items-center gap-4 text-gray-600'
                style={{ fontSize: '0.875rem' }}
              >
                <span>Vehicle: {activity.vehicle}</span>
                <span>{activity.time}</span>
              </div>
            </div>

            <div
              className='status'
              style={{
                backgroundColor: `${getStatusColor(activity.status)}20`,
                color: getStatusColor(activity.status),
                fontSize: '0.75rem',
              }}
            >
              {activity.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
