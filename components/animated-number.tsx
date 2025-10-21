"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: string | number;
  className?: string;
  prefix?: string;
}

export function AnimatedNumber({
  value,
  className = "",
  prefix = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      setIsAnimating(true);

      // Delay to show animation
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 100);

      previousValue.current = value;

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`${className} ${
        isAnimating ? "animate-slot-machine" : ""
      } inline-block transition-all duration-300`}
    >
      {prefix}
      {displayValue}
    </span>
  );
}
