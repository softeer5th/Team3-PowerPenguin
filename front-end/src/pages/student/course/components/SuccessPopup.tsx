import { useEffect } from 'react';
import S from './SuccessPopup.module.css';

type SuccessPopupProps = {
  text: string;
  onClose: () => void;
};

const SuccessPopup = ({ text, onClose }: SuccessPopupProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={S.popupContainer}>{text}</div>;
};

export default SuccessPopup;
