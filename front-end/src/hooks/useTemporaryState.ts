import { useEffect, useState, useRef } from 'react';

type useTemporaryStateProps = {
  type?: string;
  duration: number;
  persist: boolean;
};

const useTemporaryState = ({
  type,
  duration,
  persist = false,
}: useTemporaryStateProps) => {
  // persist가 true면 localStorage 사용, 아니면 0으로 초기화
  const storedCountdown =
    persist && type ? Number(localStorage.getItem(type)) || 0 : 0;
  const initialCountdown = storedCountdown > 0 ? storedCountdown : 0;

  const [isActive, setIsActive] = useState(initialCountdown > 0);
  const [countdown, setCountdown] = useState(initialCountdown);

  const countdownIntervalRef = useRef<number | null>(null);

  // persist가 true이고 localStorage에 값이 있으면 countdown 시작
  useEffect(() => {
    if (persist && type && initialCountdown > 0) {
      setIsActive(true);
      startCountdown(initialCountdown);
    }

    return () => {
      clearInterval(countdownIntervalRef.current!);
    };
  }, [type, duration, persist]);

  // 카운트 다운 함수
  const startCountdown = (duration: number) => {
    setCountdown(duration);
    if (persist && type) localStorage.setItem(type, duration.toString());

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          if (persist && type) {
            localStorage.setItem(type, '0');
            setIsActive(false);
          }
          return 0;
        }
        const newCountdown = prev - 1;
        if (persist && type)
          localStorage.setItem(type, newCountdown.toString());
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
