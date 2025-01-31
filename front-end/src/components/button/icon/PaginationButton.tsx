import PrevIcon from '../../../assets/icons/back-vector.svg?react';
import NextIcon from '../../../assets/icons/next-vector.svg?react';
import S from './PaginationButton.module.css';

type PaginationButtonProps = {
  onButtonClick: () => void;
  type: 'next' | 'prev';
  isActive: boolean;
};

const PaginationButton = ({
  onButtonClick,
  type,
  isActive,
}: PaginationButtonProps) => {
  return (
    <button className={`${S.buttonContainer}  `} onClick={onButtonClick}>
      {type === 'prev' && (
        <PrevIcon
          width="7px"
          height="14px"
          fill="none"
          color={`${isActive ? 'var(--gray-500)' : 'var(--gray-300)'}`}
        />
      )}
      {type === 'next' && (
        <NextIcon
          width="7px"
          height="14px"
          fill="none"
          color={`${isActive ? 'var(--gray-500)' : 'var(--gray-300)'}`}
        />
      )}
    </button>
  );
};

export default PaginationButton;
