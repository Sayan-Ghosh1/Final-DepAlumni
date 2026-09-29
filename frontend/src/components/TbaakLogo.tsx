import React, { useState } from 'react';

interface TbaakLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  src?: string;
}

const SUPABASE_LOGO_URL = "https://mxuiikbyhwuzaljajbjo.supabase.co/storage/v1/object/public/logo/taki%20logo.jpeg";
const LOCAL_LOGO_JPEG = "/taki-logo.jpeg";
const LOCAL_LOGO_SVG = "/taki-logo.svg";

export default function TbaakLogo({ className = "", size = "md", src }: TbaakLogoProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || SUPABASE_LOGO_URL);

  const dimensions = {
    sm: "h-14 sm:h-16",
    md: "h-24 sm:h-28",
    lg: "h-32 sm:h-40",
    xl: "h-44 sm:h-52 md:h-64",
    custom: ""
  };

  const handleImageError = () => {
    // Fallbacks if remote Supabase image URL ever fails
    if (currentSrc === SUPABASE_LOGO_URL) {
      setCurrentSrc(LOCAL_LOGO_JPEG);
    } else if (currentSrc === LOCAL_LOGO_JPEG) {
      setCurrentSrc(LOCAL_LOGO_SVG);
    }
  };

  return (
    <div className={`inline-block ${className}`} id="tbaak-logo-container">
      <img 
        src={currentSrc} 
        alt="Taki Boys' Alumni Association Kolkata (TBAAK)" 
        className={`${dimensions[size]} w-auto object-contain rounded-xl shadow-md border border-emerald-800/20 hover:shadow-lg transition-shadow duration-200 select-none`} 
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        id="tbaak-official-logo"
        onError={handleImageError}
      />
    </div>
  );
}
