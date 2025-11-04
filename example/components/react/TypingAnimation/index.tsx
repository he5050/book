import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface TypingAnimationProps {
  texts?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
  showCursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts = ["Hello World!", "Welcome to Typing Animation!", "Enjoy Coding!"],
  typingSpeed = 150,
  deletingSpeed = 75,
  delayBetweenTexts = 2000,
  showCursor = true,
  cursorChar = "|",
  loop = true,
  className = '',
  style = {},
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isComplete && !loop) {
      onComplete?.();
      return;
    }

    const currentText = texts[textIndex];
    
    const typeText = () => {
      if (!isDeleting) {
        // 打字阶段
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
          timeoutRef.current = setTimeout(typeText, typingSpeed);
        } else {
          // 打字完成，准备删除
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            typeText();
          }, delayBetweenTexts);
        }
      } else {
        // 删除阶段
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
          timeoutRef.current = setTimeout(typeText, deletingSpeed);
        } else {
          // 删除完成，切换到下一个文本
          setIsDeleting(false);
          const nextIndex = (textIndex + 1) % texts.length;
          
          if (!loop && nextIndex === 0) {
            setIsComplete(true);
            return;
          }
          
          setTextIndex(nextIndex);
          timeoutRef.current = setTimeout(typeText, typingSpeed);
        }
      }
    };

    timeoutRef.current = setTimeout(typeText, typingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [textIndex, charIndex, isDeleting, texts, typingSpeed, deletingSpeed, delayBetweenTexts, loop, isComplete, onComplete]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`typing-animation-container ${className}`}
      style={style}
    >
      <span className="typing-text">{displayText}</span>
      {showCursor && (
        <span className="typing-cursor">{cursorChar}</span>
      )}
    </div>
  );
};

export default TypingAnimation;