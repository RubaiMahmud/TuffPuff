'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import GeometricBackground from '@/components/GeometricBackground';
import TuffPuffLogo from '@/components/TuffPuffLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive Background */}
      <GeometricBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-500/20 rounded-full blur-[50px] pointer-events-none"></div>
          <Link href="/" className="inline-flex items-center gap-2 relative z-10">
            <TuffPuffLogo size={40} className="text-lime-400" />
            <span className="text-xl font-bold text-white tracking-wide">TuffPuff</span>
          </Link>
        </div>

        <div className="glass-card bg-zinc-950/80 border-zinc-800 shadow-[0_0_40px_rgba(163,230,53,0.05)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-zinc-400 text-sm mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="input-field pl-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="input-field pl-10 pr-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs font-medium text-zinc-400 hover:text-lime-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-lime-400 hover:text-lime-300 font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
