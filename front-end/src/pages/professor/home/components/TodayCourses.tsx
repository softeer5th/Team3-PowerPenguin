import S from './TodayCourses.module.css';
import { CourseMeta } from '@/core/model';
import CourseCard from './CourseCard';
import usePagination from '@/hooks/usePagination';
import {
  createCourseGroup,
  createTargetDate,
  getDayString,
  todayString,
} from '@/utils/util';
import PaginationButton from '@/components/button/icon/PaginationButton';
import useCountdown from '@/hooks/useCountDown';
import { useEffect, useState } from 'react';

type TodayCoursesProps = {
  todayCourses: CourseMeta[];
  onDetailCourse: (course: CourseMeta) => void;
  onFileCourse: (course: CourseMeta) => void;
  onStartCourse: (course: CourseMeta) => void;
  onEditCourse: (course: CourseMeta) => void;
  onDeleteCourse: (course: CourseMeta) => void;
};

const isCoursePassed = (course: CourseMeta) => {
  const now = new Date();
  const currentSchedule = course.schedule.find(
    (schedule) => schedule.day === getDayString(now.getDay())
  );
  if (!currentSchedule) return true;
  const target = createTargetDate(currentSchedule.start);
  return target.getTime() < now.getTime();
};

function TodayCourses({
  todayCourses,
  onDetailCourse,
  onFileCourse,
  onStartCourse,
  onEditCourse,
  onDeleteCourse,
}: TodayCoursesProps) {
  const { prevPage, nextPage, page, totalPages, PaginationDiv } =
    usePagination();

  const [largeCourseIndex, setLargeCourseIndex] = useState(0);

  const leftTime = useCountdown(todayCourses[largeCourseIndex]?.schedule);

  useEffect(() => {
    if (todayCourses.length === 0) return;

    const currentCourse = todayCourses[largeCourseIndex];
    if (currentCourse && isCoursePassed(currentCourse)) {
      setLargeCourseIndex(largeCourseIndex + 1);
    }
  }, [leftTime, todayCourses, largeCourseIndex]);

  const renderCourses = () => {
    const restCourses = todayCourses
      .slice(largeCourseIndex + 1)
      .concat(todayCourses.slice(0, largeCourseIndex));
    const groups = createCourseGroup(restCourses, 3);
    return groups.map((group, idx) => (
      <div key={idx} className={S.courseRow}>
        {group.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            size="small"
            onDetailCourse={onDetailCourse}
            onFileCourse={onFileCourse}
            onStartCourse={onStartCourse}
            onEditCourse={onEditCourse}
            onDeleteCourse={onDeleteCourse}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className={S.todayCourse}>
      <div className={S.left}>
        <h1 className={S.title}>
          오늘 수업은 <span>{todayCourses.length}개</span> 있어요!
        </h1>
        {largeCourseIndex < todayCourses.length ? (
          <CourseCard
            course={todayCourses[largeCourseIndex]}
            size="large"
            leftTime={leftTime}
            onDeleteCourse={onDeleteCourse}
            onEditCourse={onEditCourse}
            onStartCourse={onStartCourse}
            onDetailCourse={onDetailCourse}
            onFileCourse={onFileCourse}
          />
        ) : (
          <div className={S.noLargeCourse}>
            <span>오늘 수업이 없어요!</span>
          </div>
        )}
      </div>
      <div className={S.todayCourseList}>
        <h2 className={S.title}>{todayString()}</h2>
        <PaginationDiv containerStyle={{ width: '608px' }}>
          {renderCourses()}
        </PaginationDiv>
        <div className={S.todayCourseController}>
          <PaginationButton
            onButtonClick={prevPage}
            type="prev"
            isActive={page > 0}
          />
          <div className={S.page}>
            <span>{page + 1}</span> / {Math.max(totalPages, 1)}
          </div>
          <PaginationButton
            onButtonClick={nextPage}
            type="next"
            isActive={page < totalPages - 1}
          />
        </div>
      </div>
    </div>
  );
}

export default TodayCourses;
