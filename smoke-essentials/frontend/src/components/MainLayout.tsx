'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgeVerificationModal from '@/components/AgeVerificationModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgeVerificationModal />
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
