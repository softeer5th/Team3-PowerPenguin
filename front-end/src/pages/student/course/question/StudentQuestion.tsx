import { useEffect, useState } from 'react';
import SuccessPopup from '../components/SuccessPopup';
import S from './StudentQuestion.module.css';
import QuestionForm from './components/QuestionForm';
import StudentMessage from './components/StudentMessage';
import { classroomRepository } from '@/di';
import { Question } from '@/core/model';

const StudentQuestion = ({ courseId }: { courseId: number }) => {
  const [successPopup, setSuccessPopup] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const questionList = await classroomRepository.getQuestions();
        setQuestions(questionList);
      } catch (error) {
        console.error('질문 목록을 불러오는 중 오류 발생:', error);
      }
    }
    fetchQuestions();
  }, []);

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      try {
        const { id, time, content } = await classroomRepository.sendQuestion(
          courseId,
          inputValue
        );
        const newQuestion = {
          id,
          content,
          time,
        };
        setQuestions((prev) => [...prev, newQuestion]);
        setInputValue('');
        setSuccessPopup(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMessageClick = async (questionId: Question['id']) => {
    try {
      await classroomRepository.checkQuestionByStudent(questionId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuestion = (id: Question['id']) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  return (
    <>
      {questions.length === 0 ? (
        <div className={S.pageLayout}>
          <div className={S.contentContainer}>
            <div className={S.questionTitle}>
              언제든 편리하게
              <span className={S.titleStrong}> 익명</span>으로 질문하세요
            </div>
            <div className={S.questionDesc}>
              답 해주시지 않는다면 피드백 이모지를 활용해보세요
            </div>
          </div>
          <QuestionForm
            inputValue={inputValue}
            setInputValue={setInputValue}
            onInputSubmit={handleInputSubmit}
            placeholder="완전 익명으로 안심하고 질문해보세요"
          />
        </div>
      ) : (
        <div className={S.questionLayout}>
          <div className={S.questionContainer}>
            {questions.map((question) => (
              <StudentMessage
                key={question.id}
                deleteQuestion={() => deleteQuestion(question.id)}
                message={question.content}
                time={question.time}
                onMessageClick={() => handleMessageClick(question.id)}
              />
            ))}
          </div>
          <QuestionForm
            inputValue={inputValue}
            setInputValue={setInputValue}
            onInputSubmit={handleInputSubmit}
            placeholder="완전 익명으로 안심하고 질문해보세요"
          />
          {successPopup && (
            <SuccessPopup
              text="전송 성공! 답변을 듣고 난 후 질문 체크 잊지마세요!"
              onClose={() => setSuccessPopup(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StudentQuestion;
