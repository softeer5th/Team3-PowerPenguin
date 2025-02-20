import AlertModal from '@/components/modal/AlertModal';
import { ClientError, ServerError } from '@/core/errorType';
import { NavigateFunction } from 'react-router';

interface ProfessorErrorContentType {
  message: string;
  description: string;
  navigateTo: string | number | null;
}

type ProfessorErrorProps = {
  error: unknown;
  setModal: (modal: React.ReactNode | null) => void;
  openModal: () => void;
  closeModal: () => void;
  navigate: NavigateFunction;
};

const ProfessorErrorContent: Record<string, ProfessorErrorContentType> = {
  UNAUTHORIZED_PROFESSOR: {
    message: '사용자 정보를 불러오는 중 오류가 발생했습니다.',
    description: '로그인 페이지로 돌아갑니다.',
    navigateTo: '/login',
  },
  PROFESSOR_NOT_FOUND: {
    message: '사용자 정보를 불러오는 중 오류가 발생했습니다.',
    description: '로그인 페이지로 돌아갑니다.',
    navigateTo: '/professor/login',
  },
  COURSE_NOT_FOUND: {
    message: '강의 정보를 불러오는 중 오류가 발생했습니다.',
    description: '이전 페이지로 돌아갑니다.',
    navigateTo: -1,
  },
  USER_NOT_FOUND: {
    message: '사용자 정보를 불러오는 중 오류가 발생했습니다.',
    description: '로그인 페이지로 돌아갑니다.',
    navigateTo: '/professor/login',
  },
  IMAGE_FILE_SIZE_EXCEEDED: {
    message: '이미지 파일의 크기가 너무 큽니다.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
};

const ProfessorError = ({
  error,
  setModal,
  openModal,
  closeModal,
  navigate,
}: ProfessorErrorProps) => {
  let errorContent = null;
  if (error instanceof ClientError || error instanceof ServerError) {
    errorContent = ProfessorErrorContent[error.errorCode];
  }

  if (!errorContent) {
    setModal(
      <AlertModal
        type="caution"
        message="알 수 없는 오류가 발생했습니다."
        description="이전 페이지로 돌아갑니다."
        buttonText="확인"
        onClickModalButton={() => {
          setModal(null);
          closeModal();
          navigate(-1);
        }}
      />
    );
  } else {
    setModal(
      <AlertModal
        type="caution"
        message={errorContent.message}
        description={errorContent.description}
        buttonText="확인"
        onClickModalButton={() => {
          setModal(null);
          closeModal();

          if (errorContent.navigateTo === null) return;
          if (typeof errorContent.navigateTo === 'number') {
            navigate(errorContent.navigateTo);
          } else {
            navigate(errorContent.navigateTo);
          }
        }}
      />
    );
  }

  openModal();
};

export default ProfessorError;
