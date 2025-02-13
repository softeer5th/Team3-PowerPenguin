import PlusIcon from '@/assets/icons/plus.svg?react';
import S from './CircleAddButton.module.css';

type CircleAddButtonProps = {
  onButtonClick: () => void;
};

const CircleAddButton = ({ onButtonClick }: CircleAddButtonProps) => {
  return (
    <button className={S['buttonContainer']} onClick={onButtonClick}>
      <PlusIcon color="white" />
    </button>
  );
};

export default CircleAddButton;
