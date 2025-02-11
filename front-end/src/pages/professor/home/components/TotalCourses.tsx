import { CourseMeta } from '../../../../core/model';
import S from './TotalCourses.module.css';
import usePagination from '../../../../hooks/usePagination';
import { createCourseGroup } from '../../../../utils/util';
import CourseCard from './CourseCard';
import PaginationButton from '../../../../components/button/icon/PaginationButton';

type TotalCoursesProps = {
  filteredCourses: CourseMeta[];
  handleDetailCourse: (courseId: number) => void;
  handleFileCourse: (courseId: number) => void;
  handleStartCourse: (courseId: number) => void;
  handleEditCourse: (courseId: number) => void;
  handleDeleteCourse: (courseId: number) => void;
};

function TotalCourses({
  filteredCourses,
  handleDetailCourse,
  handleFileCourse,
  handleStartCourse,
  handleEditCourse,
  handleDeleteCourse,
}: TotalCoursesProps) {
  const { prevPage, nextPage, page, totalPages, PaginationDiv } =
    usePagination();

  return (
    <div className={S.courseListContainer}>
      {filteredCourses.length > 0 ? (
        <PaginationDiv>
          {(() => {
            const groups = createCourseGroup(filteredCourses, 6);
            return groups.map((group, idx) => (
              <div key={idx} className={S.courseGrid}>
                {group.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    size="medium"
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
      ) : (
        <div className={S.courseListInner}>
          <span className={S.noCourseText}>아직 아무 수업도 없어요</span>
        </div>
      )}
      <div className={S.courseListController}>
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

export default TotalCourses;
