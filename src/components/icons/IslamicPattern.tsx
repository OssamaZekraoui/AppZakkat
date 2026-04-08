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
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M50 5C28.5 5 11 22.5 11 44s17.5 39 39 39c8.5 0 16.5-2.7 23-7.4C64 82.3 52.7 88 40 88 18 88 0 70 0 48S18 8 40 8c4 0 7.8.6 11.4 1.6C50.3 7 50 5 50 5z" />
      {/* Star */}
      <circle cx="70" cy="20" r="3" />
    </svg>
  );
}
