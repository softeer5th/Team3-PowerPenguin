import S from './StudentCourse.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import LayoutTab from './components/LayoutTab';
import { useEffect, useRef, useState } from 'react';
import StudentRequest from './request/StudentRequest';
import StudentReact from './react/StudentReact';
import StudentQuestion from './question/StudentQuestion';
import useModal from '@/hooks/useModal';
import { getStudentPopup, PopupType } from '@/utils/studentPopupUtils';
import { useNavigate } from 'react-router';

const TAB_OPTIONS = [
  { key: 'request', label: '요청하기' },
  { key: 'react', label: '반응하기' },
  { key: 'question', label: '질문하기' },
];

const StudentCourse = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(TAB_OPTIONS[0].key);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [modalType, setModalType] = useState<PopupType | null>(null);

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const { openModal, closeModal, Modal } = useModal();

  useEffect(() => {
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => {
      window.removeEventListener('resize', updateUnderline);
    };
  }, [selectedTab]);

  // useEffect(() => {
  //   const eventSource = new EventSource('/api/sse/connection/student');

  //   eventSource.onopen = () => {
  //     console.log('🔗 SSE 연결됨');
  //   };

  //   eventSource.onmessage = (event) => {
  //     console.log('📩 받은 데이터:', event.data);
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error('❌ SSE 오류:', error);
  //     eventSource.close();
  //   };

  //   return () => {
  //     console.log('🔌 SSE 연결 종료');
  //     eventSource.close();
  //   };
  // }, []);

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
          'notfound',
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
          <Logo className={S.logo} />
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
