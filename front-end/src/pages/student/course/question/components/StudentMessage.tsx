import S from './StudentMessage.module.css';
import CheckSvg from '@/assets/icons/check.svg?react';
import { useState } from 'react';

type StudentMessageProps = {
  message: string;
  time: string;
  deleteQuestion: () => void;
  onMessageClick: () => void;
};

const StudentMessage = ({
  message,
  time,
  onMessageClick,
  deleteQuestion,
}: StudentMessageProps) => {
  const [isCheck, setIsCheck] = useState(false);

  const handleCheckButton = () => {
    onMessageClick();
    setIsCheck(true);
  };

  return (
    <div
      className={`${S.messageContainer}  ${isCheck ? S.active : ''}`}
      onAnimationEnd={deleteQuestion}
    >
      <div className={S.messageBox}>
        <div className={S.messageContent}>{message}</div>
        <button
          onClick={handleCheckButton}
          className={`${S.buttonSvg} ${isCheck ? S.checkButton : ''}`}
          disabled={isCheck}
        >
          <CheckSvg className={S.checkSvg} />
        </button>
      </div>
      <div className={S.time}>{time}</div>
    </div>
  );
};

export default StudentMessage;
