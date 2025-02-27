import S from './AccessCodeModal.module.css';
import LiveIcon from '@/assets/icons/live.svg?react';
import CloseIcon from '@/assets/icons/close.svg?react';

type AccessCodeModalProps = {
  accessCode: number;
  onClose: () => void;
};

const AccessCodeModal = ({ accessCode, onClose }: AccessCodeModalProps) => {
  return (
    <div className={S.modal}>
      <button className={S.closeButton} onClick={onClose}>
        <CloseIcon className={S.closeIcon} />
      </button>
      <div className={S.content}>
        <LiveIcon className={S.liveIcon} />
        <div className={S.accessCode}>
          <span>입장코드 : {accessCode}</span>
        </div>
        <span className={S.description}>
          학생들은 웹에서 서비스에 접속 후,
          <br />
          로그인 없이 코드를 입력하면 참여가 가능해요
        </span>
      </div>
    </div>
  );
};

export default AccessCodeModal;
