import { Question } from '@/core/model';
import S from './CourseQuestion.module.css';
import usePagination from '@/hooks/usePagination';
import QuestionPage from './QuestionPage';
import PaginationButton from '@/components/button/icon/PaginationButton';

type CourseQuestionProps = {
  questions: Question[];
};

const CourseQuestion = ({ questions }: CourseQuestionProps) => {
  const { prevPage, nextPage, PaginationDiv, page, totalPages } =
    usePagination();
  return (
    <div className={S.container}>
      <PaginationDiv>
        {questions.length === 0 ? (
          <QuestionPage question="" />
        ) : (
          questions.map((question) => (
            <QuestionPage key={question.id} question={question.content} />
          ))
        )}
      </PaginationDiv>
      <div className={S.page}>
        <PaginationButton
          type="prev"
          onButtonClick={prevPage}
          isActive={page > 0}
        />
        <div className={S.pageNumber}>
          <span className={S.currentPage}>{page + 1}</span> /{' '}
          {Math.max(1, totalPages)}
        </div>
        <PaginationButton
          type="next"
          onButtonClick={nextPage}
          isActive={page < totalPages - 1}
        />
      </div>
    </div>
  );
};

export default CourseQuestion;
