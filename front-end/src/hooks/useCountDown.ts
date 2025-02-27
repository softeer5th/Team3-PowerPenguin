import { useCallback, useEffect, useState } from 'react';
import { CourseMeta } from '@/core/model';
import { createTargetDate, getDayString, TimeType } from '@/utils/util';

const useCountdown = (scheduleList: CourseMeta['schedule']): TimeType => {
  const computeLeftTime = useCallback(() => {
    if (!scheduleList) {
      return {
        hour: 0,
        minute: 0,
        second: 0,
      };
    }

    const now = new Date();
    const currentSchedule = scheduleList.find(
      (schedule) => schedule.day === getDayString(now.getDay())
    );
    if (currentSchedule) {
      const target = createTargetDate(currentSchedule.start);
      const diff = target.getTime() - now.getTime();
      return {
        hour: Math.floor(diff / 3600000),
        minute: Math.floor((diff % 3600000) / 60000),
        second: Math.floor((diff % 60000) / 1000),
      };
    }
    return {
      hour: 0,
      minute: 0,
      second: 0,
    };
  }, [scheduleList]);

  const [leftTime, setLeftTime] = useState<TimeType>(computeLeftTime());

  useEffect(() => {
    if (!scheduleList) {
      setLeftTime({
        hour: 0,
        minute: 0,
        second: 0,
      });
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentSchedule = scheduleList.find(
        (schedule) => schedule.day === getDayString(now.getDay())
      );
      if (currentSchedule) {
        const target = createTargetDate(currentSchedule.start);
        const diff = target.getTime() - now.getTime();
        setLeftTime({
          hour: Math.floor(diff / 3600000),
          minute: Math.floor((diff % 3600000) / 60000),
          second: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduleList]);

  return leftTime;
};

export default useCountdown;
