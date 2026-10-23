import React from 'react';

export type SupportedPlatformKey =
  | 'amazon'
  | 'flipkart'
  | 'myntra'
  | 'ajio'
  | 'nykaa'
  | 'croma'
  | 'meesho'
  | 'tatacliq'
  | 'generic';

export interface PlatformMeta {
  key: SupportedPlatformKey;
  name: string;
  domain: string;
  brandColor: string;
  theme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

/**
 * Normalizes any URL, platform raw name, or domain into a standard platform key.
 */
export function normalizePlatform(input?: string): SupportedPlatformKey {
  if (!input) return 'generic';
  const s = input.toLowerCase().trim();

  if (s.includes('amazon') || s.includes('media-amazon') || s.includes('amzn')) return 'amazon';
  if (s.includes('flipkart') || s.includes('flixcart')) return 'flipkart';
  if (s.includes('myntra') || s.includes('myntassets')) return 'myntra';
  if (s.includes('ajio')) return 'ajio';
  if (s.includes('nykaa')) return 'nykaa';
  if (s.includes('croma')) return 'croma';
  if (s.includes('meesho')) return 'meesho';
  if (s.includes('tatacliq') || s.includes('tata cliq') || s.includes('cliq')) return 'tatacliq';

  return 'generic';
}

/**
 * Metadata & luxury styling themes for each supported e-commerce platform.
 */
export function getPlatformMeta(input?: string): PlatformMeta {
  const key = normalizePlatform(input);

  switch (key) {
    case 'amazon':
      return {
        key: 'amazon',
        name: 'Amazon',
        domain: 'amazon.in',
        brandColor: '#FF9900',
        theme: {
          bg: '#FFFBF5',
          border: '#FED7AA',
          text: '#C2410C',
          accent: '#FF9900',
        },
      };

    case 'flipkart':
      return {
        key: 'flipkart',
        name: 'Flipkart',
        domain: 'flipkart.com',
        brandColor: '#2874F0',
        theme: {
          bg: '#F0F6FF',
          border: '#BFDBFE',
          text: '#1D4ED8',
          accent: '#FFE500',
        },
      };

    case 'myntra':
      return {
        key: 'myntra',
        name: 'Myntra',
        domain: 'myntra.com',
        brandColor: '#FF3F6C',
        theme: {
          bg: '#FFF1F5',
          border: '#FECDD3',
          text: '#BE123C',
          accent: '#FF3F6C',
        },
      };

    case 'ajio':
      return {
        key: 'ajio',
        name: 'AJIO',
        domain: 'ajio.com',
        brandColor: '#000000',
        theme: {
          bg: '#F8FAFC',
          border: '#CBD5E1',
          text: '#0F172A',
          accent: '#E11D48',
        },
      };

    case 'nykaa':
      return {
        key: 'nykaa',
        name: 'Nykaa',
        domain: 'nykaa.com',
        brandColor: '#FC2779',
        theme: {
          bg: '#FFF1F8',
          border: '#FBCFE8',
          text: '#BE185D',
          accent: '#FC2779',
        },
      };

    case 'croma':
      return {
        key: 'croma',
        name: 'Croma',
        domain: 'croma.com',
        brandColor: '#00E9BF',
        theme: {
          bg: '#F0FDFA',
          border: '#99F6E4',
          text: '#0F766E',
          accent: '#00E9BF',
        },
      };

    case 'meesho':
      return {
        key: 'meesho',
        name: 'Meesho',
        domain: 'meesho.com',
        brandColor: '#F43397',
        theme: {
          bg: '#FDF2F8',
          border: '#F5D0FE',
          text: '#86198F',
          accent: '#F43397',
        },
      };

    case 'tatacliq':
      return {
        key: 'tatacliq',
        name: 'Tata CLiQ',
        domain: 'tatacliq.com',
        brandColor: '#ED1D24',
        theme: {
          bg: '#FAFAFA',
          border: '#E4E4E7',
          text: '#18181B',
          accent: '#ED1D24',
        },
      };

    case 'generic':
    default:
      return {
        key: 'generic',
        name: 'Marketplace',
        domain: '',
        brandColor: '#B8860B',
        theme: {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#047857',
          accent: '#059669',
        },
      };
  }
}

interface PlatformLogoProps {
  platform: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Authentic, high-precision SVG vector logo for supported e-commerce platforms.
 */
export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  platform,
  size = 20,
  className = '',
  style = {},
}) => {
  const key = normalizePlatform(platform);
  const px = typeof size === 'number' ? `${size}px` : size;

  switch (key) {
    case 'amazon':
      // Official Amazon mark: Dark rounded container with white 'a' and curved orange smile arrow
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Amazon Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#131921" />
          {/* Lowercase 'a' */}
          <path
            d="M16.4 19.8c-1.3 0-2.3-.3-3-.9-.7-.6-1-1.5-1-2.6 0-2.3 1.4-3.5 4.3-3.6v-.2c0-.6-.1-1-.5-1.3-.4-.3-.9-.4-1.6-.4-.9 0-2 .3-3.1.8l-.6-1.9c1.3-.6 2.7-.9 4.1-.9 1.6 0 2.9.4 3.6 1.1.7.7 1.1 1.8 1.1 3.2V19.4h-2.1v-1.2c-.6 1-1.5 1.6-2.6 1.6zm.3-1.6c.9 0 1.6-.4 2.1-1v-2c-1.6.1-2.5.7-2.5 1.9 0 .7.4 1.1 1.2 1.1z"
            fill="#FFFFFF"
          />
          {/* Orange Smile Arrow */}
          <path
            d="M8.5 23.5c4.8 3.2 11.2 3 15.4-.8"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M24.8 21.2c.4 1.2 1.1 2.4 1.1 2.4s-1.3.1-2.5-.4c-.2 0 .8-1.2 1.4-2z"
            fill="#FF9900"
          />
        </svg>
      );

    case 'flipkart':
      // Official Flipkart mark: Vibrant yellow shopping bag with blue handle, speed lines, and italic 'f'
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Flipkart Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#FFE500" />
          {/* Blue Shopping Bag Handle */}
          <path
            d="M12 7.5c0-2.2 1.8-4 4-4s4 1.8 4 4"
            stroke="#2874F0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Speed / Motion lines */}
          <line x1="6.5" y1="14" x2="11.5" y2="14" stroke="#2874F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="7.5" y1="18" x2="11" y2="18" stroke="#2874F0" strokeWidth="2" strokeLinecap="round" />
          {/* Italic 'f' */}
          <path
            d="M17.5 10.5c-2 0-3.3 1.2-3.6 3.1h-2.1v2.8h1.9l-.7 8.1h3.4l.7-8.1h2.3l.3-2.8h-2.4c.2-1 .7-1.5 1.5-1.5.5 0 1 .1 1.4.3l.5-2.6c-.8-.2-1.8-.3-2.7-.3z"
            fill="#2874F0"
          />
        </svg>
      );

    case 'myntra':
      // Official Myntra mark: The iconic 4-color overlapping geometric ribbon "M"
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Myntra Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          {/* Left Ribbon Petal (Vibrant Pink) */}
          <path
            d="M7 23c-1.5-2.4-1.3-5.6.4-7.8l6.1-7.4c1.1-1.3 3.1-1.3 4.2 0l1.3 1.5-7 8.5c-1.2 1.4-1.3 3.5-.3 5.1H7z"
            fill="#FF3F6C"
          />
          {/* Right Ribbon Petal (Bright Fuchsia) */}
          <path
            d="M25 23c1.5-2.4 1.3-5.6-.4-7.8l-6.1-7.4c-1.1-1.3-3.1-1.3-4.2 0l-1.3 1.5 7 8.5c1.2 1.4 1.3 3.5.3 5.1H25z"
            fill="#FB56C1"
          />
          {/* Center Fold (Radiant Orange) */}
          <path
            d="M12.2 9.2l2.5-3.1c1.1-1.3 3.1-1.3 4.2 0l2.5 3.1-4.6 5.5-4.6-5.5z"
            fill="#F26A10"
          />
          {/* Center Bottom Facet (Crimson Red) */}
          <path
            d="M12.5 19.5l2.2-2.6 2.2 2.6c.6 1 1.6 1.7 2.8 2-1.1 1.2-2.8 1.8-4.9 1.8s-3.8-.6-4.9-1.8c1.2-.3 2.2-1 2.6-2z"
            fill="#E72744"
          />
        </svg>
      );

    case 'ajio':
      // Official AJIO mark: Pure black background with bold geometric white letterforms and red accent
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="AJIO Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#000000" />
          {/* A */}
          <path d="M6.2 21l3.5-10h2.6l3.5 10h-2.4l-.7-2.3H9.1L8.4 21H6.2zm3.5-4.2h2.4L10.9 13l-1.2 3.8z" fill="#FFFFFF" />
          {/* J */}
          <path d="M16 11h2.2v7.2c0 1-.3 1.8-.9 2.3-.6.5-1.5.8-2.6.8-.7 0-1.4-.1-1.9-.4l.4-1.8c.4.2.9.3 1.4.3.6 0 1.1-.2 1.3-.4.2-.3.3-.8.3-1.4V11z" fill="#FFFFFF" />
          {/* I */}
          <path d="M19.5 11h2.2v10h-2.2V11z" fill="#FFFFFF" />
          {/* O */}
          <path d="M22.8 16c0-3.1 1.5-5.2 4.1-5.2s4.1 2.1 4.1 5.2-1.5 5.2-4.1 5.2-4.1-2.1-4.1-5.2zm6 0c0-2-.8-3.3-1.9-3.3s-1.9 1.3-1.9 3.3.8 3.3 1.9 3.3 1.9-1.3 1.9-3.3z" fill="#FFFFFF" />
          {/* Luxury Red Accent Notch */}
          <rect x="13" y="6" width="6" height="1.6" rx="0.8" fill="#E11D48" />
        </svg>
      );

    case 'nykaa':
      // Official Nykaa mark: Hot pink background with crisp white typography
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Nykaa Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#FC2779" />
          {/* N */}
          <path d="M6 21V11h2.5l4.5 6.2V11h2.2v10h-2.3L8.2 14.5V21H6z" fill="#FFFFFF" />
          {/* Y */}
          <path d="M16.5 11l2.4 4.5 2.4-4.5h2.6l-3.6 6.3V21h-2.2v-3.7L14 11h2.5z" fill="#FFFFFF" />
          {/* K */}
          <path d="M24.5 11h2.2v4.2l3.2-4.2h2.8l-3.8 4.8 4 5.2h-2.9l-3.3-4.4V21h-2.2V11z" fill="#FFFFFF" />
        </svg>
      );

    case 'croma':
      // Official Croma mark: Graphite disc with electric teal infinity arc & glowing dot
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Croma Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#0E1318" />
          <circle cx="16" cy="16" r="8" stroke="#00E9BF" strokeWidth="2.4" strokeDasharray="32 10" />
          <circle cx="16" cy="16" r="2.8" fill="#00E9BF" />
        </svg>
      );

    case 'meesho':
      // Official Meesho mark: Signature magenta background with shopping bag handle and twin-arch 'm'
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Meesho Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#F43397" />
          {/* Bag handle */}
          <path d="M12 9c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Lowercase 'm' */}
          <path
            d="M8 22V13.8h2.6v1.3c.7-1 1.7-1.5 2.8-1.5 1.3 0 2.3.7 2.7 1.8.8-1.1 1.9-1.8 3.3-1.8 1.9 0 3.2 1.2 3.2 3.5V22h-2.6v-4.6c0-1.1-.6-1.7-1.4-1.7-.8 0-1.5.6-1.5 1.7V22h-2.6v-4.6c0-1.1-.6-1.7-1.4-1.7-.8 0-1.5.6-1.5 1.7V22H8z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'tatacliq':
      // Official Tata CLiQ mark: Onyx black background with circular stylized 'Q' and central crimson red dot
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Tata CLiQ Official Logo"
        >
          <rect width="32" height="32" rx="7" fill="#0A0A0A" />
          <circle cx="16" cy="16" r="8.5" stroke="#FFFFFF" strokeWidth="2.2" />
          <circle cx="16" cy="16" r="3.2" fill="#ED1D24" />
          <path d="M21 21l3.5 3.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'generic':
    default:
      // Elegant gold luxury marketplace bag for generic or unknown stores
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: px, height: px, minWidth: px, ...style }}
          className={`shrink-0 ${className}`}
          role="img"
          aria-label="Marketplace Icon"
        >
          <rect width="32" height="32" rx="7" fill="#047857" />
          <path
            d="M10 11V9a6 6 0 0 1 12 0v2m-14 3h16l-1.5 12H9.5L8 14z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

interface PlatformBadgeProps {
  platform: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

/**
 * Luxury branded badge with official platform logo and tailored brand color scheme.
 */
export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  label,
  size = 'md',
  className = '',
  onClick,
}) => {
  const meta = getPlatformMeta(platform);
  const textLabel = label || `${meta.name} Verified Listing`;

  const sizeStyles = {
    sm: {
      padding: '3px 8px',
      fontSize: '0.625rem',
      logoSize: 14,
      gap: '5px',
    },
    md: {
      padding: '4px 12px',
      fontSize: '0.6875rem',
      logoSize: 16,
      gap: '6px',
    },
    lg: {
      padding: '6px 14px',
      fontSize: '0.75rem',
      logoSize: 20,
      gap: '8px',
    },
  }[size];

  return (
    <span
      onClick={onClick}
      style={{
        padding: sizeStyles.padding,
        borderRadius: '100px',
        fontSize: sizeStyles.fontSize,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        background: meta.theme.bg,
        border: `1px solid ${meta.theme.border}`,
        color: meta.theme.text,
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        boxShadow: '0 1px 3px -1px rgba(0, 0, 0, 0.05)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      className={`transition-all select-none ${className}`}
    >
      <PlatformLogo platform={platform} size={sizeStyles.logoSize} />
      <span>{textLabel}</span>
    </span>
  );
};
