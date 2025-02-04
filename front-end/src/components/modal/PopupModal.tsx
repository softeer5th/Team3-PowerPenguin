import S from './PopupModal.module.css';
import LoadingIcon from '../../assets/icons/loading.svg?react';
import WarningIcon from '../../assets/icons/warning.svg?react';

type PopupModalProps = {
  type: 'loading' | 'caution';
  title: string;
  description?: string;
};

function getIcon(type: PopupModalProps['type']) {
  const icon =
    type === 'loading' ? (
      <LoadingIcon width="3.125rem" height="3.125rem" />
    ) : (
      <WarningIcon />
    );
  const color = type === 'loading' ? S.blueIcon : S.redIcon;

  return <div className={color}>{icon}</div>;
}

const PopupModal = ({ type, title, description }: PopupModalProps) => {
  return (
    <div className={S.modal}>
      <div className={S.modalContent}>
        {getIcon(type)}
        <h2 className={S.modalTitle}>{title}</h2>
        {description && <p className={S.modalDescription}>{description}</p>}
      </div>
    </div>
  );
};

export default PopupModal;
