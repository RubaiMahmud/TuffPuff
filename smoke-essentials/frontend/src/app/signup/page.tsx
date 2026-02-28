'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Phone, User, Loader2, CheckSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import GeometricBackground from '@/components/GeometricBackground';
import TuffPuffLogo from '@/components/TuffPuffLogo';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ageVerified: z.literal(true, { message: 'You must be 18+ to use this service' }),
  termsAccepted: z.literal(true, { message: 'You must accept the Terms & Conditions' }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);
    try {
      await signup(data);
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else {
        setError(err.response?.data?.error || err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <GeometricBackground />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-lime-500/10 via-black to-black pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-500/20 rounded-full blur-[50px] pointer-events-none"></div>
          <Link href="/" className="inline-flex items-center gap-2 relative z-10">
            <TuffPuffLogo size={40} className="text-lime-400" />
            <span className="text-xl font-bold text-white tracking-wide">TuffPuff</span>
          </Link>
        </div>

        <div className="glass-card bg-zinc-950/80 border-zinc-800 shadow-[0_0_40px_rgba(163,230,53,0.05)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-400 text-sm mb-6">Join us and start ordering in minutes</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" placeholder="John Doe" {...register('name')} className="input-field pl-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="email" placeholder="you@example.com" {...register('email')} className="input-field pl-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="tel" placeholder="+1234567890" {...register('phone')} className="input-field pl-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" {...register('password')} className="input-field pl-10 pr-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" {...register('ageVerified')} className="mt-1 accent-lime-500 bg-black border-zinc-800" />
                <span className="text-sm text-zinc-400 font-medium">I confirm that I am <strong className="text-lime-400">18 years or older</strong></span>
              </label>
              {errors.ageVerified && <p className="text-red-500 text-xs">{errors.ageVerified.message}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" {...register('termsAccepted')} className="mt-1 accent-lime-500 bg-black border-zinc-800" />
                <span className="text-sm text-zinc-400 font-medium">I accept the <span className="text-lime-400 hover:underline hover:text-lime-300">Terms & Conditions</span> and <span className="text-lime-400 hover:underline hover:text-lime-300">Privacy Policy</span></span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-lime-400 hover:text-lime-300 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
