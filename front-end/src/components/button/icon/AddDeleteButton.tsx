import PlusIcon from '@/assets/icons/plus.svg?react';
import MinusIcon from '@/assets/icons/minus.svg?react';
import S from './AddDeleteButton.module.css';

type AddDeleteButtonProps = {
  onButtonClick: () => void;
  type: 'plus' | 'minus';
};

const AddDeleteButton = ({ onButtonClick, type }: AddDeleteButtonProps) => {
  const bgClass = S[type] || '';
  return (
    <button
      className={`${S.buttonContainer}  ${bgClass}`}
      onClick={(e) => {
        e.preventDefault();
        onButtonClick();
      }}
    >
      {type === 'plus' && <PlusIcon width="20px" height="20px" />}
      {type === 'minus' && <MinusIcon width="20px" height="20px" />}
    </button>
  );
};

export default AddDeleteButton;
