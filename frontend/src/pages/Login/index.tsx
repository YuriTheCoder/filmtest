import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Film } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Film className="w-12 h-12 text-accent-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to continue to Cinema App</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-sm text-text-muted">OR</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-bg-secondary rounded-lg border border-white/10">
            <p className="text-sm text-text-secondary mb-2">Demo Admin Account:</p>
            <p className="text-xs text-text-muted">Email: admin@cinema.com</p>
            <p className="text-xs text-text-muted">Password: Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
