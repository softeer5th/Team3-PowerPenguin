import React from 'react';
import { CourseMeta } from '../core/model';
import AlertModal from '../components/modal/AlertModal';
import CourseModal from '../pages/professor/home/modal/CourseModal';
import FileUploadPopupModal from '../components/modal/FileUploadPopupModal';

type UseCourseActionsProps = {
  courses: CourseMeta[];
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
  openModal: () => void;
  closeModal: () => void;
};

const fileSuccessModal = (
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
      onClickModalButton={() => {
        offModal();
        console.log('Save file:', file);
      }}
    />
  );
};

const courseActions = ({
  courses,
  setModal,
  openModal,
  closeModal,
}: UseCourseActionsProps) => {
  const offModal = () => {
    setModal(null);
    closeModal();
  };

  const handleDeleteCourse = (courseId: number) => {
    setModal(
      <AlertModal
        type="caution"
        message="강의를 삭제하시겠습니까?"
        description="삭제된 강의는 복구가 불가능합니다. 정말 삭제하시겠습니까?"
        buttonText="삭제"
        onClickCloseButton={() => {
          offModal();
        }}
        onClickModalButton={() => {
          console.log('Delete course:', courseId);
          offModal();
        }}
      />
    );
    openModal();
  };

  const handleEditCourse = (courseId: number) => {
    console.log('Edit course:', courseId);
    setModal(
      <CourseModal
        course={courses.find((course) => course.id === courseId)}
        onClose={() => {
          offModal();
        }}
        onSubmit={(course) => {
          console.log('Submit course:', course);
          offModal();
        }}
      />
    );
    openModal();
  };

  const handleStartCourse = (courseId: number) => {
    console.log('Start course:', courseId);
  };

  const handleDetailCourse = (courseId: number) => {
    console.log('Detail course:', courseId);
  };

  const handleFileCourse = (courseId: number) => {
    console.log('File course:', courseId);

    const course = courses.find((course) => course.id === courseId);
    let handleFileSave;
    if (course?.fileURL) {
      handleFileSave = (file: File) => {
        setModal(
          <AlertModal
            type="caution"
            message="새 파일을 저장하시겠습니까?"
            description="이미 저장된 강의자료가 있습니다. 삭제하고 새 파일을 저장하시겠습니까?"
            buttonText="새 파일 저장"
            onClickModalButton={() => {
              fileSuccessModal(file, setModal, offModal);
            }}
            onClickCloseButton={() => {
              offModal();
            }}
          />
        );
      };
    } else {
      handleFileSave = (file: File) => {
        fileSuccessModal(file, setModal, offModal);
      };
    }

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

  const handleAddCourse = () => {
    console.log('Add course');
    setModal(
      <CourseModal
        onClose={() => {
          offModal();
        }}
        onSubmit={(course) => {
          console.log('Submit course:', course);
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
    handleAddCourse,
  };
};

export default courseActions;
