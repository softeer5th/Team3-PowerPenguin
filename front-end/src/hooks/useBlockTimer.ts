import { useEffect, useState, useRef } from 'react';

const useBlockTimer = (
  isSelected: boolean,
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>,
  blockDuration: number,
  delay: number
) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(blockDuration / 1000); // 초기값 설정

  const blockTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSelected) {
      setIsBlocked(false);
      setCountdown(blockDuration / 1000); // 초기값으로 리셋
      return;
    }

    setTimeout(() => {
      setIsBlocked(true);
      setCountdown(blockDuration / 1000);

      //시간 줄이는 기능
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);

      //끝나고 초기화
      blockTimerRef.current = setTimeout(() => {
        setIsSelected(false);
        setIsBlocked(false);
        setCountdown(blockDuration / 1000);
      }, blockDuration);
    }, delay);

    return () => {
      clearTimeout(blockTimerRef.current!);
      clearInterval(countdownIntervalRef.current!);
    };
  }, [isSelected, blockDuration, delay]);

  return { isBlocked, countdown };
};

export default useBlockTimer;
