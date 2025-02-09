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
};

function getDayString(day: number) {
  switch (day) {
    case 0:
      return '일';
    case 1:
      return '월';
    case 2:
      return '화';
    case 3:
      return '수';
    case 4:
      return '목';
    case 5:
      return '금';
    case 6:
      return '토';
  }
}

function getTimeLeft(time: string) {
  const now = new Date();
  const [targetHour, targetMinute] = time.split(':');
  const target = new Date();
  target.setHours(Number(targetHour));
  target.setMinutes(Number(targetMinute));
  target.setSeconds(0);
  target.setMilliseconds(0);

  const diff = target.getTime() - now.getTime();
  const hour = Math.floor(diff / 3600000);
  const minute = Math.floor((diff % 3600000) / 60000);
  const second = Math.floor((diff % 60000) / 1000);

  return `${hour.toString().padStart(2, '0')} : ${minute.toString().padStart(2, '0')} : ${second.toString().padStart(2, '0')}`;
}

function isSoon(time: string) {
  const now = new Date();
  const [targetHour, targetMinute] = time.split(':');
  const target = new Date();
  target.setHours(Number(targetHour));
  target.setMinutes(Number(targetMinute));
  target.setSeconds(0);
  target.setMilliseconds(0);

  return target.getTime() - now.getTime() < 3600000;
}

function getCourseColor(category: string) {
  switch (category) {
    case '전공':
      return 'purple';
    case '교양':
      return 'green';
    default:
      return 'gray';
  }
}

const CourseCard = ({ course, size = 'medium' }: CourseCardProps) => {
  const todaySchedule = course.schedule.find(
    (schedule) => schedule.day === getDayString(new Date().getDay())
  );

  function handleClickCourseStart() {
    console.log('수업 시작');
  }

  function handleClickCourseDetail() {
    console.log('수업 상세');
  }

  function handleClickCourseFile() {
    console.log('수업 자료');
  }

  switch (size) {
    case 'small':
      return (
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
                  {course.name + course.name} ({course.code})
                </h3>
                <span className={S.capacity}>{course.capacity}</span>
              </div>
            </div>
            <button className={S.meatBall}>
              <EtcIcon className={S.meatBallIcon} />
            </button>
          </div>
        </div>
      );
    case 'medium':
      return (
        <div className={S.medium}>
          <button className={S.meatBall}>
            <EtcIcon className={S.meatBallIcon} />
          </button>
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
                          {schedule.day} {schedule.start} - {schedule.end}
                          {index < course.schedule.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className={S.metaItem}>
                    <PeopleIcon className={S.metaIcon} />
                    <span className={S.metaText}>{course.capacity}</span>
                  </div>
                </div>
              </div>
              <div className={S.buttonContainer}>
                <TextButton
                  width="239px"
                  height="56px"
                  text="수업 시작"
                  color="blue"
                  size="web3"
                  onClick={handleClickCourseStart}
                  isActive
                />
                <button
                  className={S.subButton}
                  onClick={handleClickCourseDetail}
                >
                  <BarChartIcon className={S.subButtonIcon} />
                </button>
                <button className={S.subButton} onClick={handleClickCourseFile}>
                  <ClipIcon className={S.subButtonIcon} />
                </button>
              </div>
            </div>
          </div>
          <div className={S.footer}>
            <span className={S.footerText}>
              입장코드 <strong>{course.accessCode}</strong>
            </span>
          </div>
        </div>
      );
    case 'large':
      return (
        <div className={S.large}>
          <button className={S.meatBall}>
            <EtcIcon className={S.meatBallIcon} />
          </button>
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
                    ? `${getTimeLeft(todaySchedule.start)} 후 시작`
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
                      {course.schedule.map((schedule, index) => (
                        <span key={schedule.day}>
                          {schedule.day} {schedule.start} - {schedule.end}
                          {index < course.schedule.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className={S.metaItem}>
                    <PeopleIcon className={S.metaIcon} />
                    <span className={S.metaText}>{course.capacity}</span>
                  </div>
                </div>
              </div>
              <div className={S.buttonContainer}>
                <TextButton
                  width="345px"
                  height="61px"
                  text="수업 시작"
                  color="blue"
                  size="web3"
                  onClick={handleClickCourseStart}
                  isActive
                />
                <button
                  className={S.subButton}
                  onClick={handleClickCourseDetail}
                >
                  <BarChartIcon className={S.subButtonIcon} />
                </button>
                <button className={S.subButton} onClick={handleClickCourseFile}>
                  <ClipIcon className={S.subButtonIcon} />
                </button>
              </div>
            </div>
          </div>
          <div className={S.footer}>
            <span className={S.footerText}>
              입장코드 <strong>{course.accessCode}</strong>
            </span>
          </div>
        </div>
      );
  }
};

export default CourseCard;
