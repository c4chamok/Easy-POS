import { Clock, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <header className="h-14 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{formatDate(currentTime)}</span>
        <span className="text-sm font-medium text-foreground">{formatTime(currentTime)}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              Offline
            </>
          )}
        </Badge>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          Shop Open
        </Badge>
      </div>
    </header>
  );
}
