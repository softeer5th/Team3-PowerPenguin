import S from './MeatBallMenu.module.css';
import EtcIcon from '@/assets/icons/etc.svg?react';

type MeatBallMenuProps = {
  popup: boolean;
  size: 'small' | 'medium' | 'large';
  onBlur: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const MeatBallMenu = ({
  popup,
  size,
  onBlur,
  onToggle,
  onDelete,
  onEdit,
}: MeatBallMenuProps) => {
  return (
    <div
      className={`${S.meatBallWrapper} ${S[size]}`}
      tabIndex={0}
      onBlur={onBlur}
    >
      <button
        className={`${S.meatBall} ${popup ? S.active : ''}`}
        onClick={onToggle}
      >
        <EtcIcon className={S.meatBallIcon} />
      </button>
      {popup && (
        <div className={S.popup}>
          <button
            className={`${S.popupButton} ${S.popupButtonDelete}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onDelete}
          >
            <span>이 수업 삭제하기</span>
          </button>
          <button
            className={S.popupButton}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onEdit}
          >
            <span>이 수업 편집하기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MeatBallMenu;
