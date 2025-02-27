import ZoomInIcon from '@/assets/icons/zoom-in.svg?react';
import ZoomOutIcon from '@/assets/icons/zoom-out.svg?react';
import S from './ZoomButton.module.css';

type ZoomButtonProps = {
  onButtonClick: () => void;
  type: 'zoomIn' | 'zoomOut';
  isActive: boolean;
};

const ZoomButton = ({ onButtonClick, type, isActive }: ZoomButtonProps) => {
  return (
    <button
      className={`${S['buttonContainer']} ${isActive ? S['active'] : ''}`}
      onClick={onButtonClick}
    >
      {type === 'zoomIn' && (
        <ZoomInIcon width="20px" height="20px" color="white" />
      )}
      {type === 'zoomOut' && (
        <ZoomOutIcon width="20px" height="20px" color="white" />
      )}
    </button>
  );
};

export default ZoomButton;
