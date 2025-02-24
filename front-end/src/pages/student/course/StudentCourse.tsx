import S from './StudentCourse.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import LayoutTab from './components/LayoutTab';
import { useEffect, useRef, useState } from 'react';
import StudentRequest from './request/StudentRequest';
import StudentReact from './react/StudentReact';
import StudentQuestion from './question/StudentQuestion';
import useModal from '@/hooks/useModal';
import {
  getStudentPopup,
  handleStudentError,
  PopupType,
} from '@/utils/studentPopupUtils';
import { useNavigate } from 'react-router';
import { Question } from '@/core/model';
import { classroomRepository } from '@/di';

const TAB_OPTIONS = [
  { key: 'request', label: '요청하기' },
  { key: 'react', label: '반응하기' },
  { key: 'question', label: '질문하기' },
];

const API_URL = import.meta.env.VITE_API_URL;

const StudentCourse = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(TAB_OPTIONS[0].key);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalType, setModalType] = useState<PopupType | null>(null);

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  const { openModal, closeModal, Modal } = useModal();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const questionList = await classroomRepository.getQuestions();
        setQuestions(questionList);
      } catch (error) {
        handleStudentError({ error, setModalType, openModal });
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(`${API_URL}/sse/connection/student`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data); // JSON 형식으로 변환

        // messageType에 따라 분기 처리
        switch (parsedData.messageType) {
          case 'QUESTION_CHECK':
            setQuestions((prevQuestions) =>
              prevQuestions.filter((q) => q.id !== parsedData.data.id)
            );
            break;

          case 'COURSE_CLOSED':
            setModalType('closedCourse');
            openModal();
            break;

          default:
            break;
        }
      };

      eventSource.onerror = () => {
        if (eventSource.readyState === EventSource.CONNECTING) {
          return;
        }
        eventSource.close();
        eventSourceRef.current = null;
        setModalType('sse');
        openModal();
      };

      eventSourceRef.current = eventSource;
    };

    connectSSE(); // 최초 연결

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current.onmessage = null;
        eventSourceRef.current.onerror = null;
      }
    };
  }, []);

  useEffect(() => {
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => {
      window.removeEventListener('resize', updateUnderline);
    };
  }, [selectedTab]);

  const selectedIndex = TAB_OPTIONS.findIndex((tab) => tab.key === selectedTab);

  const updateUnderline = () => {
    const activeTab = tabRefs.current[selectedTab];
    if (activeTab) {
      setUnderlineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  };
  const handleErrorModalClick = () => {
    closeModal();
    setModalType(null);
    navigate('/student');
  };

  const renderModal = () => {
    switch (modalType) {
      case 'notFound':
        return getStudentPopup(
          'notFound',
          handleErrorModalClick,
          handleErrorModalClick
        );

      case 'notStart':
        return getStudentPopup(
          'notStart',
          handleErrorModalClick,
          handleErrorModalClick
        );

      case 'server':
        return getStudentPopup(
          'server',
          handleErrorModalClick,
          handleErrorModalClick
        );
      case 'closedCourse':
        return getStudentPopup(
          'closedCourse',
          handleErrorModalClick,
          handleErrorModalClick
        );
      case 'sse':
        return getStudentPopup(
          'sse',
          handleErrorModalClick,
          handleErrorModalClick
        );

      default:
        return getStudentPopup(
          'unknown',
          handleErrorModalClick,
          handleErrorModalClick
        );
    }
  };

  return (
    <>
      <div className={S.courseLayout}>
        <header className={S.headerContainer}>
          <Logo className={S.logo} onClick={() => navigate('/student')} />
          <div className={S.TabsContainer}>
            {TAB_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                ref={(el) => (tabRefs.current[key] = el)}
                className={S.TabButton}
                onClick={() => {
                  setSelectedTab(key);
                }}
              >
                <LayoutTab text={label} isActive={selectedTab === key} />
              </button>
            ))}
            <div
              className={S.underline}
              style={{ left: underlineStyle.left, width: underlineStyle.width }}
            ></div>
          </div>
        </header>
        <div className={S.layoutContainer}>
          <div
            className={S.layoutsWrapper}
            style={{
              transform: `translateX(-${selectedIndex * 33.33}%)`,
            }}
          >
            <div className={S.tabLayout}>
              <StudentRequest
                setModalType={setModalType}
                openModal={openModal}
              />
            </div>
            <div className={S.tabLayout}>
              <StudentReact setModalType={setModalType} openModal={openModal} />
            </div>
            <div className={S.tabLayout}>
              <StudentQuestion
                questions={questions}
                setQuestions={setQuestions}
                setModalType={setModalType}
                openModal={openModal}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal>{renderModal()}</Modal>
    </>
  );
};

export default StudentCourse;
