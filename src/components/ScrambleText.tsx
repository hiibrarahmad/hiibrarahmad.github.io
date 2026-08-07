import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  autostart?: boolean;
}

const CIPHER_CHARS = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEF0x00F0FF';

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  scrambleOnHover = true,
  autostart = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);

  const triggerScramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const totalSteps = text.length * 2.5;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '.' || char === '_') return char;
            if (index < iteration / 2.5) {
              return text[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration >= totalSteps) {
        clearInterval(interval);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
    }, 25);
  };

  useEffect(() => {
    if (autostart) {
      triggerScramble();
    }
  }, [autostart, text]);

  return (
    <span
      onMouseEnter={() => {
        if (scrambleOnHover) triggerScramble();
      }}
      className={`inline-block transition-colors ${className}`}
    >
      {displayText}
    </span>
  );
};
