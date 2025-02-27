import BackIcon from '@/assets/icons/arrow-back.svg?react';
import S from './CircleBackButton.module.css';

type CircleBackButtonProps = {
  onButtonClick: () => void;
};

const CircleBackButton = ({ onButtonClick }: CircleBackButtonProps) => {
  return (
    <button className={S['buttonContainer']} onClick={onButtonClick}>
      <BackIcon height="24px" color="var(--gray-500)" />
    </button>
  );
};

export default CircleBackButton;
