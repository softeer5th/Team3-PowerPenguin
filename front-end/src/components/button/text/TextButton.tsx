import S from './TextButton.module.css';

type TextButtonProps = {
  color: 'blue' | 'red' | 'green' | 'black' | 'white' | 'inherit';
  size: 'web1' | 'web2' | 'web3' | 'web4' | 'mobile1' | 'mobile2';
  text: string;
  isActive?: boolean;
  onClick: () => void;
};

const TextButton = ({
  color,
  size,
  text,
  onClick,
  isActive = true,
}: TextButtonProps): JSX.Element => {
  let colorClass, sizeClass;
  switch (color) {
    case 'blue':
      colorClass = S.blueButton;
      break;
    case 'red':
      colorClass = S.redButton;
      break;
    case 'green':
      colorClass = S.greenButton;
      break;
    case 'black':
      colorClass = S.blackButton;
      break;
    case 'white':
      colorClass = S.whiteButton;
      break;
    case 'inherit':
      colorClass = S.inheritButton;
  }

  switch (size) {
    case 'web1':
      sizeClass = S.webButton1;
      break;
    case 'web2':
      sizeClass = S.webButton2;
      break;
    case 'web3':
      sizeClass = S.webButton3;
      break;
    case 'web4':
      sizeClass = S.webButton4;
      break;
    case 'mobile1':
      sizeClass = S.mobileButton1;
      break;
    case 'mobile2':
      sizeClass = S.mobileButton2;
  }

  return (
    <button
      className={`${S.textButton} ${colorClass} ${sizeClass}`}
      disabled={!isActive}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
