'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AgeVerificationModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    if (!verified) {
      setShow(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border-2 border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.1)] rounded-3xl max-w-md w-full p-8 md:p-10 text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-400 to-green-500"></div>

        <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-lime-400/30">
          <AlertTriangle className="text-lime-400" size={36} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Age Verification</h2>
        <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed mb-8">
          This website sells tobacco products and other age-restricted items. You must be <strong className="text-lime-400 font-bold bg-lime-500/10 px-2 py-0.5 rounded ml-1 border border-lime-400/20">18 years or older</strong> to enter and use this website.
        </p>

        <div className="bg-zinc-900 border border-red-900/50 rounded-xl p-4 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <p className="text-red-400 font-bold text-xs leading-relaxed uppercase tracking-widest pl-2">
            ⚠️ WARNING: Smoking is injurious to health. Tobacco products contain nicotine, which is a highly addictive substance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-black text-lg rounded-xl hover:from-lime-300 hover:to-lime-400 hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all border border-lime-400/50"
          >
            I am 18 or older
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 px-6 py-4 bg-zinc-900 text-zinc-400 font-bold text-lg rounded-xl hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
          >
            I am under 18
          </button>
        </div>

        <p className="text-zinc-600 font-medium text-xs mt-6 px-4">
          By clicking &ldquo;I am 18 or older&rdquo;, you legally confirm you meet the age requirement.
        </p>
      </div>
    </div>
  );
}
