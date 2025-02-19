import S from './ProfessorClassroom.module.css';

import {
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react';
import { classroomRepository, courseRepository } from '@/di';
import { useParams } from 'react-router';
import useModal from '@/hooks/useModal';

import {
  Course,
  Question,
  Reaction,
  ReactionType,
  Requests,
} from '@/core/model';
import QuestionModal from './components/question/QuestionModal';
import PDFMainComponent from './components/PDFMainComponent';
import PDFSideBar from './components/PDFSideBar';

export type Action =
  | { type: 'ADD'; payload: Reaction }
  | { type: 'REMOVE'; payload: string };

const initialReactionsCount = () => {
  const storageCounts = localStorage.getItem('reactions');
  return storageCounts
    ? JSON.parse(storageCounts)
    : { clap: 0, cry: 0, like: 0, okay: 0, scream: 0, thumb: 0 };
};

const reactionReducer = (state: ReactionType[], action: Action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: crypto.randomUUID(), type: action.payload }];
    case 'REMOVE':
      return state.filter((reaction) => reaction.id !== action.payload);
    default:
      return state;
  }
};

const ProfessorClassroom = () => {
  const { courseId } = useParams();

  const [modal, setModal] = useState<ReactNode | null>();
  const [reactionsCount, setReactionsCount] = useState<
    Record<Reaction, number>
  >(initialReactionsCount);
  const [isUploading, setIsUploading] = useState(false);
  const [courseInfo, setCourseInfo] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [requests, setRequests] = useState<Requests | []>([]);
  const [reactions, dispatch] = useReducer(reactionReducer, []);

  const isUploadingRef = useRef(false);
  const reactionsRef = useRef(reactionsCount);

  const [isPending, startTransition] = useTransition();

  const { openModal, closeModal, Modal } = useModal();

  // 가장 처음 course 정보 받아오기
  useEffect(() => {
    async function fetchCourse() {
      const course = await courseRepository.getCourseById(Number(courseId));
      setCourseInfo(course);
      setQuestions(course.questions);
    }
    fetchCourse();
  }, [courseId]);

  // questions가 바뀔때마다(모달에서 삭제될때 반영하기 위해) 모달 변경
  useEffect(() => {
    if (modal) {
      setModal(
        <QuestionModal
          questions={questions}
          handleResolveClick={handleResolveClick}
          closeModal={closeModal}
        />
      );
    }
  }, [questions]);

  // SSE에 의존성을 빼기 위해
  useEffect(() => {
    isUploadingRef.current = isUploading;
  }, [isUploading]);

  //예상SSE 연결
  // useEffect(() => {
  //   const eventSource = new EventSource(`sse 주소 `);

  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     if (data.type === 'reaction') {
  //       if (isUploadingRef.current) {
  //         // isUploading이 true일 때는 우선순위를 낮춰서 처리
  //         dispatch({ type: 'ADD', payload: data.payload });
  //         startTransition(() => {
  //           reactionsRef.current = {
  //             ...reactionsRef.current,
  //             [data.payload]: (reactionsRef.current[data.payload] || 0) + 1,
  //           };
  //           setReactionsCount(reactionsRef.current);
  //           localStorage.setItem(
  //             'reactions',
  //             JSON.stringify(reactionsRef.current)
  //           );
  //         });
  //       } else {
  //         // isUploading이 false일 때는 일반 처리
  //         dispatch({ type: 'ADD', payload: data.payload });
  //         reactionsRef.current = {
  //           ...reactionsRef.current,
  //           [data.payload]: (reactionsRef.current[data.payload] || 0) + 1,
  //         };
  //         setReactionsCount(reactionsRef.current);
  //         localStorage.setItem(
  //           'reactions',
  //           JSON.stringify(reactionsRef.current)
  //         );
  //       }
  //     } else if (data.type === 'question') {
  //       setQuestions((prev) => [...prev, data.payload]);
  //     } else if (data.type === 'request') {
  //       setRequests((prev) => [...prev, data.payload]);
  //     }
  //   };

  //   eventSource.onerror = () => {
  //     eventSource.close();
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, [courseId]);

  // 교수 질문 체크
  const handleResolveClick = async (id: Question['id']) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    await classroomRepository.checkQuestionByProfessor(id);

    setQuestions(updatedQuestions);
  };

  //강의 종료
  const handleCloseClass = () => {};

  return (
    <>
      <div className={S.professorClassroom}>
        {courseInfo && (
          <PDFMainComponent
            courseInfo={courseInfo}
            setIsUploading={setIsUploading}
            setModal={setModal}
            courseId={Number(courseId)}
            closeModal={closeModal}
            reactionsCount={reactionsCount}
            reactions={reactions}
            dispatch={dispatch}
            openModal={openModal}
          />
        )}
        <PDFSideBar
          questions={questions}
          requests={requests}
          handleResolveClick={handleResolveClick}
          setModal={setModal}
          openModal={openModal}
          closeModal={closeModal}
          handleCloseClass={handleCloseClass}
        />
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorClassroom;
