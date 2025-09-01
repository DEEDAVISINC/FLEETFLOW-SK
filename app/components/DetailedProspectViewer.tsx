'use client';

interface DetailedProspectViewerProps {
  viewType: string;
  onClose: () => void;
}

export default function DetailedProspectViewer({
  viewType,
  onClose,
}: DetailedProspectViewerProps) {
  const getViewContent = () => {
    switch (viewType) {
      case 'platinum':
        return (
          <div>
            <h1>Detailed Prospect Viewer - Platinum</h1>
          </div>
        );
      case 'gold':
        return (
          <div>
            <h1>Detailed Prospect Viewer - Gold</h1>
          </div>
        );
      case 'silver':
        return (
          <div>
            <h1>Detailed Prospect Viewer - Silver</h1>
          </div>
        );
      case 'bronze':
        return (
          <div>
            <h1>Detailed Prospect Viewer - Bronze</h1>
          </div>
        );
      default:
        return (
          <div>
            <h1>Detailed Prospect Viewer - Default</h1>
          </div>
        );
    }
  };

  return (
    <div>
      <h1>Detailed Prospect Viewer</h1>
      {getViewContent()}
    </div>
  );
}
