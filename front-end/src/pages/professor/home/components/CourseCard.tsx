import { useState, useCallback } from 'react';
import S from './CourseCard.module.css';
import { CourseMeta } from '@/core/model';
import CategoryChip from '@/components/chip/CategoryChip';
import BarChartIcon from '@/assets/icons/barchart.svg?react';
import ClipIcon from '@/assets/icons/clip.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import PeopleIcon from '@/assets/icons/people.svg?react';
import TextButton from '@/components/button/text/TextButton';
import {
  getDayString,
  formatTime,
  isSoon,
  getCourseColor,
  TimeType,
  formatSchedule,
} from '@/utils/util';
import MeatBallMenu from './MeatBallMenu';

type CourseCardProps = {
  course: CourseMeta;
  size: 'small' | 'medium' | 'large';
  leftTime?: TimeType;
  onDeleteCourse: (course: CourseMeta) => void;
  onEditCourse: (course: CourseMeta) => void;
  onStartCourse: (course: CourseMeta) => void;
  onDetailCourse: (course: CourseMeta) => void;
  onFileCourse: (course: CourseMeta) => void;
};

const RenderButtonContainer = (
  width: string,
  height: string,
  onStart: () => void,
  onDetail: () => void,
  onFile: () => void
) => {
  return (
    <div className={S.buttonContainer}>
      <TextButton
        width={width}
        height={height}
        text="수업 시작"
        color="blue"
        size="web3"
        onClick={onStart}
        isActive
      />
      <button className={S.subButton} onClick={onDetail}>
        <BarChartIcon className={S.subButtonIcon} />
        <div className={S.subButtonPopup}>
          <span>지난 수업 통계를 볼 수 있어요</span>
        </div>
      </button>
      <button className={S.subButton} onClick={onFile}>
        <ClipIcon className={S.subButtonIcon} />
        <div className={S.subButtonPopup}>
          <span>
            미리 강의자료를 첨부하면,
            <br />
            수업 시작 후 자동으로 파일이 열려요
          </span>
        </div>
      </button>
    </div>
  );
};

const CourseCard = ({
  course,
  size,
  leftTime,
  onDeleteCourse,
  onEditCourse,
  onStartCourse,
  onDetailCourse,
  onFileCourse,
}: CourseCardProps) => {
  const [popup, setPopup] = useState(false);
  const today = new Date();
  const todayString = `${today.getHours().toString().padStart(2, '0')}:${today
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  const todaySchedule = course.schedule.find(
    (schedule) => schedule.day === getDayString(today.getDay())
  );

  const handleBlur = useCallback(() => {
    setPopup(false);
  }, []);

  const handleTogglePopup = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  const leftTimeString = formatTime(leftTime);

  const renderSmall = () => (
    <div className={S.small}>
      <div className={S.content}>
        <div className={S.info}>
          <span
            className={`${S.time} ${
              todaySchedule && todaySchedule.start > todayString && S.soon
            }`}
          >
            {todaySchedule
              ? isSoon(todaySchedule.start)
                ? '곧 시작'
                : todaySchedule.start
              : '없음'}
          </span>
          <span className={S.type}>
            <CategoryChip
              color={getCourseColor(course.classType)}
              text={course.classType}
              isActive
            />
          </span>
          <div className={S.text}>
            <h3 className={S.title}>
              {course.name} ({course.code})
            </h3>
            <span className={S.capacity}>{course.capacity}</span>
          </div>
        </div>
      </div>
      <MeatBallMenu
        popup={popup}
        size="small"
        onBlur={handleBlur}
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course)}
        onEdit={() => onEditCourse(course)}
      />
    </div>
  );

  const renderMedium = () => (
    <div className={S.medium}>
      <MeatBallMenu
        popup={popup}
        size="medium"
        onBlur={handleBlur}
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course)}
        onEdit={() => onEditCourse(course)}
      />
      <div className={S.content}>
        <div className={S.info}>
          <div className={S.type}>
            <CategoryChip
              color={getCourseColor(course.classType)}
              text={course.classType}
              isActive
            />
          </div>
          <div className={S.text}>
            <div>
              <h4 className={S.university}>{course.university}</h4>
              <h3 className={S.title}>
                {course.name} ({course.code})
              </h3>
            </div>
            <div className={S.meta}>
              <div className={S.metaItem}>
                <ClockIcon className={S.metaIcon} />
                <span className={S.metaText}>
                  {course.schedule.map((schedule, index) => (
                    <span key={schedule.day}>
                      {formatSchedule(
                        schedule,
                        index === course.schedule.length - 1
                      )}
                    </span>
                  ))}
                </span>
              </div>
              <div className={S.metaItem}>
                <PeopleIcon className={S.metaIcon} />
                <span className={S.metaText}>{course.capacity}명</span>
              </div>
            </div>
          </div>
        </div>
        {RenderButtonContainer(
          '239px',
          '56px',
          () => onStartCourse(course),
          () => onDetailCourse(course),
          () => onFileCourse(course)
        )}
      </div>
      <div className={S.footer}>
        <span className={S.footerText}>
          입장코드 <strong>{course.accessCode}</strong>
        </span>
      </div>
    </div>
  );

  const renderLarge = () => (
    <div className={S.large}>
      <MeatBallMenu
        popup={popup}
        size="large"
        onBlur={handleBlur}
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course)}
        onEdit={() => onEditCourse(course)}
      />
      <div className={S.content}>
        <div className={S.info}>
          <div className={S.header}>
            <div className={S.type}>
              <CategoryChip
                color={getCourseColor(course.classType)}
                text={course.classType}
                isActive
              />
            </div>
            <div className={S.time}>
              {leftTime ? `${leftTimeString} 후 시작` : '00 : 00 : 00 후 시작'}
            </div>
          </div>
          <div className={S.text}>
            <div>
              <h4 className={S.university}>{course.university}</h4>
              <h3 className={S.title}>
                {course.name} ({course.code})
              </h3>
            </div>
            <div className={S.meta}>
              <div className={S.metaItem}>
                <ClockIcon className={S.metaIcon} />
                <span className={S.metaText}>
                  {course.schedule.map((schedule, index) => (
                    <span key={schedule.day}>
                      {formatSchedule(
                        schedule,
                        index === course.schedule.length - 1
                      )}
                    </span>
                  ))}
                </span>
              </div>
              <div className={S.metaItem}>
                <PeopleIcon className={S.metaIcon} />
                <span className={S.metaText}>{course.capacity}명</span>
              </div>
            </div>
          </div>
        </div>
        {RenderButtonContainer(
          '345px',
          '61px',
          () => onStartCourse(course),
          () => onDetailCourse(course),
          () => onFileCourse(course)
        )}
      </div>
      <div className={S.footer}>
        <span className={S.footerText}>
          입장코드 <strong>{course.accessCode}</strong>
        </span>
      </div>
    </div>
  );

  switch (size) {
    case 'small':
      return renderSmall();
    case 'medium':
      return renderMedium();
    case 'large':
      return renderLarge();
    default:
      return null;
  }
};

export default CourseCard;
