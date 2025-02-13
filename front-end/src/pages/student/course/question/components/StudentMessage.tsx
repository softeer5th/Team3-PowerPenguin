import S from './StudentMessage.module.css';
import CheckSvg from '../../../../../assets/icons/check.svg?react';

type StudentMessageProps = {
  message: string;
  time: string;
  isCheck: boolean;
  onMessageClick: () => void;
};

const StudentMessage = ({
  message,
  time,
  isCheck,
  onMessageClick,
}: StudentMessageProps) => {
  return (
    <div className={S.messageContainer}>
      <div className={S.messageBox}>
        <div className={S.messageContent}>{message}</div>
        <button
          onClick={onMessageClick}
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
