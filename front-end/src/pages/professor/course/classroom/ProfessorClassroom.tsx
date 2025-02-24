import S from './ProfessorClassroom.module.css';

import {
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useNavigate, useParams } from 'react-router';
import { classroomRepository, courseRepository } from '@/di';
import useModal from '@/hooks/useModal';

import {
  Course,
  Question,
  Reaction,
  ReactionType,
  Requests,
  RequestType,
} from '@/core/model';
import QuestionModal from './components/question/QuestionModal';
import PDFMainComponent from './components/PDFMainComponent';
import PDFSideBar from './components/PDFSideBar';
import ProfessorError from '@/pages/professor/professorError';
import ReactionModal from './components/ReactionModal';

const API_URL = import.meta.env.VITE_API_URL;

export type Action =
  | { type: 'ADD'; payload: Reaction }
  | { type: 'REMOVE'; payload: string };

const initialReactionsCount = () => {
  const storageCounts = localStorage.getItem('reactions');
  return storageCounts
    ? JSON.parse(storageCounts)
    : {
        CLAP: 0,
        CRYING: 0,
        HEART_EYES: 0,
        OKAY: 0,
        SURPRISED: 0,
        THUMBS_UP: 0,
      };
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
  const [courseInfo, setCourseInfo] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [requests, setRequests] = useState<Requests | []>([]);
  const [reactions, dispatch] = useReducer(reactionReducer, []);

  const reactionsRef = useRef(reactionsCount);
  const sseRef = useRef<EventSource | null>(null);

  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const { openModal, closeModal, Modal } = useModal();
  const { popupError, ErrorModal } = ProfessorError();

  const handleReaction = (type: Reaction) => {
    startTransition(() => {
      dispatch({ type: 'ADD', payload: type });
      reactionsRef.current = {
        ...reactionsRef.current,
        [type]: (reactionsRef.current[type] || 0) + 1,
      };
      setReactionsCount(reactionsRef.current);
      localStorage.setItem('reactions', JSON.stringify(reactionsRef.current));
    });
  };

  const handleRequest = (request: RequestType) => {
    setRequests(
      (prev) =>
        prev.map((req) =>
          req.type.kind === request ? { ...req, count: req.count + 1 } : req
        ) as Requests
    );
  };

  const handleQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleQuestionCheck = (id: Question['id']) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const connectSSE = () => {
    if (sseRef.current) {
      return;
    }

    const eventSource = new EventSource(
      `${API_URL}/sse/connection/course/${courseId}`,
      {
        withCredentials: true,
      }
    );

    eventSource.onopen = () => {
      sseRef.current = eventSource;
    };

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.messageType === 'REACTION') {
        handleReaction(data.data.type);
      } else if (data.messageType === 'REQUEST') {
        handleRequest(data.data.type);
      } else if (data.messageType === 'QUESTION') {
        handleQuestion(data.data);
      } else if (data.messageType === 'QUESTION_CHECK') {
        handleQuestionCheck(data.data.id);
      } else {
        return;
      }
    };

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        return;
      }

      sseRef.current?.close();
      sseRef.current = null;
      popupError(new Error('SSE_ERROR'));
    };
  };

  // 교수 질문 체크
  const handleResolveClick = async (id: Question['id']) => {
    try {
      await classroomRepository.checkQuestionByProfessor(id);

      setQuestions((prev) => prev.filter((question) => question.id !== id));
    } catch (error) {
      popupError(error);
    }
  };

  //강의 종료
  const handleCloseClass = async () => {
    if (!courseId) {
      return;
    }

    try {
      sseRef.current?.close();
      sseRef.current = null;
      await classroomRepository.closeCourse(courseId);
      const reactionList = Object.entries(reactionsCount)
        .map(([type, count]) => ({
          type: type as Reaction,
          count,
        }))
        .sort((a, b) => b.count - a.count);
      setModal(
        <ReactionModal
          firstReaction={reactionList[0].type}
          firstReactionCount={reactionList[0].count}
          secondReaction={reactionList[1].type}
          secondReactionCount={reactionList[1].count}
          thirdReaction={reactionList[2].type}
          thirdReactionCount={reactionList[2].count}
          onClose={() => {
            closeModal();
            setModal(null);
            navigate('/professor');
          }}
        />
      );
      openModal();
    } catch (error) {
      popupError(error);
    }
  };

  // 가장 처음 course 정보 받아오기
  useEffect(() => {
    async function fetchCourse() {
      try {
        if (!courseId) {
          navigate('/professor');
          return;
        }
        const course = await courseRepository.getCourseById(courseId);
        setCourseInfo(course);
        setQuestions(course.questions);
        setRequests(course.requests);
      } catch (error) {
        popupError(error);
      }
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

  useEffect(() => {
    connectSSE();

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, []);

  return (
    <>
      <div className={S.professorClassroom}>
        <PDFMainComponent
          courseInfo={courseInfo}
          setModal={setModal}
          closeModal={closeModal}
          reactionsCount={reactionsCount}
          reactions={reactions}
          dispatch={dispatch}
          openModal={openModal}
          popupError={popupError}
        />
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
      <ErrorModal />
    </>
  );
};

export default ProfessorClassroom;
