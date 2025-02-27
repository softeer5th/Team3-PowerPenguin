import S from './StudentHome.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import { useState } from 'react';
import useModal from '@/hooks/useModal';
import ClassModal from './components/ClassModal';
import { classroomRepository, courseRepository } from '@/di';
import { CourseSummary } from '@/core/model';
import { getDayString } from '@/utils/util';
import {
  getStudentPopup,
  handleStudentError,
  PopupType,
} from '@/utils/studentPopupUtils';

const StudentHome = () => {
  const [admissionCode, setAdmissionCode] = useState<string>('');
  const [modalType, setModalType] = useState<PopupType | null>(null);
  const [classInfo, setClassInfo] = useState<CourseSummary | null>(null);

  const { openModal, closeModal, Modal } = useModal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue) && inputValue.length < 7) {
      setAdmissionCode(inputValue);
    }
  };

  const handleHomeError = (error: unknown) => {
    handleStudentError({ error, setModalType, openModal });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const course = await courseRepository.getCourseSummary(
        Number(admissionCode)
      );
      setClassInfo(course);
      setModalType('classModal');
      openModal();
    } catch (error) {
      handleHomeError(error);
    }
  };

  const handleCheckClick = async () => {
    try {
      closeModal();
      await classroomRepository.enterCourse(Number(admissionCode));
    } catch (error) {
      handleHomeError(error);
    }
  };

  const renderModal = () => {
    switch (modalType) {
      case 'classModal': {
        if (!classInfo) return null;
        const currentSchedule = classInfo.schedule?.find(
          (schedule) => schedule.day === getDayString(new Date().getDay())
        );
        return (
          <ClassModal
            closeModal={closeModal}
            university={classInfo.university}
            courseTitle={classInfo.name}
            coursePeople={classInfo.capacity}
            courseDay={currentSchedule?.day || classInfo.schedule[0].day}
            courseNumber={classInfo.code}
            startTime={currentSchedule?.start || classInfo.schedule[0].start}
            endTime={currentSchedule?.end || classInfo.schedule[0].end}
            courseSort={classInfo.classType}
            onCheckClick={handleCheckClick}
          />
        );
      }

      case 'notFound':
        return getStudentPopup('notFound', closeModal, closeModal);

      case 'notStart':
        return getStudentPopup('notStart', closeModal, closeModal);

      case 'server':
        return getStudentPopup('server', closeModal, closeModal);

      default:
        return getStudentPopup('unknown', closeModal, closeModal);
    }
  };

  return (
    <>
      {modalType && <Modal>{renderModal()}</Modal>}
      <div className={S.homeLayout}>
        <Logo className={S.logo} />
        <form className={S.classForm} onSubmit={handleFormSubmit}>
          <input
            className={S.classInput}
            type="text"
            value={admissionCode}
            onChange={(e) => handleInputChange(e)}
            placeholder="입장코드를 입력해주세요"
          />
          <button
            type="submit"
            className={S.formButton}
            disabled={!admissionCode}
          >
            입장하기
          </button>
        </form>
      </div>
    </>
  );
};

export default StudentHome;
