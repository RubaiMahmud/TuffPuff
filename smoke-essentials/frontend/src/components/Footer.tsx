import Link from 'next/link';
import TuffPuffLogo from '@/components/TuffPuffLogo';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 group">
              <TuffPuffLogo size={36} className="text-lime-400" />
              <span className="text-xl font-black text-gradient">TuffPuff</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm font-medium leading-relaxed">
              Your go-to delivery platform for cigarettes and everyday essentials. Fast delivery, right to your door.
            </p>
            <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm">
              <p className="text-red-500 text-xs font-bold leading-relaxed tracking-wide">
                ⚠️ WARNING: Tobacco products are harmful to health. Must be 18+ to purchase. By using this platform, you confirm you are of legal age.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black mb-5 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/cart', label: 'Cart' },
                { href: '/orders', label: 'My Orders' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-400 hover:text-lime-400 font-medium text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-black mb-5 text-sm uppercase tracking-widest">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-zinc-400 hover:text-lime-400 font-medium text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-lime-400 font-medium text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-lime-400 font-medium text-sm transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 font-medium text-xs">© {new Date().getFullYear()} TuffPuff. All rights reserved.</p>
          <p className="text-zinc-500 font-medium text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]"></span>
            Delivery available 7 days a week
          </p>
        </div>
      </div>
    </footer>
  );
}
