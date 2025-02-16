import S from './QuestionPage.module.css';

type QuestionPageProps = {
  question: string;
};

const QuestionPage = ({ question }: QuestionPageProps) => {
  return question === '' ? (
    <div className={`${S.page} ${S.noQuestion}`}>
      <p className={S.question}>답변되지 않은 질문이 없습니다.</p>
    </div>
  ) : (
    <div className={S.page}>
      <p className={S.question}>{question}</p>
    </div>
  );
};

export default QuestionPage;
