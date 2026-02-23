import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Eye, EyeOff, LogIn, User } from 'lucide-react';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const demoCredentials = [
  { label: 'Admin', email: 'user1@easypos.com', password: '123456', role: 'Admin' },
  { label: 'Cashier', email: 'cashier@posmart.com', password: 'cashier123', role: 'Cashier' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAppSelector(state => state.auth);
  const [credentials, setCredentials] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const { userLogin } = useAuth();

  const handleDemoClick = (cred: typeof demoCredentials[0]) => {
    console.log(cred);
    setCredentials({ password: cred.password, email: cred.email });
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     navigate('/');
  //   }, 800);
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // console.log(location.state?.from ? location.state?.from?.pathname : '/');
    try {

      await userLogin(credentials.email, credentials.password);
      console.log('login success');
      navigate(location.state?.from?.pathname ? location.state?.from?.pathname : '/');
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(e.message);
        return setError(e)
      };
    }
  }


  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, hsl(222 47% 11%), hsl(217 91% 25%))' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12 space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 mb-4">
            <ShoppingBag className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">
            POSmart
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Streamline your sales, manage inventory, and grow your business — all from one powerful dashboard.
          </p>
          <div className="flex items-center gap-6 justify-center text-primary-foreground/50 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Real-time Analytics
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Smart Inventory
            </span>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-2">
              <ShoppingBag className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">POSmart</h1>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Demo credentials */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => handleDemoClick(cred)}
                  className="group relative flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-card-hover hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{cred.label}</p>
                    <p className="text-xs text-muted-foreground">{cred.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;