'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapPickerInner = dynamic(
  () => import('./MapPickerInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-800">
        <Loader2 className="text-lime-400 animate-spin" size={28} />
      </div>
    )
  }
);

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultCenter?: { lat: number; lng: number };
}

export default function MapPicker(props: MapPickerProps) {
  return <MapPickerInner {...props} />;
}
