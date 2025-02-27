import React from 'react';
import S from './TextButton.module.css';

type TextButtonProps = {
  type?: 'button' | 'submit';
  color: 'blue' | 'red' | 'green' | 'black' | 'gray' | 'white' | 'inherit';
  size: 'web1' | 'web2' | 'web3' | 'web4' | 'mobile1' | 'mobile2';
  width?: string;
  height?: string;
  text: string;
  isActive?: boolean;
  onClick: (event: React.MouseEvent) => void;
};

function getColorClass(color: string): keyof typeof S {
  switch (color) {
    case 'blue':
      return S.blueButton;
    case 'red':
      return S.redButton;
    case 'green':
      return S.greenButton;
    case 'black':
      return S.blackButton;
    case 'gray':
      return S.grayButton;
    case 'white':
      return S.whiteButton;
    case 'inherit':
      return S.inheritButton;
    default:
      return S.blueButton;
  }
}

function getSizeClass(size: string): keyof typeof S {
  switch (size) {
    case 'web1':
      return S.webButton1;
    case 'web2':
      return S.webButton2;
    case 'web3':
      return S.webButton3;
    case 'web4':
      return S.webButton4;
    case 'mobile1':
      return S.mobileButton1;
    case 'mobile2':
      return S.mobileButton2;
    default:
      return S.webButton1;
  }
}

const TextButton = ({
  type = 'button',
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
      type={type}
      style={{ width: width, height: height }}
      className={`${S.textButton} ${colorClass} ${sizeClass}`}
      disabled={!isActive}
      onClick={(e: React.MouseEvent) => onClick(e)}
    >
      {text}
    </button>
  );
};

export default TextButton;
