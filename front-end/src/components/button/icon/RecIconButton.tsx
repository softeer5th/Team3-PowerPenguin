import SettingIcon from '@/assets/icons/setting.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';
import S from './RecIconButton.module.css';

type RecIconButtonProps = {
  onButtonClick: () => void;
  type: 'setting' | 'trash';
  bg: 'red' | 'gray';
};

const RecIconButton = ({ onButtonClick, type, bg }: RecIconButtonProps) => {
  const bgClass = S[bg] || '';
  return (
    <button
      className={`${S.buttonContainer} ${bgClass}`}
      onClick={onButtonClick}
    >
      {type === 'setting' && <SettingIcon />}
      {type === 'trash' && <TrashIcon />}
    </button>
  );
};

export default RecIconButton;
