
import Loading from '@/pages/Loading';
import { useAppSelector } from '@/store';
import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { toast } from 'sonner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);
  console.log(isAuthenticated);

  if (isLoading) {
    return (
      // <div className="min-h-screen flex items-center justify-center bg-gray-900">
      //   <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      // </div>
      <Loading />
    )
  }

  if (error instanceof Error) toast.error(error.message)

  if (isAuthenticated) return <>{children}</>

  return <Navigate to={'/login'} state={{ from: location }}/>
}
