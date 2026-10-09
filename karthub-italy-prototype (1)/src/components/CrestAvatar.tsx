import React from 'react';
import { CrestConfig } from '../types';
import { Shield, Trophy, Flame, Zap, Crown, Swords, Compass, Flag } from 'lucide-react';

interface CrestAvatarProps {
  crest?: CrestConfig;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackName?: string;
}

export const DEFAULT_CREST: CrestConfig = {
  shape: 'classic_shield',
  pattern: 'split_v',
  primaryColor: '#dc2626', // Red
  secondaryColor: '#1e293b', // Dark slate
  symbolCategory: 'karting',
  symbolIcon: 'steering_wheel',
  crestInitials: 'KH'
};

export const CrestAvatar: React.FC<CrestAvatarProps> = ({
  crest = DEFAULT_CREST,
  className = '',
  size = 'md',
  fallbackName = 'Driver'
}) => {
  const sizePixels = {
    xs: 32,
    sm: 44,
    md: 64,
    lg: 80,
    xl: 112
  }[size];

  const {
    shape = 'classic_shield',
    pattern = 'split_v',
    primaryColor = '#dc2626',
    secondaryColor = '#1e293b',
    symbolIcon = 'steering_wheel',
    crestInitials = ''
  } = crest || DEFAULT_CREST;

  // Clip Path ID based on shape
  const clipId = `crest-clip-${shape}-${Math.random().toString(36).substring(2, 7)}`;
  const patternId = `crest-pattern-${Math.random().toString(36).substring(2, 7)}`;

  // SVG Paths for shapes
  const shapePath = {
    classic_shield: 'M 10,8 L 90,8 L 90,55 C 90,82 50,98 50,98 C 50,98 10,82 10,55 Z',
    gothic_shield: 'M 10,22 L 50,8 L 90,22 L 90,62 C 90,84 50,98 50,98 C 50,98 10,84 10,62 Z',
    round_shield: 'M 50,8 A 42,42 0 1,1 49.9,8 Z',
    crown_shield: 'M 10,20 L 30,10 L 50,20 L 70,10 L 90,20 L 90,60 C 90,82 50,98 50,98 C 50,98 10,82 10,60 Z'
  }[shape];

  // Render symbol icon inside shield
  const renderSymbol = () => {
    switch (symbolIcon) {
      case 'steering_wheel':
        return (
          <g transform="translate(32, 32) scale(0.36)" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="50" r="40" strokeWidth="3" />
            <circle cx="50" cy="50" r="10" />
            <line x1="50" y1="10" x2="50" y2="40" />
            <line x1="15" y1="65" x2="42" y2="55" />
            <line x1="85" y1="65" x2="58" y2="55" />
          </g>
        );
      case 'checkered_flag':
        return (
          <g transform="translate(32, 28) scale(0.36)" fill="#ffffff">
            <path d="M20 10 L80 10 L70 50 L10 50 Z" />
            <line x1="10" y1="10" x2="10" y2="90" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          </g>
        );
      case 'helmet':
        return (
          <g transform="translate(30, 28) scale(0.4)" fill="none" stroke="#ffffff" strokeWidth="2.5">
            <path d="M 20,60 C 20,30 40,20 65,20 C 85,20 90,35 90,55 C 90,75 75,80 55,80 L 35,80 C 25,80 20,72 20,60 Z" fill="#ffffff" fillOpacity="0.2" />
            <path d="M 40,40 L 80,40 C 85,40 85,55 75,58 L 40,58 Z" fill="#ffffff" />
          </g>
        );
      case 'piston':
        return (
          <g transform="translate(33, 28) scale(0.35)" fill="#ffffff">
            <rect x="30" y="15" width="40" height="30" rx="3" />
            <rect x="25" y="25" width="50" height="4" />
            <rect x="42" y="45" width="16" height="40" rx="2" />
            <circle cx="50" cy="80" r="8" fill="none" stroke="#ffffff" strokeWidth="4" />
          </g>
        );
      case 'lion':
        return (
          <g transform="translate(30, 26) scale(0.4)" fill="#ffffff">
            <path d="M50 15 C35 15 25 30 25 45 C25 60 35 70 50 85 C65 70 75 60 75 45 C75 30 65 15 50 15 Z M50 30 A 8 8 0 1 1 50 46 A 8 8 0 1 1 50 30 Z" />
          </g>
        );
      case 'eagle':
        return (
          <g transform="translate(30, 26) scale(0.4)" fill="#ffffff">
            <path d="M 10,40 Q 50,10 90,40 Q 70,55 50,45 Q 30,55 10,40 Z M 50,45 L 50,85 L 45,70 L 55,70 Z" />
          </g>
        );
      case 'bull':
        return (
          <g transform="translate(30, 26) scale(0.4)" fill="#ffffff">
            <path d="M 20,20 Q 30,40 50,40 Q 70,40 80,20 Q 70,30 50,50 Q 30,30 20,20 Z M 35,50 L 65,50 L 50,80 Z" />
          </g>
        );
      case 'wolf':
        return (
          <g transform="translate(30, 26) scale(0.4)" fill="#ffffff">
            <path d="M 50,15 L 30,40 L 40,50 L 25,70 L 50,85 L 75,70 L 60,50 L 70,40 Z" />
          </g>
        );
      case 'dragon':
        return (
          <g transform="translate(28, 25) scale(0.44)" fill="#ffffff">
            <path d="M30,20 C40,10 70,10 80,25 C70,35 60,30 50,40 C40,50 60,70 40,85 C30,70 20,40 30,20 Z" />
          </g>
        );
      case 'crown':
        return (
          <g transform="translate(30, 28) scale(0.4)" fill="#ffffff">
            <path d="M 15,30 L 30,65 L 50,25 L 70,65 L 85,30 L 80,80 L 20,80 Z" />
            <circle cx="15" cy="25" r="4" />
            <circle cx="50" cy="18" r="5" />
            <circle cx="85" cy="25" r="4" />
          </g>
        );
      case 'swords':
        return (
          <g transform="translate(28, 26) scale(0.44)" stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
            <line x1="20" y1="20" x2="80" y2="80" />
            <line x1="80" y1="20" x2="20" y2="80" />
            <line x1="25" y1="35" x2="35" y2="25" />
            <line x1="75" y1="35" x2="65" y2="25" />
          </g>
        );
      case 'flame':
      default:
        return (
          <g transform="translate(30, 26) scale(0.4)" fill="#ffffff">
            <path d="M50 15 C50 15 65 35 65 55 C65 72 58 80 50 80 C42 80 35 72 35 55 C35 40 45 30 50 15 Z M50 45 C50 45 57 55 57 65 C57 71 54 74 50 74 C46 74 43 71 43 65 C43 58 48 52 50 45 Z" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
      title={`Stemma Pilota: ${crestInitials || fallbackName}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
      >
        <defs>
          {/* Shield Boundary Clip */}
          <clipPath id={clipId}>
            <path d={shapePath} />
          </clipPath>

          {/* Checkered Pattern */}
          <pattern id={`${patternId}-checkered`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={primaryColor} />
            <rect x="10" width="10" height="10" fill={secondaryColor} />
            <rect y="10" width="10" height="10" fill={secondaryColor} />
            <rect x="10" y="10" width="10" height="10" fill={primaryColor} />
          </pattern>

          {/* Stripes Pattern */}
          <pattern id={`${patternId}-stripes`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="20" fill={primaryColor} />
            <rect x="10" width="10" height="20" fill={secondaryColor} />
          </pattern>
        </defs>

        {/* Shield Outer Gold / Silver Border Frame */}
        <path
          d={shapePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Shield Inner Content with Pattern */}
        <g clipPath={`url(#${clipId})`}>
          {pattern === 'solid' && (
            <rect width="100" height="100" fill={primaryColor} />
          )}

          {pattern === 'split_v' && (
            <>
              <rect x="0" y="0" width="50" height="100" fill={primaryColor} />
              <rect x="50" y="0" width="50" height="100" fill={secondaryColor} />
            </>
          )}

          {pattern === 'split_diag' && (
            <>
              <polygon points="0,0 100,0 0,100" fill={primaryColor} />
              <polygon points="100,0 100,100 0,100" fill={secondaryColor} />
            </>
          )}

          {pattern === 'checkered' && (
            <rect width="100" height="100" fill={`url(#${patternId}-checkered)`} />
          )}

          {pattern === 'stripes' && (
            <rect width="100" height="100" fill={`url(#${patternId}-stripes)`} />
          )}

          {/* Inner Highlight Vignette Gradient */}
          <path
            d={shapePath}
            fill="black"
            fillOpacity="0.12"
          />

          {/* Central Symbol Icon */}
          {renderSymbol()}

          {/* Optional Initials / Text Banner */}
          {crestInitials && (
            <g transform="translate(50, 80)">
              <rect x="-24" y="-8" width="48" height="14" rx="3" fill="#000000" fillOpacity="0.6" stroke="#ffffff" strokeWidth="1" />
              <text
                x="0"
                y="2"
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                {crestInitials.substring(0, 4).toUpperCase()}
              </text>
            </g>
          )}
        </g>

        {/* Inner Gold Bezel Highlight */}
        <path
          d={shapePath}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
