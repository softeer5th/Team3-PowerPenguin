import S from './StudentPopup.module.css';
import CloseSvg from '@/assets/icons/close.svg?react';
import WarnSvg from '@/assets/icons/warning.svg?react';
type StudentPopupProps = {
  title: string;
  content: string;
  closeModal: () => void;
  checkModal: () => void;
};

const StudentPopup = ({
  title,
  content,
  closeModal,
  checkModal,
}: StudentPopupProps) => {
  return (
    <div className={S.popupContainer} onClick={(e) => e.stopPropagation()}>
      <button onClick={closeModal} className={S.closeButton}>
        <CloseSvg width="100%" height="100%" />
      </button>
      <div className={S.warnSvg}>
        <WarnSvg />
      </div>
      <div className={S.popupTitle}>{title}</div>
      <div className={S.popupDesc}>{content}</div>
      <button onClick={checkModal} className={S.checkButton}>
        확인
      </button>
    </div>
  );
};

export default StudentPopup;
