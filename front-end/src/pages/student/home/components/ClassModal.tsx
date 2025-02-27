import S from './ClassModal.module.css';
import CloseSvg from '@/assets/icons/close.svg?react';
import ClockSvg from '@/assets/icons/clock.svg?react';
import PeopleSvg from '@/assets/icons/people.svg?react';
import ClassChip from './ClassChip';

export type ClassModalProps = {
  university: string;
  courseTitle: string;
  coursePeople: number;
  courseDay?: string;
  courseNumber: string;
  startTime?: string;
  endTime?: string;
  courseSort: string;
  closeModal: () => void;
  onCheckClick: () => void;
};

const ClassModal = ({
  university,
  courseTitle,
  coursePeople,
  courseDay,
  courseNumber,
  startTime,
  endTime,
  courseSort,
  closeModal,
  onCheckClick,
}: ClassModalProps) => {
  return (
    <div className={S.modalContainer} onClick={(e) => e.stopPropagation()}>
      <div className={S.modalTitle}>강의 정보를 확인해주세요</div>
      <button onClick={closeModal} className={S.closeButton}>
        <CloseSvg width="100%" height="100%" />
      </button>
      <div className={S.contentContainer}>
        <ClassChip text={courseSort} />
        <div className={S.university}>{university}</div>
        <div
          className={S.courseTitle}
        >{`${courseTitle} (${courseNumber})`}</div>
        <div className={S.courseDescBox}>
          <span className={S.courseTime}>
            <ClockSvg className={S.descSvg} />
            {`${courseDay} ${startTime}-${endTime}`}
          </span>
          <span className={S.coursePeople}>
            <PeopleSvg className={S.descSvg} />
            {coursePeople}명
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
