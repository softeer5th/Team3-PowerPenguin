import React from 'react';
import { CourseMeta } from '@/core/model';
import AlertModal from '../components/modal/AlertModal';
import CourseModal from '../pages/professor/home/modal/CourseModal';
import FileUploadPopupModal from '../components/modal/FileUploadPopupModal';
import ClassStartModal from '../components/modal/ClassStartModal';
import { courseRepository } from '@/di';
import ProfessorError from './professorError';
import { NavigateFunction } from 'react-router';

type courseActionsProps = {
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
  openModal: () => void;
  closeModal: () => void;
  navigate: NavigateFunction;
};

const fileSuccessModal = (
  courseId: string,
  file: File,
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>,
  openModal: () => void,
  closeModal: () => void,
  popupError: (error: unknown) => void
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
        try {
          closeModal();
          setModal(null);
          console.log('Save file:', file);
          await courseRepository.uploadCourseFile(courseId, file);
        } catch (error) {
          popupError(error);
        }
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
}: courseActionsProps) => {
  const popupError = ProfessorError({
    setModal,
    openModal,
    closeModal,
    navigate,
  });

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
            console.log('Delete course:', course.id);
            offModal();
            await courseRepository.deleteCourse(course.id);
          } catch (error) {
            popupError(error);
          }
        }}
      />
    );
    openModal();
  };

  const handleEditCourse = (course: CourseMeta) => {
    console.log('Edit course:', course.id);
    setModal(
      <CourseModal
        course={course}
        onClose={() => {
          offModal();
        }}
        onSubmit={async (course) => {
          try {
            console.log('Submit course:', course);
            offModal();
            await courseRepository.updateCourse(course);
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
        handleClickStartButton={() => {
          console.log('Start course:', course.id);
          offModal();
          navigate(`/professor/course/${course.id}/classroom`);
        }}
      />
    );
    openModal();
  };

  const handleDetailCourse = (course: CourseMeta) => {
    console.log('Detail course:', course.id);

    navigate(`/professor/course/${course.id}`);
  };

  const handleFileCourse = (course: CourseMeta) => {
    console.log('File course:', course.id);

    const handleFileSave = (file: File) => {
      if (course?.fileName) {
        setModal(
          <AlertModal
            type="caution"
            message="새 파일을 저장하시겠습니까?"
            description="이미 저장된 강의자료가 있습니다. 삭제하고 새 파일을 저장하시겠습니까?"
            buttonText="새 파일 저장"
            onClickModalButton={() => {
              fileSuccessModal(
                course.id.toString(),
                file,
                setModal,
                openModal,
                closeModal,
                popupError
              );
            }}
            onClickCloseButton={() => {
              offModal();
            }}
          />
        );
      } else {
        fileSuccessModal(
          course.id.toString(),
          file,
          setModal,
          openModal,
          closeModal,
          popupError
        );
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
