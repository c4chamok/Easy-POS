import useCart from '@/hooks/useCart';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Outlet } from 'react-router';
import { ErrorBoundary } from '../ui/ErrorBoundary';


export function MainLayout() {
  useCart(); // Initialize cart synchronization across tabs

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
