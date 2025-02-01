import S from './TextButton.module.css';

type ClassCloseButtonProps = {
  onClick: () => void;
};

const ClassCloseButton = ({ onClick }: ClassCloseButtonProps) => {
  return (
    <button className={S.classCloseButton} onClick={onClick}>
      수업 끝내기
    </button>
  );
};

export default ClassCloseButton;
