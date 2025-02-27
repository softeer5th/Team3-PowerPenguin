import { useEffect, useState, useRef } from 'react';

const useBlockTimer = (type: string, blockDuration: number, delay: number) => {
  // 로컬에 값이 있으면 사용 없으면 0으로
  const storedCountdown = Number(localStorage.getItem(type)) || 0;
  const initialCountdown = storedCountdown > 0 ? storedCountdown : 0;

  // 값이 존재하는 경우 isBlock을 바로 true처리
  const [isBlocked, setIsBlocked] = useState(initialCountdown > 0);
  const [countdown, setCountdown] = useState(initialCountdown);

  const countdownIntervalRef = useRef<number | null>(null);
  const blockTimerRef = useRef<number | null>(null);

  // 로컬 스토리지에 값이 존재하는 경우 바로 카운트 다운 시작
  useEffect(() => {
    if (initialCountdown > 0) {
      setIsBlocked(true);
      startCountdown(initialCountdown);
    }

    return () => {
      clearTimeout(blockTimerRef.current!);
      clearInterval(countdownIntervalRef.current!);
    };
  }, [type, blockDuration, delay]);

  // 카운트 다운 함수
  const startCountdown = (duration: number) => {
    setCountdown(duration);
    localStorage.setItem(type, duration.toString());

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          localStorage.setItem(type, '0');
          return 0;
        }
        const newCountdown = prev - 1;
        localStorage.setItem(type, newCountdown.toString());
        return newCountdown;
      });
    }, 1000);

    blockTimerRef.current = window.setTimeout(() => {
      setIsBlocked(false);
      setCountdown(0);
      localStorage.setItem(type, '0');
    }, duration * 1000);
  };

  //외부에서 호출할 블록 시작 함수
  const startBlock = () => {
    if (isBlocked) return;

    setTimeout(() => {
      setIsBlocked(true);
      startCountdown(blockDuration / 1000);
    }, delay);
  };

  return { isBlocked, countdown, startBlock };
};

export default useBlockTimer;
