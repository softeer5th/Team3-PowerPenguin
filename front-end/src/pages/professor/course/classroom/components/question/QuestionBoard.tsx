import S from './QuestionBoard.module.css';

import { Question } from '@/core/model';
import usePagination from '@/hooks/usePagination';
import PrevIcon from '@/assets/icons/back-vector.svg?react';
import NextIcon from '@/assets/icons/next-vector.svg?react';
import QuestionCard from './QuestionCard';

type QuestionBoardProps = {
  questions: Question[];
  handleResolveClick: (id: Question['id']) => void;
  handleModalOpen: (page: number) => void;
};

const QuestionBoard = ({
  questions,
  handleResolveClick,
  handleModalOpen,
}: QuestionBoardProps) => {
  const { prevPage, nextPage, PaginationDiv, page, totalPages } =
    usePagination();

  return (
    <div className={S.boardContainer}>
      <div className={S.questionController}>
        <button
          className={S.buttonContainer}
          onClick={prevPage}
          disabled={page === 0}
        >
          <PrevIcon className={S.icon} />
        </button>
        <div className={S.page}>
          <span className={S.currentPage}>{page + 1}</span> /{' '}
          {Math.max(totalPages, 1)}
        </div>
        <button
          className={S.buttonContainer}
          onClick={nextPage}
          disabled={page >= totalPages - 1}
        >
          <NextIcon className={S.icon} />
        </button>
      </div>
      {questions.length === 0 ? (
        <div className={S.noQuestion}>아직 아무 질문도 없어요!</div>
      ) : (
        <div className={S.shadowContainer}>
          {questions.length >= 2 && <div className={S.firstShadow} />}
          {questions.length >= 3 && <div className={S.secondShadow} />}
          <PaginationDiv>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                onModalOpen={() => handleModalOpen(page)}
                onResolveClick={() => handleResolveClick(question.id)}
                question={question.content}
              />
            ))}
          </PaginationDiv>
        </div>
      )}

      {questions.length === 0 ? (
        <div className={S.noQuestionDesc}>아직 아무 질문도 없어요!</div>
      ) : (
        <div
          className={S.countContainer}
          style={{ marginTop: `${18 + Math.min(totalPages - 1, 2) * 10}px` }}
        >
          질문이 <span className={S.questionCount}>{totalPages}개</span>{' '}
          기다리고 있어요!
        </div>
      )}
    </div>
  );
};

export default QuestionBoard;
