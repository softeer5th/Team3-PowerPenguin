import AlertModal from '@/components/modal/AlertModal';
import { ClientError, ServerError } from '@/core/errorType';
import useModal from '@/hooks/useModal';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface ProfessorErrorContentType {
  message: string;
  description: string;
  navigateTo: string | number | null;
}

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
  INVALID_IMAGE_TYPE: {
    message: '이미지 파일만 업로드 가능합니다.',
    description: '.png, .jpeg, .jpg, .webp 파일만 업로드 가능합니다.',
    navigateTo: null,
  },
  INVALID_IMAGE_SIZE: {
    message: '이미지 파일은 5MB 이하만 업로드 가능합니다.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  INVALID_NAME: {
    message: '이름을 입력해주세요.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  INVALID_NAME_LENGTH: {
    message: '이름은 20자 이하로 입력해주세요.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  INVALID_NAME_REGEX: {
    message: '이름은 한글과 영문 대소문자만 입력 가능합니다.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  INVALID_FILE_TYPE: {
    message: '파일 형식이 올바르지 않습니다.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  INVALID_FILE_SIZE: {
    message: '파일 크기가 너무 큽니다.',
    description: '다시 시도해주세요.',
    navigateTo: null,
  },
  SSE_ERROR: {
    message: '서버 연결에 실패했습니다.',
    description: '홈 화면으로 돌아갑니다.',
    navigateTo: '/professor',
  },
};

const ProfessorError = () => {
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const navigate = useNavigate();

  const popupError = (error: unknown) => {
    console.error(error);
    let errorContent = null;
    if (error instanceof ClientError || error instanceof ServerError) {
      errorContent = ProfessorErrorContent[error.errorCode];
    } else if (error instanceof Error && error.message === 'SSE_ERROR') {
      errorContent = ProfessorErrorContent.SSE_ERROR;
    }

    if (!errorContent) {
      if (error instanceof ServerError) {
        setModal(
          <AlertModal
            type="caution"
            message="서버 연결에 실패했습니다."
            description="다시 시도해주세요."
            buttonText="확인"
            onClickModalButton={() => {
              setModal(null);
              closeModal();
            }}
          />
        );
        openModal();
      } else {
        setModal(
          <AlertModal
            type="caution"
            message="알 수 없는 오류가 발생했습니다."
            description="홈 페이지로 돌아갑니다."
            buttonText="확인"
            onClickModalButton={() => {
              setModal(null);
              closeModal();
              navigate('/professor');
            }}
          />
        );
      }
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

  const ErrorModal = () => {
    return modal && <Modal>{modal}</Modal>;
  };
  return { popupError, ErrorModal };
};

export default ProfessorError;
