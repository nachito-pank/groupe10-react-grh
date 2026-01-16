interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export default function Logo({ size = 'md', showText = true, variant = 'light' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 20, text: 14 },
    md: { icon: 28, text: 18 },
    lg: { icon: 40, text: 24 },
  };

  const dimensions = sizeMap[size];

  return (
    <div className="flex items-center space-x-2">
      {/* Logo Icon */}
      <div className={`p-2 rounded-lg shadow-lg transition-all ${
        variant === 'light'
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/50'
          : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-400/30'
      }`}>
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* Head */}
          <circle cx="20" cy="10" r="5" fill="currentColor" />

          {/* Body - elevated arms representing unity/collaboration */}
          <path
            d="M 15 16 Q 15 14 20 14 Q 25 14 25 16 L 25 22 Q 25 25 20 25 Q 15 25 15 22 Z"
            fill="currentColor"
          />

          {/* Left arm */}
          <path
            d="M 15 18 L 8 15 Q 7 14.5 6.5 15.5 Q 6 16.5 7 17 L 14 20"
            fill="currentColor"
          />

          {/* Right arm */}
          <path
            d="M 25 18 L 32 15 Q 33 14.5 33.5 15.5 Q 34 16.5 33 17 L 26 20"
            fill="currentColor"
          />

          {/* Legs */}
          <line x1="17" y1="25" x2="16" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="25" x2="24" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Heart accent for HR values */}
          <path
            d="M 20 8 M 22 6.5 Q 23.5 5 25 6.5 Q 26.5 8 25 9.5 L 20 14 L 15 9.5 Q 13.5 8 15 6.5 Q 16.5 5 18 6.5"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold bg-gradient-to-r ${
              variant === 'light'
                ? 'from-cyan-400 to-blue-500'
                : 'from-cyan-300 to-blue-400'
            } bg-clip-text text-transparent`}
            style={{ fontSize: `${dimensions.text}px` }}
          >
            Portail GRH
          </span>
          <span className={`text-xs font-medium ${
            variant === 'light' ? 'text-slate-400' : 'text-slate-300'
          }`}>
            Gestion RH
          </span>
        </div>
      )}
    </div>
  );
}
