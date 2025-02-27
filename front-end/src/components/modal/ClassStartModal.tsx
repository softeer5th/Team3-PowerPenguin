import S from './ClassStartModal.module.css';
import { CourseMeta } from '@/core/model';
import ClockIcon from '@/assets/icons/clock.svg?react';
import PeopleIcon from '@/assets/icons/people.svg?react';
import TextButton from '../button/text/TextButton';
import { formatSchedule } from '@/utils/util';

type ClassStartModalProps = {
  course: CourseMeta;
  isStarted?: boolean;
  handleClickBackButton: () => void;
  handleClickStartButton: () => void;
};

const ClassStartModal = ({
  course,
  isStarted = false,
  handleClickBackButton,
  handleClickStartButton,
}: ClassStartModalProps) => {
  return (
    <div className={S.modal}>
      <div className={S.modalContainer}>
        <h2 className={S.title}>
          {isStarted ? '수업을 계속할까요?' : '오늘의 수업을 시작할까요?'}
        </h2>
        <div className={S.courseInfo}>
          <div className={S.courseInfoText}>
            <span className={S.university}>{course.university}</span>
            <h3 className={S.courseName}>
              {course.name} ({course.code})
            </h3>
          </div>
          <div className={S.wrapper}>
            <div className={S.schedule}>
              <ClockIcon className={S.icon} />
              <span>
                {course.schedule.map((schedule, index) =>
                  formatSchedule(schedule, index === course.schedule.length - 1)
                )}
              </span>
            </div>
            <div className={S.capacity}>
              <PeopleIcon className={S.icon} />
              <span>{course.capacity}명</span>
            </div>
          </div>
        </div>
        <div className={S.buttonContainer}>
          <TextButton
            text="뒤로가기"
            color="white"
            size="web4"
            onClick={handleClickBackButton}
          />
          <TextButton
            text="입장하기"
            color="blue"
            size="web4"
            onClick={handleClickStartButton}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassStartModal;
