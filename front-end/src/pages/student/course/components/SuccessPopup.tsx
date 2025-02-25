import S from './SuccessPopup.module.css';

type SuccessPopupProps = {
  text: string;
};

const SuccessPopup = ({ text }: SuccessPopupProps) => {
  return <div className={S.popupContainer}>{text}</div>;
};

export default SuccessPopup;
