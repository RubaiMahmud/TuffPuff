'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import TuffPuffLogo from '@/components/TuffPuffLogo';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
    } catch { }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-lime-500/10 via-black to-black"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-500/20 rounded-full blur-[50px] pointer-events-none"></div>
          <Link href="/" className="inline-flex items-center gap-2 relative z-10">
            <TuffPuffLogo size={40} className="text-lime-400" />
            <span className="text-xl font-bold text-white tracking-wide">TuffPuff</span>
          </Link>
        </div>

        <div className="glass-card bg-zinc-950/80 border-zinc-800 shadow-[0_0_40px_rgba(163,230,53,0.05)] backdrop-blur-xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-lime-500/10 border border-lime-400/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(163,230,53,0.1)]">
                <Mail className="text-lime-400" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-zinc-400 text-sm mb-6 font-medium">
                If an account exists with that email, we&apos;ve sent password reset instructions.
              </p>
              <Link href="/login" className="text-lime-400 hover:text-lime-300 text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
              <p className="text-zinc-400 text-sm mb-6 font-medium">Enter your email and we&apos;ll send you reset instructions.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} className="input-field pl-10 bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-lime-400 focus:ring-lime-400/20" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  Send Reset Link
                </button>
              </form>

              <p className="text-center text-zinc-500 text-sm mt-6">
                <Link href="/login" className="text-lime-400 hover:text-lime-300 font-bold flex items-center justify-center gap-1 transition-colors">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
