import S from './TextButton.module.css';

type TextButtonProps = {
  color: 'blue' | 'red' | 'green' | 'black' | 'white' | 'inherit';
  size: 'web1' | 'web2' | 'web3' | 'web4' | 'mobile1' | 'mobile2';
  width?: string;
  height?: string;
  text: string;
  isActive?: boolean;
  onClick: () => void;
};

function getColorClass(color: string): keyof typeof S {
  switch (color) {
    case 'blue':
      return 'blueButton';
    case 'red':
      return 'redButton';
    case 'green':
      return 'greenButton';
    case 'black':
      return 'blackButton';
    case 'white':
      return 'whiteButton';
    case 'inherit':
      return 'inheritButton';
    default:
      return 'blueButton';
  }
}

function getSizeClass(size: string): keyof typeof S {
  switch (size) {
    case 'web1':
      return 'webButton1';
    case 'web2':
      return 'webButton2';
    case 'web3':
      return 'webButton3';
    case 'web4':
      return 'webButton4';
    case 'mobile1':
      return 'mobileButton1';
    case 'mobile2':
      return 'mobileButton2';
    default:
      return 'webButton1';
  }
}

const TextButton = ({
  color,
  size,
  width,
  height,
  text,
  onClick,
  isActive = true,
}: TextButtonProps): JSX.Element => {
  const colorClass = getColorClass(color);
  const sizeClass = getSizeClass(size);

  return (
    <button
      style={{ width: width, height: height }}
      className={`${S.textButton} ${colorClass} ${sizeClass}`}
      disabled={!isActive}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
