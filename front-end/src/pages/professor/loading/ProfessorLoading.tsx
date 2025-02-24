import useModal from '@/hooks/useModal';
import React, { useEffect, useState } from 'react';
import { classroomRepository, courseRepository } from '@/di';
import ClassStartModal from '@/components/modal/ClassStartModal';
import ProfessorError from '@/pages/professor/professorError';
import { useNavigate } from 'react-router';
import { Course } from '@/core/model';
import Loading from '@/pages/loading/Loading';

const ProfessorLoading = () => {
  const { openModal, closeModal, Modal } = useModal();
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const { popupError, ErrorModal } = ProfessorError();

  const handleClickBackButton = async (courseId: Course['id']) => {
    try {
      await classroomRepository.closeCourse(courseId);
      setModal(null);
      closeModal();
      navigate('/professor');
    } catch (error) {
      popupError(error);
    }
  };

  const handleClickStartButton = (courseId: Course['id']) => {
    setModal(null);
    closeModal();
    navigate(`/professor/course/${courseId}/classroom`);
  };

  useEffect(() => {
    async function fetchOpenedCourse() {
      try {
        const startedCourse = await courseRepository.getOpenedCourse();
        if (startedCourse) {
          setModal(
            <ClassStartModal
              course={startedCourse}
              isStarted={true}
              handleClickBackButton={() =>
                handleClickBackButton(startedCourse.id)
              }
              handleClickStartButton={() =>
                handleClickStartButton(startedCourse.id)
              }
            />
          );
          openModal();
        } else {
          closeModal();
          setModal(null);
        }
      } catch (error) {
        popupError(error);
      }
    }

    fetchOpenedCourse();
  }, []);

  return (
    <>
      <Loading />
      {modal && <Modal>{modal}</Modal>}
      <ErrorModal />
    </>
  );
};

export default ProfessorLoading;
