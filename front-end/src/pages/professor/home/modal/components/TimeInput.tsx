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
        onClick={() => setLocalHour('')}
        onChange={(e) => {
          const currentHour = e.target.value;
          if (!/^\d*$/.test(currentHour)) {
            return;
          }
          setLocalHour(e.target.value);
        }}
        onBlur={(e) => {
          const inputHour = e.target.value;
          if (inputHour === '') {
            setLocalHour('00');
            setTime(`00:${localMinute}`);
          } else if (parseInt(inputHour) > 23) {
            setTime(`23:${localMinute}`);
          } else {
            setTime(
              `${parseInt(inputHour).toString().padStart(2, '0')}:${localMinute}`
            );
          }
        }}
      />
      <span className={S.timeDivider}>:</span>
      <input
        type="text"
        className={S.timeInput}
        value={localMinute}
        onClick={() => setLocalMinute('')}
        onChange={(e) => {
          const currentMinute = e.target.value;
          if (!/^\d*$/.test(currentMinute)) {
            return;
          }
          setLocalMinute(e.target.value);
        }}
        onBlur={(e) => {
          const inputMinute = e.target.value;
          if (inputMinute === '') {
            setLocalMinute('00');
            setTime(`${localHour}:00`);
          } else if (parseInt(inputMinute) > 59) {
            setTime(`${localHour}:59`);
          } else {
            setTime(
              `${localHour}:${parseInt(inputMinute).toString().padStart(2, '0')}`
            );
          }
        }}
      />
    </div>
  );
};

export default TimeInput;
