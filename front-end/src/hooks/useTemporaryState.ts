import { useEffect, useState, useRef } from 'react';

type useTemporaryStateProps = {
  storageKey?: string;
  duration: number;
  persist: boolean;
};

const useTemporaryState = ({
  storageKey,
  duration,
  persist = false,
}: useTemporaryStateProps) => {
  // persist가 true면 localStorage 사용, 아니면 0으로 초기화
  const storedCountdown =
    persist && storageKey ? Number(localStorage.getItem(storageKey)) || 0 : 0;
  const initialCountdown = storedCountdown > 0 ? storedCountdown : 0;

  const [isActive, setIsActive] = useState(initialCountdown > 0);
  const [countdown, setCountdown] = useState(initialCountdown);

  const countdownIntervalRef = useRef<number | null>(null);

  // persist가 true이고 localStorage에 값이 있으면 countdown 시작
  useEffect(() => {
    if (persist && storageKey && initialCountdown > 0) {
      setIsActive(true);
      startCountdown(initialCountdown);
    }

    return () => {
      clearInterval(countdownIntervalRef.current!);
    };
  }, [storageKey, duration, persist]);

  // 카운트 다운 함수
  const startCountdown = (duration: number) => {
    setCountdown(duration);
    if (persist && storageKey)
      localStorage.setItem(storageKey, duration.toString());

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          if (persist && storageKey) {
            localStorage.setItem(storageKey, '0');
            setIsActive(false);
          }
          return 0;
        }
        const newCountdown = prev - 1;
        if (persist && storageKey)
          localStorage.setItem(storageKey, newCountdown.toString());
        return newCountdown;
      });
    }, 1000);
  };

  // 외부에서 호출할 블록 시작 함수 (즉시 실행)
  const trigger = () => {
    if (isActive) return;
    setIsActive(true);
    startCountdown(duration);
  };

  return { isActive, countdown, trigger };
};

export default useTemporaryState;
