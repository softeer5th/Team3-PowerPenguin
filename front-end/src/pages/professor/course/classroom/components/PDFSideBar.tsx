import { Question, Requests } from '@/core/model';
import S from './PDFSidebar.module.css';
import QuestionBoard from './question/QuestionBoard';
import RequestBox from './RequestBox';
import { ReactNode } from 'react';
import QuestionModal from './question/QuestionModal';

type PDFSideBarProps = {
  questions: Question[];
  requests: Requests | [];
  handleResolveClick: (id: Question['id']) => Promise<void>;
  setModal: React.Dispatch<React.SetStateAction<ReactNode>>;
  closeModal: () => void;
  openModal: () => void;
  handleCloseClass: () => void;
  setCurrentModalQuestion: (page: number) => void;
};

const PDFSideBar = ({
  questions,
  requests,
  handleResolveClick,
  setModal,
  openModal,
  closeModal,
  handleCloseClass,
  setCurrentModalQuestion,
}: PDFSideBarProps) => {
  const handleQuestionModalOpen = (page: number) => {
    const handleCloseModal = () => {
      setCurrentModalQuestion(-1);
      closeModal();
      setModal(null);
    };

    setCurrentModalQuestion(page);

    setModal(
      <QuestionModal
        questions={questions}
        handleResolveClick={handleResolveClick}
        closeModal={handleCloseModal}
        setCurrentModalQuestion={setCurrentModalQuestion}
        initialPage={page}
      />
    );
    openModal();
  };
  return (
    <div className={S.sideBarContainer}>
      <div className={S.sideContentContainer}>
        <QuestionBoard
          questions={questions}
          handleResolveClick={handleResolveClick}
          handleModalOpen={handleQuestionModalOpen}
        />
        <div className={S.requestsContainer}>
          <RequestBox request={requests} />
        </div>
      </div>
      <button className={S.closeButton} onClick={handleCloseClass}>
        수업 끝내기
      </button>
    </div>
  );
};

export default PDFSideBar;
