import { cn } from "@/utils/cn";
export default function SpectreMark({
  className,
  showStreaks = true,
  circle = true,
}: {
  className?: string;
  showStreaks?: boolean;
  circle?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 260 260"
      className={cn("block h-full w-full", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SPECTRE.OS mark"
      role="img"
    >
      {showStreaks && (
        <g stroke="currentColor" opacity="0.55" strokeLinecap="butt">
          <line x1="4" y1="80" x2="24" y2="80" strokeWidth="2" />
          <line x1="10" y1="94" x2="30" y2="94" strokeWidth="1.5" opacity="0.7" />
          <line x1="0" y1="108" x2="26" y2="108" strokeWidth="2" />
          <line x1="12" y1="122" x2="30" y2="122" strokeWidth="1.5" opacity="0.7" />
          <line x1="4" y1="136" x2="34" y2="136" strokeWidth="2" />
          <line x1="16" y1="150" x2="28" y2="150" strokeWidth="1.5" opacity="0.6" />
          <line x1="6" y1="164" x2="32" y2="164" strokeWidth="2" opacity="0.7" />
          <line x1="14" y1="178" x2="26" y2="178" strokeWidth="1.5" opacity="0.5" />
        </g>
      )}

      {circle && (
        <g>
          <circle
            cx="132"
            cy="130"
            r="112"
            stroke="currentColor"
            strokeWidth="2.2"
            opacity="0.55"
            strokeDasharray="70 12 26 14 46 12 34 20"
          />
          <circle cx="132" cy="130" r="104" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="132" y1="14" x2="132" y2="26" opacity="0.75" />
            <line x1="132" y1="234" x2="132" y2="246" opacity="0.75" />
            <line x1="18" y1="130" x2="30" y2="130" opacity="0.45" />
            <line x1="234" y1="130" x2="246" y2="130" opacity="0.75" />
          </g>
        </g>
      )}

      <g fill="currentColor">
        <rect x="54" y="60" width="156" height="34" />

        <rect x="54" y="60" width="34" height="80" />

        <rect x="54" y="120" width="156" height="34" />

        <rect x="176" y="140" width="34" height="80" />

        <rect x="54" y="186" width="156" height="34" />

        <polygon points="66,60 78,42 90,60" />
        <polygon points="108,60 120,42 132,60" />
        <polygon points="150,60 162,42 174,60" />

        <polygon points="86,220 98,238 110,220" />
        <polygon points="128,220 140,238 152,220" />
        <polygon points="170,220 182,238 194,220" />
      </g>

      <g fill="currentColor" opacity="0.18">
        <rect x="54" y="60" width="34" height="6" />
        <rect x="54" y="120" width="156" height="4" />
        <rect x="176" y="140" width="34" height="6" />
      </g>
    </svg>
  );
}
