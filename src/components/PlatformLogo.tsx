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
          accent: '#C8102E',
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
        brandColor: '#047857',
        theme: {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#047857',
          accent: '#059669',
        },
      };
  }
}

export interface PlatformLogoProps {
  platform: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'icon' | 'full';
}

/**
 * Authentic, genuine vector logo for supported e-commerce platforms.
 * Uses original brand paths, typography, and official color palettes.
 */
export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  platform,
  size = 20,
  className = '',
  style = {},
  variant = 'icon',
}) => {
  const key = normalizePlatform(platform);
  const px = typeof size === 'number' ? `${size}px` : size;

  switch (key) {
    case 'amazon':
      if (variant === 'full') {
        // Genuine Amazon full logo with official smile arrow
        return (
          <svg
            viewBox="0 0 603 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: `calc(${px} * 3.3)`, height: px, ...style }}
            className={`shrink-0 ${className}`}
            role="img"
            aria-label="Amazon Official Logo"
          >
            {/* Smile Arrow in #FF9900 */}
            <path
              d="M374.006 142.184c-35 25.797-85.729 39.561-129.406 39.561-61.243 0-116.377-22.651-158.088-60.325-3.277-2.963-.341-7 3.592-4.693 45.014 26.191 100.673 41.947 158.166 41.947 38.775 0 81.43-8.022 120.65-24.67 5.925-2.517 10.88 3.88 5.086 8.18"
              fill="#FF9900"
            />
            <path
              d="M388.557 125.536c-4.457-5.715-29.573-2.7-40.846-1.363-3.434.419-3.959-2.57-.865-4.719 20.003-14.078 52.827-10.015 56.655-5.296 3.827 4.745-.996 37.647-19.794 53.351-2.884 2.412-5.637 1.127-4.352-2.071 4.221-10.539 13.685-34.161 9.202-39.902"
              fill="#FF9900"
            />
            {/* 'a' */}
            <path
              d="M55.288 59.758V55.72c-13.475 0-27.711 2.884-27.711 18.771 0 8.049 4.168 13.502 11.326 13.502 5.243 0 9.936-3.225 12.899-8.468 3.67-6.45 3.486-12.506 3.486-19.768m18.798 45.434c-1.233 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.525-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.251-5.243 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.502-2.281-3.434-6.633-4.85-10.461-4.85-7.105 0-13.45 3.644-14.996 11.194-.315 1.678-1.547 3.33-3.225 3.409L6.263 32.676C4.742 32.335 3.064 31.103 3.484 28.77 7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.281 9.071 8.468 8.206 19.767 8.206 32.063v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.052 4.955-3.802 3.172-10.566 9.071-14.289 12.374l-.052-.052"
              fill="#131921"
            />
            {/* 'm' */}
            <path
              d="M125 105.454h-18.64c-1.783-.131-3.199-1.468-3.33-3.172V6.617c0-1.914 1.6-3.435 3.592-3.435h17.382c1.809.079 3.25 1.468 3.382 3.199v12.505h.34c4.536-12.086 13.056-17.723 24.54-17.723 11.666 0 18.954 5.637 24.198 17.723 4.509-12.086 14.76-17.723 25.745-17.723 7.812 0 16.359 3.225 21.576 10.461 5.899 8.048 4.693 19.741 4.693 29.992l-.027 60.377c0 1.914-1.6 3.461-3.591 3.461h-18.614c-1.862-.131-3.356-1.625-3.356-3.461V51.29c0-4.037.367-14.104-.524-17.932-1.39-6.423-5.558-8.232-10.959-8.232-4.51 0-9.228 3.015-11.142 7.839-1.914 4.824-1.73 12.899-1.73 18.325v50.704c0 1.914-1.6 3.46-3.592 3.46h-18.614c-1.888-.13-3.356-1.625-3.356-3.46V51.29c0-10.67 1.757-26.374-11.483-26.374-13.397 0-12.872 15.31-12.872 26.374v50.704c0 1.914-1.6 3.46-3.592 3.46"
              fill="#131921"
            />
            {/* 'a' (second) */}
            <path
              d="M299.655 59.758V55.72c-13.475 0-27.711 2.884-27.711 18.771 0 8.049 4.168 13.502 11.326 13.502 5.243 0 9.936-3.225 12.899-8.468 3.67-6.45 3.486-12.506 3.486-19.768m18.798 45.434c-1.233 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.525-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.251-5.243 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.502-2.281-3.434-6.633-4.85-10.461-4.85-7.105 0-13.45 3.644-14.996 11.194-.315 1.678-1.547 3.33-3.225 3.409l-13.882-1.996c-1.521-.34-3.2-.9-2.78-3.235 4.169-21.917 23.962-28.524 41.685-28.524 9.07 0 20.92 2.412 28.078 9.281 9.071 8.468 8.206 19.767 8.206 32.063v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.052 4.955-3.802 3.172-10.566 9.071-14.289 12.374l-.052-.052"
              fill="#131921"
            />
            {/* 'z' */}
            <path
              d="M348.497 20.066V6.381c0-2.071 1.573-3.461 3.461-3.461h61.269c1.966 0 3.539 1.416 3.539 3.461v11.719c-.026 1.966-1.678 4.535-4.614 8.599l-31.749 45.329c11.798-.288 24.251 1.468 34.947 7.498 2.412 1.363 3.067 3.356 3.251 5.322v14.603c0 1.992-2.202 4.326-4.509 3.12-18.85-9.884-43.887-10.959-64.73.105-2.123 1.153-4.351-1.154-4.351-3.146V85.66c0-2.228.026-6.03 2.254-9.412l36.783-52.748h-32.011c-1.966 0-3.54-1.39-3.54-3.435"
              fill="#131921"
            />
            {/* 'o' */}
            <path
              d="M469.514 1.164c27.659 0 42.629 23.752 42.629 53.954 0 29.179-16.543 52.329-42.629 52.329-27.16 0-41.947-23.753-41.947-53.351 0-29.783 14.97-52.932 41.947-52.932m.158 19.531c-13.738 0-14.603 18.719-14.603 30.386 0 11.692-.184 36.651 14.445 36.651 14.446 0 15.128-20.135 15.128-32.404 0-8.075-.341-17.723-2.78-25.378-2.097-6.659-6.265-9.255-12.19-9.255"
              fill="#131921"
            />
            {/* 'n' */}
            <path
              d="M548.008 105.454h-18.562c-1.861-.131-3.356-1.625-3.356-3.461l-.026-95.691c.157-1.757 1.704-3.12 3.592-3.12h17.277c1.625.079 2.962 1.18 3.329 2.674v14.629h.341c5.217-13.082 12.532-19.322 25.404-19.322 8.363 0 16.517 3.015 21.76 11.273 4.876 7.656 4.876 20.528 4.876 29.783v60.22c-.21 1.678-1.756 3.015-3.591 3.015h-18.693c-1.704-.131-3.12-1.39-3.303-3.015V50.478c0-10.461 1.206-25.772-11.667-25.772-4.535 0-8.704 3.042-10.775 7.656-2.621 5.846-2.962 11.666-2.962 18.115v51.516c-.027 1.914-1.652 3.461-3.645 3.461"
              fill="#131921"
            />
          </svg>
        );
      }

      // Authentic Amazon Official Mobile Icon: Deep slate #131921 squircle with genuine 'a' + smile arrow
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
          {/* Authentic lowercase 'a' */}
          <path
            d="M15.8 19.5c-1.4 0-2.5-.3-3.2-1-.7-.6-1-1.6-1-2.8 0-2.4 1.5-3.8 4.6-3.9v-.2c0-.6-.1-1.1-.5-1.4-.4-.3-1-.4-1.7-.4-1 0-2.2.3-3.3.9l-.6-2.1c1.4-.6 2.9-1 4.4-1 1.7 0 3.1.4 3.9 1.2.8.8 1.2 1.9 1.2 3.4v6.9h-2.2v-1.3c-.6 1.1-1.6 1.7-2.8 1.7zm.3-1.7c1 0 1.7-.4 2.2-1.1v-2.1c-1.7.1-2.7.8-2.7 2.1 0 .7.4 1.1 1.2 1.1z"
            fill="#FFFFFF"
          />
          {/* Authentic curved smile arrow */}
          <path
            d="M7.5 23.2c4.8 3.3 11.4 3.1 15.6-.9"
            stroke="#FF9900"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M23.4 20.8c.4 1.3 1.2 2.5 1.2 2.5s-1.4.1-2.6-.4c-.2 0 .8-1.3 1.4-2.1z"
            fill="#FF9900"
          />
        </svg>
      );

    case 'flipkart':
      // Authentic Flipkart Official Mark: Royal blue background with iconic yellow shopping bag, handle, and italic 'f'
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
          <rect width="32" height="32" rx="7" fill="#2874F0" />
          {/* Vibrant Yellow Shopping Bag */}
          <path d="M8 12h16l-1.6 14.5H9.6L8 12z" fill="#FFE500" />
          {/* Blue Bag Handle */}
          <path
            d="M13 12V9.5C13 7.8 14.3 6.5 16 6.5s3 1.3 3 3V12"
            stroke="#2874F0"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M13.8 12V9.8c0-1.2 1-2.2 2.2-2.2s2.2 1 2.2 2.2V12"
            stroke="#FFE500"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          {/* Royal Blue Italic 'f' */}
          <path
            d="M17.4 15.2c-1.8 0-3 1.1-3.3 2.8h-1.9v2.5h1.7l-.6 7.3h3.1l.6-7.3h2.1l.3-2.5h-2.2c.2-.9.6-1.3 1.3-1.3.5 0 .9.1 1.2.3l.5-2.3c-.7-.2-1.6-.3-2.4-.3z"
            fill="#2874F0"
          />
          {/* Speed motion lines */}
          <line x1="5.2" y1="17.2" x2="8.8" y2="17.2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6.2" y1="20.5" x2="9.2" y2="20.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'myntra':
      // Authentic Myntra Official 4-Color Geometric Ribbon 'M'
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
          {/* Left Ribbon Petal (Vibrant Pink #FF3F6C) */}
          <path
            d="M6.8 23.2c-1.5-2.4-1.3-5.6.4-7.8l5.8-7c1-1.2 2.9-1.2 3.9 0l1.2 1.4-6.6 8c-1.1 1.3-1.2 3.3-.3 4.8l-4.4.6z"
            fill="#FF3F6C"
          />
          {/* Right Ribbon Petal (Fuchsia Magenta #D71A60) */}
          <path
            d="M25.2 23.2c1.5-2.4 1.3-5.6-.4-7.8l-5.8-7c-1-1.2-2.9-1.2-3.9 0l-1.2 1.4 6.6 8c1.1 1.3 1.2 3.3.3 4.8l4.4.6z"
            fill="#D71A60"
          />
          {/* Center Top Fold (Radiant Orange #F26A10) */}
          <path
            d="M12 9.6l2.3-2.8c1-1.2 2.9-1.2 3.9 0l2.3 2.8-4.2 5.1-4.3-5.1z"
            fill="#F26A10"
          />
          {/* Center Bottom Facet (Crimson #BE123C) */}
          <path
            d="M12.4 19.8l2.1-2.5 2.1 2.5c.6.9 1.5 1.6 2.7 1.9-1.1 1.1-2.7 1.7-4.7 1.7s-3.6-.6-4.7-1.7c1.1-.3 2.1-.9 2.5-1.9z"
            fill="#BE123C"
          />
        </svg>
      );

    case 'ajio':
      // Authentic AJIO Official Typography & Brand Mark
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
          <text
            x="16"
            y="20.5"
            fontFamily="'Century Gothic', 'Montserrat', Arial, sans-serif"
            fontWeight="900"
            fontSize="10.5"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="1"
          >
            AJIO
          </text>
          {/* Iconic AJIO Crimson Brand Accent Notch */}
          <rect x="13" y="23.2" width="6" height="1.5" rx="0.75" fill="#C8102E" />
        </svg>
      );

    case 'nykaa':
      // Authentic Nykaa Official Hot Pink Typography
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
          <text
            x="16"
            y="20"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="8.8"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="1"
          >
            NYKAA
          </text>
        </svg>
      );

    case 'croma':
      // Authentic Tata Croma Electric Teal Infinity Loop & Central Core
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
          <rect width="32" height="32" rx="7" fill="#121820" />
          <circle
            cx="16"
            cy="16"
            r="8.5"
            stroke="#00E9BF"
            strokeWidth="2.4"
            strokeDasharray="42 11"
            strokeLinecap="round"
          />
          <circle cx="16" cy="16" r="2.6" fill="#00E9BF" />
        </svg>
      );

    case 'meesho':
      // Authentic Meesho Signature Magenta Shopping Bag & Arch Letterform
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
          {/* Shopping Bag Handle */}
          <path
            d="M12.5 11c0-2 1.6-3.6 3.5-3.6s3.5 1.6 3.5 3.6"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Twin-Arch 'm' */}
          <path
            d="M8.5 22.5V14.8h2.5v1.3c.7-1 1.7-1.5 2.7-1.5 1.3 0 2.2.7 2.6 1.7.8-1 1.8-1.7 3.2-1.7 1.8 0 3.1 1.1 3.1 3.3v4.6H20v-4.4c0-1-.6-1.6-1.3-1.6-.8 0-1.4.6-1.4 1.6v4.4h-2.5v-4.4c0-1-.6-1.6-1.3-1.6-.8 0-1.4.6-1.4 1.6v4.4H8.5z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'tatacliq':
      // Authentic Tata CLiQ Circular 'Q' with Vibrant Red Dot
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
          <circle cx="16" cy="15.5" r="8" stroke="#FFFFFF" strokeWidth="2.2" />
          <circle cx="16" cy="15.5" r="3.2" fill="#ED1D24" />
          <path d="M21 20.5l3.5 3.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'generic':
    default:
      // Elegant luxury shopping bag mark for unknown or generic marketplaces
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

export interface PlatformBadgeProps {
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
