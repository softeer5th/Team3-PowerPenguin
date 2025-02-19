import S from './StudentCourse.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import LayoutTab from './components/LayoutTab';
import { useEffect, useRef, useState } from 'react';
import StudentRequest from './request/StudentRequest';
import { useParams } from 'react-router';
import StudentReact from './react/StudentReact';
import StudentQuestion from './question/StudentQuestion';

const TAB_OPTIONS = [
  { key: 'request', label: '요청하기' },
  { key: 'react', label: '반응하기' },
  { key: 'question', label: '질문하기' },
];

const StudentCourse = () => {
  const { courseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(TAB_OPTIONS[0].key);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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

  useEffect(() => {
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => {
      window.removeEventListener('resize', updateUnderline);
    };
  }, [selectedTab]);

  return (
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
            <StudentRequest courseId={Number(courseId)} />
          </div>
          <div className={S.tabLayout}>
            <StudentReact courseId={Number(courseId)} />
          </div>
          <div className={S.tabLayout}>
            <StudentQuestion courseId={Number(courseId)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourse;
