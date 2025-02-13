import CheckIcon from '@/assets/icons/check.svg?react';
import S from './CheckButton.module.css';

type CheckButtonProps = {
  onButtonClick: () => void;
  isActive: boolean;
};

const CheckButton = ({ onButtonClick, isActive }: CheckButtonProps) => {
  return (
    <button
      className={`${S.buttonContainer} ${isActive ? S.active : ''}`}
      onClick={onButtonClick}
    >
      <CheckIcon width="13px" height="9px" color="white" />
    </button>
  );
};

export default CheckButton;
