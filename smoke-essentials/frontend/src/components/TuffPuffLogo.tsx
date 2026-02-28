interface TuffPuffLogoProps {
  size?: number;
  className?: string;
}

export default function TuffPuffLogo({ size = 32, className = '' }: TuffPuffLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 120 370 220"
      width={size}
      height={size}
      className={className}
    >
      {/* Smoke lines */}
      <path
        d="M 80 200 L 140 200 M 60 250 L 160 250 M 100 300 L 130 300"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
        opacity="0.6"
      />
      {/* Flame outline */}
      <path
        d="M 180 320 L 260 320 L 240 260 L 320 250 L 290 190 L 380 180 L 300 130 L 260 170 L 210 150 L 230 220 L 160 240 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinejoin="miter"
      />
      {/* Arrow tips */}
      <polygon points="340,180 420,180 380,140" fill="currentColor" />
      <polygon points="280,250 360,250 320,210" fill="currentColor" />
    </svg>
  );
}
