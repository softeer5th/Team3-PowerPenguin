import React from 'react';
import { useNavigate } from 'react-router';
import { CourseMeta } from '@/core/model';
import AlertModal from '../components/modal/AlertModal';
import CourseModal from '../pages/professor/home/modal/CourseModal';
import FileUploadPopupModal from '../components/modal/FileUploadPopupModal';
import ClassStartModal from '../components/modal/ClassStartModal';
import { courseRepository } from '@/di';

type UseCourseActionsProps = {
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
  openModal: () => void;
  closeModal: () => void;
};

const fileSuccessModal = (
  courseId: string,
  file: File,
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>,
  offModal: () => void
) => {
  setModal(
    <AlertModal
      type="success"
      message="파일이 성공적으로 업로드되었습니다."
      buttonText="확인"
      onClickCloseButton={() => {
        offModal();
      }}
      onClickModalButton={async () => {
        try {
          offModal();
          console.log('Save file:', file);
          await courseRepository.uploadCourseFile(courseId, file);
        } catch (error) {
          console.error('Failed to upload file:', error);
        }
      }}
    />
  );
};

const useCourseActions = ({
  setModal,
  openModal,
  closeModal,
}: UseCourseActionsProps) => {
  const offModal = () => {
    setModal(null);
    closeModal();
  };
  const navigate = useNavigate();

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
            console.error('Failed to delete course:', error);
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
            console.error('Failed to update course:', error);
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
      if (course?.fileURL) {
        setModal(
          <AlertModal
            type="caution"
            message="새 파일을 저장하시겠습니까?"
            description="이미 저장된 강의자료가 있습니다. 삭제하고 새 파일을 저장하시겠습니까?"
            buttonText="새 파일 저장"
            onClickModalButton={() => {
              fileSuccessModal(course.id.toString(), file, setModal, offModal);
            }}
            onClickCloseButton={() => {
              offModal();
            }}
          />
        );
      } else {
        fileSuccessModal(course.id.toString(), file, setModal, offModal);
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

export default useCourseActions;
