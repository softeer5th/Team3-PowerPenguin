import S from './TodayCourses.module.css';
import { CourseMeta } from '../../../../core/model';
import CourseCard from './CourseCard';
import usePagination from '../../../../hooks/usePagination';
import { createCourseGroup, todayString } from '../../../../utils/util';
import PaginationButton from '../../../../components/button/icon/PaginationButton';

type TodayCoursesProps = {
  todayCourses: CourseMeta[];
  handleDetailCourse: (courseId: number) => void;
  handleFileCourse: (courseId: number) => void;
  handleStartCourse: (courseId: number) => void;
  handleEditCourse: (courseId: number) => void;
  handleDeleteCourse: (courseId: number) => void;
};

function TodayCourses({
  todayCourses,
  handleDetailCourse,
  handleFileCourse,
  handleStartCourse,
  handleEditCourse,
  handleDeleteCourse,
}: TodayCoursesProps) {
  const { prevPage, nextPage, page, totalPages, PaginationDiv } =
    usePagination();

  return (
    <div className={S.todayCourseList}>
      <h2 className={S.title}>{todayString()}</h2>
      <PaginationDiv containerStyle={{ width: '608px' }}>
        {(() => {
          const restCourses = todayCourses.slice(1);
          const groups = createCourseGroup(restCourses, 3);
          return groups.map((group, idx) => (
            <div key={idx} className={S.courseRow}>
              {group.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  size="small"
                  onDetailCourse={handleDetailCourse}
                  onFileCourse={handleFileCourse}
                  onStartCourse={handleStartCourse}
                  onEditCourse={handleEditCourse}
                  onDeleteCourse={handleDeleteCourse}
                />
              ))}
            </div>
          ));
        })()}
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
  );
}

export default TodayCourses;
