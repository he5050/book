
import React, { useState, useEffect, useMemo, useRef } from 'react';
import './FlipClock.scss';

// Helper to pad numbers with a leading zero if needed
const padZero = (num: number): string => num.toString().padStart(2, '0');

// Props for the FlipUnit component
interface FlipUnitProps {
  digit: string;
  previousDigit: string;
  cardColor: string;
  textColor: string;
  fontSize: string;
  cardWidth: number;
  cardHeight: number;
}

// Represents a single flipping digit
const FlipUnit: React.FC<FlipUnitProps> = React.memo(
  ({ digit, previousDigit, cardColor, textColor, fontSize, cardWidth, cardHeight }) => {
    const [play, setPlay] = useState(false);

    // Trigger animation when the digit prop changes
    useEffect(() => {
      if (digit !== previousDigit) {
        setPlay(true);
        // Remove the play class after the animation finishes
        const timeout = setTimeout(() => {
          setPlay(false);
        }, 900); // Animation duration is ~0.5s, buffer is good

        return () => clearTimeout(timeout);
      }
    }, [digit]);

    const unitStyle = {
      width: cardWidth,
      height: cardHeight,
      fontSize,
      lineHeight: `${cardHeight - 3}px`,
    };

    const innStyle = {
      backgroundColor: cardColor,
      color: textColor,
    };

    return (
      <div className={`flip-unit ${play ? 'play' : ''}`} style={unitStyle}>
        {/* Static card for the previous digit */}
        <div className="flip-card before">
          <div className="card-half up">
            <div className="shadow"></div>
            <div className="inn" style={innStyle}>{previousDigit}</div>
          </div>
          <div className="card-half down">
            <div className="shadow"></div>
            <div className="inn" style={innStyle}>{previousDigit}</div>
          </div>
        </div>

        {/* Animated card for the current digit */}
        <div className="flip-card active">
          <div className="card-half up">
            <div className="shadow"></div>
            <div className="inn" style={innStyle}>{digit}</div>
          </div>
          <div className="card-half down">
            <div className="shadow"></div>
            <div className="inn" style={innStyle}>{digit}</div>
          </div>
        </div>
      </div>
    );
  }
);

// Main FlipClock component props
export interface FlipClockProps {
  /**
   * Display format. Use yyyy, mm, dd, HH, mm, ss.
   * @default "HH:mm:ss"
   */
  format?: string;
  /** Custom class name */
  className?: string;
  /** Color of the flip cards */
  cardColor?: string;
  /** Color of the text */
  textColor?: string;
  /** Font size of the text */
  fontSize?: string;
  /** Width of a single card in pixels */
  cardWidth?: number;
  /** Height of a single card in pixels */
  cardHeight?: number;
}

/**
 * A customizable Flip Clock component for React that supports date and time formatting.
 */
const FlipClock: React.FC<FlipClockProps> = ({
  format = 'HH:mm:ss',
  className = '',
  cardColor = '#333333',
  textColor = '#ffffff',
  fontSize = '80px',
  cardWidth = 60,
  cardHeight = 90,
}) => {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());

  const timeFormatter = (date: Date): string[] => {
    const year = date.getFullYear().toString();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return format
      .replace('yyyy', year)
      .replace('mm', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes) // Note: month 'mm' is replaced first
      .replace('ss', seconds)
      .split('');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(currentTime => {
        setPrevTime(currentTime);
        return new Date();
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeValues = useMemo(() => timeFormatter(time), [time, format]);
  const prevTimeValues = useMemo(() => timeFormatter(prevTime), [prevTime, format]);

  return (
    <div className={`flip-clock ${className}`}>
      {timeValues.map((char, index) => {
        if (/[0-9]/.test(char)) {
          return (
            <FlipUnit
              key={index}
              digit={char}
              previousDigit={prevTimeValues[index] || '0'}
              cardColor={cardColor}
              textColor={textColor}
              fontSize={fontSize}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          );
        } else {
          return (
            <div key={index} className="separator">
              {char}
            </div>
          );
        }
      })}
    </div>
  );
};

export default FlipClock;
