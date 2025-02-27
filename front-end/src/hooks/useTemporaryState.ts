import { useEffect, useState, useRef } from 'react';

type useTemporaryStateProps = {
  storageKey?: string;
  duration: number;
};

const useTemporaryState = ({
  storageKey,
  duration,
}: useTemporaryStateProps) => {
  // storageKey가 있으면 localStorage 사용, 아니면 0으로 초기화
  const storedCountdown = storageKey
    ? Number(localStorage.getItem(storageKey)) || 0
    : 0;
  const initialCountdown = storedCountdown > 0 ? storedCountdown : 0;

  const [isActive, setIsActive] = useState(initialCountdown > 0);
  const [countdown, setCountdown] = useState(initialCountdown);

  const countdownTimeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  //storageKey가 있으면 localStorage에 값이 있으면 countdown 시작
  useEffect(() => {
    if (storageKey && initialCountdown > 0) {
      setIsActive(true);
      startCountdown(initialCountdown);
    }

    return () => {
      if (countdownTimeoutRef.current) {
        clearInterval(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
    };
  }, [storageKey, duration]);

  //countdown이 바뀔때 localstorage에 저장
  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, countdown.toString());
  }, [countdown, storageKey]);

  // 카운트 다운 함수
  const startCountdown = (timeLeft: number) => {
    startTimeRef.current = Date.now(); // 카운트 다운 할때 현재 시간
    setCountdown(timeLeft);

    const handleCount = () => {
      if (!startTimeRef.current) return;

      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      ); // 경과시간

      //남은시간-경과시간 으로 음수가 될경우 대비하여 max 사용
      const remainingTime = Math.max(timeLeft - elapsedTime, 0);
      setCountdown(remainingTime);

      //다음 interval에 보정값 적용
      if (remainingTime > 0) {
        const nextInterval =
          1000 - ((Date.now() - startTimeRef.current) % 1000);
        countdownTimeoutRef.current = setTimeout(handleCount, nextInterval);
      } else {
        setIsActive(false);
        if (storageKey) localStorage.setItem(storageKey, '0');
      }
    };
    handleCount();
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
