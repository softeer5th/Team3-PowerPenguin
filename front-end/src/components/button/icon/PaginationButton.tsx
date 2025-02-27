import PrevIcon from '@/assets/icons/back-vector.svg?react';
import NextIcon from '@/assets/icons/next-vector.svg?react';
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
    <button
      className={`${S.buttonContainer}  `}
      onClick={onButtonClick}
      disabled={!isActive}
    >
      {type === 'prev' && <PrevIcon width="7px" height="14px" fill="none" />}
      {type === 'next' && <NextIcon width="7px" height="14px" fill="none" />}
    </button>
  );
};

export default PaginationButton;
