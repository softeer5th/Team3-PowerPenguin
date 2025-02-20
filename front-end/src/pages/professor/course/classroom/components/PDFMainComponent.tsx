import S from './PDFMainComponent.module.css';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ZoomButton from '@/components/button/icon/ZoomButton';
import EmojiCounter from './reaction/EmojiCounter';
import PDFViewer from './PDFViewer';
import ExpandSvg from '@/assets/icons/expansion.svg?react';
import usePDF from '@/hooks/usePDF';
import AccessCodeModal from './AccessCodeModal';
import { Course, Reaction, ReactionType } from '@/core/model';
import { courseRepository } from '@/di';
import { Action } from '../ProfessorClassroom';

type PDFMainComponentProps = {
  courseInfo: Course | null;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ReactNode>>;
  closeModal: () => void;
  openModal: () => void;
  reactions: ReactionType[];
  reactionsCount: Record<Reaction, number>;
  dispatch: React.Dispatch<Action>;
  popupError: (error: unknown) => void;
};

const PDFMainComponent = ({
  courseInfo,
  setIsUploading,
  setModal,
  closeModal,
  openModal,
  reactions,
  reactionsCount,
  dispatch,
  popupError,
}: PDFMainComponentProps) => {
  const {
    scale,
    loadPdf,
    zoomIn,
    zoomOut,
    handleArrowKey,
    containerRef,
    canvasRef,
  } = usePDF();

  const [pdf, setPDF] = useState<File | string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchPDF() {
      try {
        if (!courseInfo) {
          return;
        }
        const pdfUrl = await courseRepository.getCourseFileUrl(courseInfo.id);
        if (!pdfUrl) {
          return;
        }
        setPDF(pdfUrl);
        loadPdf(pdfUrl);
      } catch (error) {
        popupError(error);
      }
    }
    fetchPDF();
  }, [courseInfo]);

  const handleCloseModal = () => {
    closeModal();
    setModal(null);
  };

  const handleExpandCode = (accessCode: number) => {
    setModal(
      <AccessCodeModal accessCode={accessCode} onClose={handleCloseModal} />
    );
    openModal();
  };

  const handleFileOpen = () => {
    fileInputRef.current?.click();
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      try {
        setIsUploading(true);
        await loadPdf(files[0]);
        setPDF(files[0]);
        // 해당강의의 pdf가 변경되었다는것을 알려야함
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        popupError(error);
      }
    }
  }

  return (
    <div className={S.mainContainer}>
      <div className={S.mainHeader}>
        <div className={S.accessCodeContainer}>
          <div className={S.accessCode}>입장코드 {courseInfo?.accessCode}</div>
          <button
            className={S.expandCode}
            onClick={() =>
              courseInfo?.accessCode && handleExpandCode(courseInfo?.accessCode)
            }
          >
            <ExpandSvg className={S.expandSvg} />
          </button>
        </div>
        <div className={S.buttonContainer}>
          <ZoomButton
            onButtonClick={zoomOut}
            type="zoomOut"
            isActive={!!pdf && !(scale === 1)}
          />
          <ZoomButton
            onButtonClick={zoomIn}
            type="zoomIn"
            isActive={!!pdf && !(scale === 3)}
          />
        </div>
      </div>
      {pdf ? (
        <PDFViewer
          containerRef={containerRef}
          canvasRef={canvasRef}
          handleArrowKey={handleArrowKey}
        />
      ) : (
        <div className={S.noPdfContainer}>
          <div className={S.noPdfDesc}>업로드 된 강의자료가 없습니다.</div>
          <button className={S.fileButton} onClick={handleFileOpen}>
            강의자료 열기
          </button>
        </div>
      )}
      <div className={S.mainFooter}>
        <button
          className={S.fileButton}
          onClick={handleFileOpen}
          style={{ visibility: pdf ? 'visible' : 'hidden' }}
        >
          다른 강의자료 열기
        </button>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className={S.fileInput}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <EmojiCounter
          emojiCounts={reactionsCount}
          reactions={reactions}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};

export default PDFMainComponent;
