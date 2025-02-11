import { useEffect, useState } from 'react';
import S from './TimeInput.module.css';

type TimeInputProps = {
  time: string;
  setTime: (value: string) => void;
};

const TimeInput = ({ time, setTime }: TimeInputProps) => {
  const [hour, minute] = time.split(':');

  const [localHour, setLocalHour] = useState(hour);
  const [localMinute, setLocalMinute] = useState(minute);

  useEffect(() => {
    setLocalHour(hour);
    setLocalMinute(minute);
  }, [hour, minute]);

  return (
    <div className={S.timeInputContainer}>
      <input
        type="text"
        className={S.timeInput}
        value={localHour}
        onChange={(e) => {
          const currentHour = e.target.value;
          if (!/^\d*$/.test(currentHour)) {
            return;
          }
          setLocalHour(e.target.value);
        }}
        onBlur={(e) => {
          const hour = e.target.value;
          if (parseInt(hour) > 23) {
            setTime(`23:${minute}`);
          } else {
            setTime(
              `${parseInt(e.target.value).toString().padStart(2, '0')}:${minute}`
            );
          }
        }}
      />
      <span className={S.timeDivider}>:</span>
      <input
        type="text"
        className={S.timeInput}
        value={localMinute}
        onChange={(e) => {
          const currentMinute = e.target.value;
          if (!/^\d*$/.test(currentMinute)) {
            return;
          }
          setLocalMinute(e.target.value);
        }}
        onBlur={(e) => {
          const minute = e.target.value;
          if (parseInt(minute) > 59) {
            setTime(`${hour}:59`);
          } else {
            setTime(
              `${hour}:${parseInt(e.target.value).toString().padStart(2, '0')}`
            );
          }
        }}
      />
    </div>
  );
};

export default TimeInput;
