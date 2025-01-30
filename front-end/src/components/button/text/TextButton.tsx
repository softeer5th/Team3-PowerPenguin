import S from './TextButton.module.css';

type TextButtonProps = {
  style: CSSModuleClasses;
  text: string;
  isActive?: boolean;
  onClick: () => void;
};

const TextButton = ({
  style,
  text,
  onClick,
  isActive = true,
}: TextButtonProps) => {
  return (
    <button
      className={`${S.textButton} ${style}`}
      disabled={!isActive}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
