import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isDarkMode: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isDarkMode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      
      // Hide offline message after 5 seconds
      setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || !showOfflineMessage) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 rounded-lg shadow-lg border ${
      isDarkMode 
        ? 'bg-red-900 border-red-700 text-red-100' 
        : 'bg-red-100 border-red-300 text-red-800'
    } p-3`}>
      <div className="flex items-center space-x-3">
        <WifiOff className="h-5 w-5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">You're Offline</h4>
          <p className="text-xs opacity-75">
            Some features may not work. Check your internet connection.
          </p>
        </div>
        <button
          onClick={() => setShowOfflineMessage(false)}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            isDarkMode 
              ? 'hover:bg-red-800' 
              : 'hover:bg-red-200'
          }`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;
