import S from './AlertModal.module.css';
import TextButton from '../button/text/TextButton';
import CloseIcon from '@/assets/icons/close.svg?react';
import WarningIcon from '@/assets/icons/warning.svg?react';
import CheckIcon from '@/assets/icons/modal-check.svg?react';
import QuestionIcon from '@/assets/icons/question-mark.svg?react';

type AlertModalProps = {
  type: 'caution' | 'success' | 'ask';
  message: string;
  description?: string;
  buttonText: string;
  onClickModalButton: () => void;
  onClickCloseButton: () => void;
};

function getIcon(type: 'caution' | 'success' | 'ask') {
  let icon = null;
  if (type === 'caution') {
    icon = <WarningIcon width="2.4375rem" height="2.1875rem" />;
  } else if (type === 'success') {
    icon = <CheckIcon width="2.875rem" height="2.875rem" />;
  } else if (type === 'ask') {
    icon = <QuestionIcon width="2.5rem" height="2.5rem" />;
  }

  const color = type === 'caution' ? S.redIcon : S.blueIcon;

  return <div className={color}>{icon}</div>;
}

const AlertModal = ({
  type,
  message,
  description,
  buttonText,
  onClickModalButton,
  onClickCloseButton,
}: AlertModalProps) => {
  return (
    <div className={S.modal} onClick={(e) => e.stopPropagation()}>
      <button className={S.closeButton} onClick={onClickCloseButton}>
        <CloseIcon
          width="1.1875rem"
          height="1.1875rem"
          color="var(--gray-600)"
        />
      </button>
      <div className={S.modalContent}>
        {getIcon(type)}
        <div className={S.modalBody}>
          <div className={S.modalText}>
            <span className={S.modalTitle}>{message}</span>
            {description && <p className={S.modalDescription}>{description}</p>}
          </div>
          <div className={S.modalButton}>
            <TextButton
              color={type === 'caution' ? 'red' : 'blue'}
              size="web4"
              height="3.75rem"
              text={buttonText}
              onClick={onClickModalButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
