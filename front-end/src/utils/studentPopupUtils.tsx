import { ClientError, ServerError } from '@/core/errorType';
import StudentPopup from '@/pages/student/components/StudentPopup';

interface PopupConfig {
  title: string;
  content: string;
}

const popupConfigs: Record<string, PopupConfig> = {
  notFound: {
    title: '존재하지 않는 코드입니다',
    content: '다시 한번 코드를 확인해주세요',
  },
  notStart: {
    title: '아직 수업이 시작하지 않았습니다',
    content: '잠시만 기다려주세요',
  },
  closedCourse: {
    title: '교수님이 강의를 종료하셨어요',
    content: '확인을 누르시면 처음화면으로 돌아갑니다',
  },
  server: {
    title: '서버에 오류가 발생했습니다',
    content: '다시 한번 시도해주세요',
  },
  unknown: {
    title: '알 수 없는 오류입니다',
    content: '다시 한번 시도해주세요',
  },
  sse: {
    title: '서버에 오류가 발생했습니다',
    content: '홈 화면으로 돌아갑니다',
  },
};

export type PopupType = keyof typeof popupConfigs;

export const getStudentPopup = (
  type: PopupType,
  closeModal: () => void,
  checkModal: () => void
) => {
  const config = popupConfigs[type];
  if (!config) return null;

  return (
    <StudentPopup
      closeModal={closeModal}
      checkModal={checkModal}
      title={config.title}
      content={config.content}
    />
  );
};

type handleStudentError = {
  error: unknown;
  setModalType: React.Dispatch<React.SetStateAction<string | null>>;
  openModal: () => void;
};

export const handleStudentError = ({
  error,
  setModalType,
  openModal,
}: handleStudentError) => {
  if (error instanceof ClientError) {
    if (error.errorCode === 'COURSE_NOT_FOUND') {
      setModalType('notFound');
      openModal();
    } else if (error.errorCode === 'COURSE_NOT_ACTIVE') {
      setModalType('notStart');
      openModal();
    } else {
      setModalType('unknown');
      openModal();
    }
  } else if (error instanceof ServerError) {
    setModalType('server');
    openModal();
  } else {
    setModalType('unknown');
    openModal();
  }
};
