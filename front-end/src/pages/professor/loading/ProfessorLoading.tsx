import S from './ProfessorLoading.module.css';
import LoadingIcon from '@/assets/icons/loading.svg?react';
import useModal from '@/hooks/useModal';
import React, { useEffect, useState } from 'react';
import { courseRepository } from '@/di';
import ClassStartModal from '@/components/modal/ClassStartModal';
import ProfessorError from '@/utils/professorError';
import { useNavigate } from 'react-router';
import { Course } from '@/core/model';

const ProfessorLoading = () => {
  const { openModal, closeModal, Modal } = useModal();
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const popupError = ProfessorError({
    setModal,
    openModal,
    closeModal,
    navigate,
  });

  const handleClickBackButton = () => {
    setModal(null);
    closeModal();
    navigate('/professor');
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
              handleClickBackButton={handleClickBackButton}
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
      <div className={S.loading}>
        <div className={S.loadingContainer}>
          <LoadingIcon className={S.loadingIcon} />
          <div className={S.loadingText}>Loading...</div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorLoading;
