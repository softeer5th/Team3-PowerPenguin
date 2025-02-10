import { useEffect, useState, useCallback } from 'react';
import S from './CourseCard.module.css';
import { CourseMeta } from '../../../../core/model';
import CategoryChip from '../../../../components/chip/CategoryChip';
import BarChartIcon from '../../../../assets/icons/barchart.svg?react';
import ClipIcon from '../../../../assets/icons/clip.svg?react';
import ClockIcon from '../../../../assets/icons/clock.svg?react';
import EtcIcon from '../../../../assets/icons/etc.svg?react';
import PeopleIcon from '../../../../assets/icons/people.svg?react';
import TextButton from '../../../../components/button/text/TextButton';

type CourseCardProps = {
  course: CourseMeta;
  size: 'small' | 'medium' | 'large';
  onDeleteCourse: (courseId: number) => void;
  onEditCourse: (courseId: number) => void;
  onStartCourse: (courseId: number) => void;
  onDetailCourse: (courseId: number) => void;
  onFileCourse: (courseId: number) => void;
};

const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
const getDayString = (day: number) => dayMap[day];

const createTargetDate = (time: string): Date => {
  const [targetHour, targetMinute] = time.split(':');
  const target = new Date();
  target.setHours(Number(targetHour), Number(targetMinute), 0, 0);
  return target;
};

const isSoon = (time: string) => {
  const leftTime = createTargetDate(time).getTime() - Date.now();
  return leftTime > 0 && leftTime < 3600000;
};

type TimeType = {
  hour: number;
  minute: number;
  second: number;
};

const formatTime = ({ hour, minute, second }: TimeType) => {
  if (hour < 0) return '00 : 00 : 00';
  if (minute < 0) return '00 : 00 : 00';
  if (second < 0) return '00 : 00 : 00';

  return `${hour.toString().padStart(2, '0')} : ${minute.toString().padStart(2, '0')} : ${second
    .toString()
    .padStart(2, '0')}`;
};

const getCourseColor = (category: string) => {
  switch (category) {
    case '전공':
      return 'purple';
    case '교양':
      return 'green';
    default:
      return 'gray';
  }
};

const renderSchedule = (scheduleList: CourseMeta['schedule']) =>
  scheduleList.map((schedule, index) => (
    <span key={schedule.day}>
      {schedule.day} {schedule.start} - {schedule.end}
      {index < scheduleList.length - 1 && ', '}
    </span>
  ));

type MeatBallMenuProps = {
  popup: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const MeatBallMenu = ({
  popup,
  onToggle,
  onDelete,
  onEdit,
}: MeatBallMenuProps) => (
  <div className={S.meatBallWrapper}>
    <button
      className={`${S.meatBall} ${popup ? S.active : ''}`}
      onClick={onToggle}
    >
      <EtcIcon className={S.meatBallIcon} />
    </button>
    {popup && (
      <div className={S.popup}>
        <button
          className={`${S.popupButton} ${S.popupButtonDelete}`}
          onClick={onDelete}
        >
          <span>이 수업 삭제하기</span>
        </button>
        <button className={S.popupButton} onClick={onEdit}>
          <span>이 수업 편집하기</span>
        </button>
      </div>
    )}
  </div>
);

const renderButtonContainer = (
  width: string,
  height: string,
  onStart: () => void,
  onDetail: () => void,
  onFile: () => void
) => (
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
    </button>
    <button className={S.subButton} onClick={onFile}>
      <ClipIcon className={S.subButtonIcon} />
    </button>
  </div>
);

const useCountdown = (scheduleList: CourseMeta['schedule']): TimeType => {
  const computeLeftTime = useCallback(() => {
    const now = new Date();
    const currentSchedule = scheduleList.find(
      (schedule) => schedule.day === getDayString(now.getDay())
    );
    if (currentSchedule) {
      const target = createTargetDate(currentSchedule.start);
      const diff = target.getTime() - now.getTime();
      return {
        hour: Math.floor(diff / 3600000),
        minute: Math.floor((diff % 3600000) / 60000),
        second: Math.floor((diff % 60000) / 1000),
      };
    }
    return {
      hour: 0,
      minute: 0,
      second: 0,
    };
  }, [scheduleList]);

  const [leftTime, setLeftTime] = useState<TimeType>(computeLeftTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentSchedule = scheduleList.find(
        (schedule) => schedule.day === getDayString(now.getDay())
      );
      if (currentSchedule) {
        const target = createTargetDate(currentSchedule.start);
        const diff = target.getTime() - now.getTime();
        setLeftTime({
          hour: Math.floor(diff / 3600000),
          minute: Math.floor((diff % 3600000) / 60000),
          second: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduleList]);

  return leftTime;
};

const CourseCard = ({
  course,
  size,
  onDeleteCourse,
  onEditCourse,
  onStartCourse,
  onDetailCourse,
  onFileCourse,
}: CourseCardProps) => {
  const [popup, setPopup] = useState(false);
  const leftTime = useCountdown(course.schedule);
  const today = new Date();
  const todaySchedule = course.schedule.find(
    (schedule) => schedule.day === getDayString(today.getDay())
  );

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
              todaySchedule && isSoon(todaySchedule.start) ? S.soon : ''
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
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course.id)}
        onEdit={() => onEditCourse(course.id)}
      />
    </div>
  );

  const renderMedium = () => (
    <div className={S.medium}>
      <MeatBallMenu
        popup={popup}
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course.id)}
        onEdit={() => onEditCourse(course.id)}
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
                  {renderSchedule(course.schedule)}
                </span>
              </div>
              <div className={S.metaItem}>
                <PeopleIcon className={S.metaIcon} />
                <span className={S.metaText}>{course.capacity}</span>
              </div>
            </div>
          </div>
          {renderButtonContainer(
            '239px',
            '56px',
            () => onStartCourse(course.id),
            () => onDetailCourse(course.id),
            () => onFileCourse(course.id)
          )}
        </div>
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
        onToggle={handleTogglePopup}
        onDelete={() => onDeleteCourse(course.id)}
        onEdit={() => onEditCourse(course.id)}
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
              {todaySchedule && isSoon(todaySchedule.start)
                ? `${leftTimeString} 후 시작`
                : '00 : 00 : 00 후 시작'}
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
                  {renderSchedule(course.schedule)}
                </span>
              </div>
              <div className={S.metaItem}>
                <PeopleIcon className={S.metaIcon} />
                <span className={S.metaText}>{course.capacity}</span>
              </div>
            </div>
          </div>
          {renderButtonContainer(
            '345px',
            '61px',
            () => onStartCourse(course.id),
            () => onDetailCourse(course.id),
            () => onFileCourse(course.id)
          )}
        </div>
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
