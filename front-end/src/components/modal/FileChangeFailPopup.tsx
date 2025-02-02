import PopupModal from './PopupModal';

const FileChangeFailPopup = () => {
  return (
    <PopupModal
      type="caution"
      title="파일 변경에 실패했습니다"
      description="다른 파일을 선택해 주세요"
    />
  );
};

export default FileChangeFailPopup;
