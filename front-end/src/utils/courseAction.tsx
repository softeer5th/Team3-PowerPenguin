import React from 'react';
import { CourseMeta } from '@/core/model';
import AlertModal from '../components/modal/AlertModal';
import CourseModal from '../pages/professor/home/modal/CourseModal';
import FileUploadPopupModal from '../components/modal/FileUploadPopupModal';
import ClassStartModal from '../components/modal/ClassStartModal';
import { classroomRepository, courseRepository } from '@/di';
import { NavigateFunction } from 'react-router';

type courseActionsProps = {
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
  openModal: () => void;
  closeModal: () => void;
  navigate: NavigateFunction;
  popupError: (error: unknown) => void;
};

const fileSuccessModal = (
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>,
  openModal: () => void,
  closeModal: () => void
) => {
  setModal(
    <AlertModal
      type="success"
      message="파일이 성공적으로 업로드되었습니다."
      buttonText="확인"
      onClickCloseButton={() => {
        closeModal();
        setModal(null);
      }}
      onClickModalButton={async () => {
        closeModal();
        setModal(null);
      }}
    />
  );

  openModal();
};

const courseActions = ({
  setModal,
  openModal,
  closeModal,
  navigate,
  popupError,
}: courseActionsProps) => {
  const offModal = () => {
    setModal(null);
    closeModal();
  };

  const handleDeleteCourse = (course: CourseMeta) => {
    setModal(
      <AlertModal
        type="caution"
        message="강의를 삭제하시겠습니까?"
        description="삭제된 강의는 복구가 불가능합니다. 정말 삭제하시겠습니까?"
        buttonText="삭제"
        onClickCloseButton={() => {
          offModal();
        }}
        onClickModalButton={async () => {
          try {
            await courseRepository.deleteCourse(course.id);
            offModal();
            setModal(null);
            navigate(0);
          } catch (error) {
            popupError(error);
          }
        }}
      />
    );
    openModal();
  };

  const handleEditCourse = (course: CourseMeta) => {
    setModal(
      <CourseModal
        course={course}
        onClose={() => {
          offModal();
        }}
        onSubmit={async (course) => {
          try {
            await courseRepository.updateCourse(course);
            offModal();
            setModal(null);
            navigate(0);
          } catch (error) {
            popupError(error);
          }
        }}
      />
    );
    openModal();
  };

  const handleStartCourse = (course: CourseMeta) => {
    if (!course) {
      return;
    }
    setModal(
      <ClassStartModal
        course={course}
        handleClickBackButton={offModal}
        handleClickStartButton={async () => {
          try {
            await classroomRepository.startCourse(course.id);
            localStorage.clear();
            offModal();
            navigate(`/professor/course/${course.id}/classroom`);
          } catch (error) {
            popupError(error);
          }
        }}
      />
    );
    openModal();
  };

  const handleDetailCourse = (course: CourseMeta) => {
    navigate(`/professor/course/${course.id}`);
  };

  const handleFileCourse = (course: CourseMeta) => {
    const handleFileSave = async (file: File) => {
      try {
        if (course?.fileName) {
          setModal(
            <AlertModal
              type="caution"
              message="새 파일을 저장하시겠습니까?"
              description="이미 저장된 강의자료가 있습니다. 삭제하고 새 파일을 저장하시겠습니까?"
              buttonText="새 파일 저장"
              onClickModalButton={async () => {
                await courseRepository.uploadCourseFile(course.id, file);
                fileSuccessModal(setModal, openModal, closeModal);
              }}
              onClickCloseButton={() => {
                offModal();
              }}
            />
          );
        } else {
          await courseRepository.uploadCourseFile(course.id, file);
          fileSuccessModal(setModal, openModal, closeModal);
        }
      } catch (error) {
        popupError(error);
      }
    };

    setModal(
      <FileUploadPopupModal
        onClickCloseButton={() => {
          offModal();
        }}
        onClickSaveButton={(file) => {
          handleFileSave(file);
        }}
      />
    );
    openModal();
  };

  return {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleDetailCourse,
    handleFileCourse,
  };
};

export default courseActions;
