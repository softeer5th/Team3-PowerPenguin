import PopupModal from './PopupModal';

const FileOpenFailPopup = () => {
  return (
    <PopupModal
      type="caution"
      title="파일 열기에 실패했습니다"
      description="다시 시도해 주세요"
    />
  );
};

export default FileOpenFailPopup;
