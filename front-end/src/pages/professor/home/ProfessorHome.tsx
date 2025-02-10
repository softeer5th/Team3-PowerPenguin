import S from './ProfessorHome.module.css';
import { courseRepository } from '../../../di';
import { useEffect, useState } from 'react';
import CourseCard from './components/CourseCard';
import { CourseMeta } from '../../../core/model';
import usePagination from '../../../hooks/usePagination';
import RocketIcon from '../../../assets/icons/rocket.svg?react';
import CircleAddButton from '../../../components/button/icon/CircleAddButton';
import FilterDropDown from './components/FilterDropDown';
import PaginationButton from '../../../components/button/icon/PaginationButton';

const CourseDay = ['월', '화', '수', '목', '금', '토', '일'];
const CourseType = ['전공', '교양', '기타'];

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[now.getDay()];
  return `${year}.${month}.${day} (${dayOfWeek})`;
}

function createCourseGroup(courses: CourseMeta[], size: number) {
  const groups: CourseMeta[][] = [];
  for (let i = 0; i < courses.length; i += size) {
    groups.push(courses.slice(i, i + size));
  }
  return groups;
}

const ProfessorHome = () => {
  const [todayCourses, setTodayCourses] = useState<CourseMeta[]>([]);
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');
  const todayPagination = usePagination();
  const totalPagination = usePagination();

  useEffect(() => {
    courseRepository.getHomeCourses().then((courses) => {
      setCourses(courses.totalCourse);
      setTodayCourses(courses.todayCourse);
    });
  }, []);

  const handleDeleteCourse = (courseId: number) => {
    courseRepository.deleteCourse(courseId).then(() => {
      setCourses(courses.filter((course) => course.id !== courseId));
    });
  };

  const handleEditCourse = (courseId: number) => {
    console.log('Edit course:', courseId);
  };

  const handleStartCourse = (courseId: number) => {
    console.log('Start course:', courseId);
  };

  const handleDetailCourse = (courseId: number) => {
    console.log('Detail course:', courseId);
  };

  const handleFileCourse = (courseId: number) => {
    console.log('File course:', courseId);
  };

  return (
    <div className={S.container}>
      <div className={S.header}>
        <div className={S.headerContainer}>
          {todayCourses.length > 0 ? (
            <div className={S.todayCourse}>
              <div className={S.left}>
                <h1 className={S.title}>
                  오늘 수업은 <span>{todayCourses.length}개</span> 있어요!
                </h1>
                <CourseCard
                  course={todayCourses[0]}
                  size="large"
                  onDetailCourse={handleDetailCourse}
                  onFileCourse={handleFileCourse}
                  onStartCourse={handleStartCourse}
                  onEditCourse={handleEditCourse}
                  onDeleteCourse={handleDeleteCourse}
                />
              </div>
              <div className={S.todayCourseList}>
                <h2 className={S.title}>{todayString()}</h2>
                <todayPagination.PaginationDiv
                  containerStyle={{ width: '608px' }}
                >
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
                </todayPagination.PaginationDiv>
                <div className={S.todayCourseController}>
                  <PaginationButton
                    onButtonClick={todayPagination.prevPage}
                    type="prev"
                    isActive={todayPagination.page > 0}
                  />
                  <div className={S.page}>
                    <span>{todayPagination.page + 1}</span> /{' '}
                    {Math.max(todayPagination.totalPages, 1)}
                  </div>
                  <PaginationButton
                    onButtonClick={todayPagination.nextPage}
                    type="next"
                    isActive={
                      todayPagination.page < todayPagination.totalPages - 1
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={S.noTodayCourse}>
              <div className={S.rocket}>
                <RocketIcon className={S.rocketIcon} />
              </div>
              <div className={S.noTodayCourseText}>
                <h1 className={S.title}>
                  수업을 만들고 <span>실시간 소통</span>을 진행해보세요
                </h1>
                <span className={S.description}>
                  하단 + 버튼을 눌러 수업을 생성해보세요
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={S.content}>
        <div className={S.courseAdd}>
          <CircleAddButton onButtonClick={() => console.log('Add course')} />
        </div>
        <div className={S.courseList}>
          <div className={S.courseListHeader}>
            <h2 className={S.title}>수업 리스트</h2>
            <div className={S.dropdownContainer}>
              <FilterDropDown
                title={courseDay}
                options={CourseDay.map((day) => `${day}요일`)}
                setTitle={setCourseDay}
              />
              <FilterDropDown
                title={courseType}
                options={CourseType}
                setTitle={setCourseType}
              />
            </div>
          </div>
          <div className={S.courseListContainer}>
            {courses.length > 0 ? (
              <totalPagination.PaginationDiv>
                {(() => {
                  const groups = createCourseGroup(courses, 6);
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
              </totalPagination.PaginationDiv>
            ) : (
              <div className={S.courseListInner}>
                <span className={S.noCourseText}>아직 아무 수업도 없어요</span>
              </div>
            )}
            <div className={S.courseListController}>
              <PaginationButton
                onButtonClick={totalPagination.prevPage}
                type="prev"
                isActive={totalPagination.page > 0}
              />
              <div className={S.page}>
                <span>{totalPagination.page + 1}</span> /{' '}
                {Math.max(totalPagination.totalPages, 1)}
              </div>
              <PaginationButton
                onButtonClick={totalPagination.nextPage}
                type="next"
                isActive={totalPagination.page < totalPagination.totalPages - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorHome;
