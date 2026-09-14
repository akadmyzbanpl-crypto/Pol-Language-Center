import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-11 h-11', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' },
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Precision Bridge & Book Logo SVG matching Pol Language Center brand */}
      <div className={`relative ${sizeMap[size].icon} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Bridge Tower / Cables */}
          <path d="M100 10 L100 110" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 15 L70 95" stroke="#0F172A" strokeWidth="3" />
          <path d="M100 15 L130 95" stroke="#0F172A" strokeWidth="3" />
          <path d="M100 25 L50 95" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M100 25 L150 95" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M100 35 L35 95" stroke="#0F172A" strokeWidth="2" />
          <path d="M100 35 L165 95" stroke="#0F172A" strokeWidth="2" />

          {/* Bridge Deck */}
          <path d="M30 95 Q100 85 170 95" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          {/* Vertical bridge railing lines */}
          <line x1="45" y1="92" x2="45" y2="105" stroke="#0F172A" strokeWidth="3" />
          <line x1="60" y1="90" x2="60" y2="105" stroke="#0F172A" strokeWidth="3" />
          <line x1="75" y1="88" x2="75" y2="105" stroke="#0F172A" strokeWidth="3" />
          <line x1="125" y1="88" x2="125" y2="105" stroke="#0F172A" strokeWidth="3" />
          <line x1="140" y1="90" x2="140" y2="105" stroke="#0F172A" strokeWidth="3" />
          <line x1="155" y1="92" x2="155" y2="105" stroke="#0F172A" strokeWidth="3" />

          {/* Left Book Pages in Pol Brand Blue */}
          <path
            d="M95 140 C60 135 30 145 20 150 C20 130 20 90 20 90 C35 85 65 75 95 90 Z"
            stroke="#2563EB"
            strokeWidth="5"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M95 155 C60 150 28 160 18 165 C18 150 18 105 18 105 C35 100 65 92 95 105"
            stroke="#3B82F6"
            strokeWidth="4.5"
            fill="none"
          />

          {/* Right Book Pages in Pol Brand Blue */}
          <path
            d="M105 140 C140 135 170 145 180 150 C180 130 180 90 180 90 C165 85 135 75 105 90 Z"
            stroke="#2563EB"
            strokeWidth="5"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M105 155 C140 150 172 160 182 165 C182 150 182 105 182 105 C165 100 135 92 105 105"
            stroke="#3B82F6"
            strokeWidth="4.5"
            fill="none"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 ${sizeMap[size].text}`}>
              آموزشگاه زبان پل
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
              POL
            </span>
          </div>
          <span className={`text-slate-500 font-medium ${sizeMap[size].sub}`}>
            پلی به سوی آینده‌ای بهتر
          </span>
        </div>
      )}
    </Link>
  );
};
