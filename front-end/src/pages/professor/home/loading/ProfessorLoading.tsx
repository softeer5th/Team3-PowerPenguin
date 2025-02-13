import S from './ProfessorLoading.module.css';
import LoadingIcon from '@/assets/icons/loading.svg?react';
import useModal from '@/hooks/useModal';
import React, { useEffect, useState } from 'react';
import { courseRepository } from '@/di';
import ClassStartModal from '@/components/modal/ClassStartModal';

const ProfessorLoading = () => {
  const { openModal, closeModal, Modal } = useModal();
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  const handleClickBackButton = () => {
    setModal(null);
    closeModal();
  };

  const handleClickStartButton = () => {
    setModal(null);
    closeModal();
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
              handleClickStartButton={handleClickStartButton}
            />
          );
          openModal();
        } else {
          closeModal();
        }
      } catch (error) {
        console.error(error);
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
