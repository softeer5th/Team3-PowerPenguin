import { useState, useRef } from 'react';

import S from './FileUploadPopupModal.module.css';
import TextButton from '../button/text/TextButton';
import CloseIcon from '@/assets/icons/close.svg?react';
import { validateFile } from '@/utils/util';

type FileUploadPopupModalProps = {
  fileName?: string;
  onClickCloseButton: () => void;
  onClickSaveButton: (file: File | null) => void;
};

const FileUploadPopupModal = ({
  fileName,
  onClickCloseButton,
  onClickSaveButton,
}: FileUploadPopupModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(
    fileName || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      validateFile(files[0]);
      setFile(files[0]);
      setCurrentFileName(files[0].name);
    }
  }

  function handleDeleteFile() {
    setFile(null);
    setCurrentFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function checkIsFileChanged() {
    if (!fileName && !file) return false;
    if (fileName === currentFileName && !file) return false;

    return true;
  }

  return (
    <div className={S.modal} onClick={(e) => e.stopPropagation()}>
      <button className={S.closeButton} onClick={onClickCloseButton}>
        <CloseIcon width="19px" height="19px" color="var(--gray-600)" />
      </button>
      <div className={S.modalContent}>
        <div className={S.modalText}>
          <h1 className={S.modalTitle}>강의 자료 업로드하기</h1>
          <p className={S.modalDescription}>
            강의 자료를 업로드해 놓으면, <br /> 강의 시작 후 수동으로 파일을
            열지 않아도 자동으로 열려요.
          </p>
        </div>
        <div className={S.fileContainer}>
          {currentFileName && (
            <>
              <span className={S.fileInfo}>{currentFileName} </span>
              <button className={S.deleteButton} onClick={handleDeleteFile}>
                <CloseIcon width="16px" height="16px" color="white" />
              </button>
            </>
          )}
        </div>
        <div className={S.buttonContainer}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={S.fileInput}
            ref={fileInputRef}
          />
          <TextButton
            color="white"
            size="web4"
            height="80px"
            text="내 PC에서 업로드하기"
            onClick={() => fileInputRef.current?.click()}
            isActive={true}
          />
          <TextButton
            color="blue"
            size="web4"
            height="80px"
            text="저장하기"
            onClick={() => onClickSaveButton(file)}
            isActive={checkIsFileChanged()}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPopupModal;
