import { useState, useEffect, useCallback, useRef } from 'react';

/*
 * useCountdown
 * ------------
 * A small custom hook that ticks down to a target date/time and returns
 * the remaining days/hours/minutes/seconds, re-rendering once a second.
 * Pulled out of CountdownTimer.jsx so the same "time remaining" logic can
 * be reused anywhere (cards, banners, the landing page, etc.) without
 * duplicating the interval/cleanup code.
 */
export function useCountdown(targetDate) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isOver: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

/*
 * useScrollReveal
 * ---------------
 * Custom hook built on the IntersectionObserver API + useRef. Attach the
 * returned `ref` to any element; `isVisible` flips to true the first time
 * that element scrolls into the viewport, so a component can add a
 * "reveal" animation class only once, the first time it's seen.
 *
 * Used across the landing page (Home.jsx) so each section fades/slides
 * into place as the visitor scrolls, instead of everything being static.
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // If the browser has no IntersectionObserver support, just show it.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
