export function IslamicPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Hexagonal pattern */}
      <path
        d="M100 10L173.2 52.5V137.5L100 180L26.8 137.5V52.5Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M100 30L155 60V120L100 150L45 120V60Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <path
        d="M100 50L137 68V102L100 120L63 102V68Z"
        stroke="currentColor"
        strokeWidth="0.4"
      />
      {/* Star pattern center */}
      <path
        d="M100 60L110 85H135L115 100L122 125L100 110L78 125L85 100L65 85H90Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <mask id="hilal-cutout">
          <rect width="120" height="120" fill="white" />
          <circle cx="66" cy="54" r="45" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="60" r="45" fill="currentColor" mask="url(#hilal-cutout)" />
      <path
        d="M78 40l4.8 13.2 13.7.4-10.8 8.4 3.9 13.1L78 67.8l-11.6 7.3 3.9-13.1-10.8-8.4 13.7-.4L78 40Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Moon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="60" cy="60" r="38" fill="currentColor" opacity="0.9" />
      <circle cx="46" cy="46" r="7" fill="#1A472A" opacity="0.18" />
      <circle cx="72" cy="42" r="4" fill="#1A472A" opacity="0.14" />
      <circle cx="77" cy="70" r="8" fill="#1A472A" opacity="0.12" />
      <circle cx="52" cy="76" r="5" fill="#1A472A" opacity="0.13" />
      <path
        d="M33 63C38 81 55 92 74 87"
        stroke="#1A472A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.08"
      />
    </svg>
  );
}
