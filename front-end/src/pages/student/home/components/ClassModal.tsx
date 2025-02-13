import S from './ClassModal.module.css';
import CloseSvg from '@/assets/icons/close.svg?react';
import ClockSvg from '@/assets/icons/clock.svg?react';
import PeopleSvg from '@/assets/icons/people.svg?react';
import ClassChip from './ClassChip';

export type ClassModalProps = {
  university: string;
  courseTitle: string;
  coursePeople: string;
  courseDay: string;
  courseNumber: string;
  startTime: string;
  endTime: string;
  courseSort: string;
};

const ClassModal = ({
  classInfo,
  closeModal,
  onCheckClick,
}: {
  classInfo: ClassModalProps;
  closeModal: () => void;
  onCheckClick: () => void;
}) => {
  return (
    <div className={S.modalContainer} onClick={(e) => e.stopPropagation()}>
      <div className={S.modalTitle}>강의 정보를 확인해주세요</div>
      <button onClick={closeModal} className={S.closeButton}>
        <CloseSvg width="100%" height="100%" />
      </button>
      <div className={S.contentContainer}>
        <ClassChip text={classInfo.courseSort} />
        <div className={S.university}>{classInfo.university}</div>
        <div
          className={S.courseTitle}
        >{`${classInfo.courseTitle} (${classInfo.courseNumber})`}</div>
        <div className={S.courseDescBox}>
          <span className={S.courseTime}>
            <ClockSvg className={S.descSvg} />
            {`${classInfo.courseDay} ${classInfo.startTime}-${classInfo.endTime}`}
          </span>
          <span className={S.coursePeople}>
            <PeopleSvg className={S.descSvg} />
            {classInfo.coursePeople}
          </span>
        </div>
      </div>
      <div className={S.buttonContainer}>
        <button onClick={closeModal} className={S.backButton}>
          뒤로가기
        </button>
        <button onClick={onCheckClick} className={S.enterButton}>
          입장하기
        </button>
      </div>
    </div>
  );
};

export default ClassModal;
