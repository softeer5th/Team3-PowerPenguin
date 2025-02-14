import { Question } from '@/core/model';
import S from './CourseQuestion.module.css';
import usePagination from '@/hooks/usePagination';

type CourseQuestionProps = {
  questions: Question[];
};

const CourseQuestion = ({ questions }: CourseQuestionProps) => {
  const { prevPage, nextPage, PaginationDiv, page, totalPage } =
    usePagination();
  return <div>CourseQuestion</div>;
};

export default CourseQuestion;
