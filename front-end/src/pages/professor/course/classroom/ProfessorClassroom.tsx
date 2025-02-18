import usePDF from '@/hooks/usePDF';
import S from './ProfessorClassroom.module.css';
import PDFViewer from './components/PDFViewer';
import {
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  classroomRepository,
  courseRepository,
  professorRepository,
} from '@/di';
import { useParams } from 'react-router';
import ZoomButton from '@/components/button/icon/ZoomButton';
import ExpandSvg from '@/assets/icons/expansion.svg?react';
import useModal from '@/hooks/useModal';
import AccessCodeModal from './components/AccessCodeModal';
import EmojiCounter from './components/reaction/EmojiCounter';
import {
  Course,
  Question,
  Reaction,
  ReactionType,
  Requests,
} from '@/core/model';
import { v4 as uuidv4 } from 'uuid';
import QuestionBoard from './components/question/QuestionBoard';
import QuestionModal from './components/question/QuestionModal';
import RequestBox from './components/RequestBox';

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
      return [...state, { id: uuidv4(), type: action.payload }];
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
  const [pdf, setPDF] = useState<File | string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [requests, setRequests] = useState<Requests | []>([]);
  const [reactions, dispatch] = useReducer(reactionReducer, []);

  const isUploadingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactionsRef = useRef(reactionsCount);

  const {
    scale,
    loadPdf,
    zoomIn,
    zoomOut,
    handleArrowKey,
    containerRef,
    canvasRef,
  } = usePDF();
  const [isPending, startTransition] = useTransition();

  const { openModal, closeModal, Modal } = useModal();

  // 가장 처음 course 정보 받아오기
  useEffect(() => {
    async function fetchCourse() {
      const course = await courseRepository.getCourseById(courseId);
      setCourseInfo(course);
      setQuestions(course.questions);
    }
    fetchCourse();
  }, []);

  // 처음 저장된 pdf 받아오기
  useEffect(() => {
    async function fetchPDF() {
      const pdfUrl = await professorRepository.getProfessorPDF(courseId);
      // setPDF(pdfUrl);
      // loadPdf(pdfUrl);
    }
    fetchPDF();
  }, [courseId, courseInfo]);

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

  const handleExpandCode = (accessCode: number) => {
    setModal(<AccessCodeModal accessCode={accessCode} onClose={closeModal} />);
    openModal();
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      setIsUploading(true);

      await loadPdf(files[0]);
      setPDF(files[0]);
      // 해당강의의 pdf가 변경되었다는것을 알려야함
      setIsUploading(false);
    }
  }

  const handleFileOpen = () => {
    fileInputRef.current?.click();
  };

  const handleQuestionModalOpen = (page: number) => {
    setModal(
      <QuestionModal
        questions={questions}
        handleResolveClick={handleResolveClick}
        closeModal={closeModal}
        initialPage={page}
      />
    );
    openModal();
  };

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
        <div className={S.mainContainer}>
          <div className={S.mainHeader}>
            <div className={S.accessCodeContainer}>
              <div className={S.accessCode}>
                입장코드 {courseInfo?.accessCode}
              </div>
              <button
                className={S.expandCode}
                onClick={() =>
                  courseInfo?.accessCode &&
                  handleExpandCode(courseInfo?.accessCode)
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
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorClassroom;
