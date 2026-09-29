import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Regex pattern to match URLs (http, https, www)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          // Clean trailing punctuation like period or comma if accidentally attached at the end of URL
          let cleanUrl = part;
          let trailingPunctuation = '';
          const lastChar = cleanUrl.slice(-1);
          if (['.', ',', '!', '?', ';', ')'].includes(lastChar)) {
            trailingPunctuation = lastChar;
            cleanUrl = cleanUrl.slice(0, -1);
          }

          const href = cleanUrl.startsWith('www.') ? `https://${cleanUrl}` : cleanUrl;

          return (
            <React.Fragment key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#0D5230] underline font-semibold hover:text-[#0A4025] break-all transition-colors inline"
              >
                {cleanUrl}
              </a>
              {trailingPunctuation}
            </React.Fragment>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default FormattedText;
