import S from './ProfessorHome.module.css';
import { courseRepository } from '../../../di';
import { ReactNode, useEffect, useState } from 'react';
import CourseCard from './components/CourseCard';
import { CourseMeta } from '../../../core/model';
import RocketIcon from '../../../assets/icons/rocket.svg?react';
import CircleAddButton from '../../../components/button/icon/CircleAddButton';
import useModal from '../../../hooks/useModal';
import TodayCourses from './components/TodayCourses';
import TotalCourses from './components/TotalCourses';
import FilterDropDown from './components/FilterDropDown';
import { CourseDay, CourseType } from '../../../utils/util';
import useCourseActions from '../../../hooks/useCourseAction';

const ProfessorHome = () => {
  const [todayCourses, setTodayCourses] = useState<CourseMeta[]>([]);
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');

  const [modal, setModal] = useState<ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleDetailCourse,
    handleFileCourse,
    handleAddCourse,
  } = useCourseActions({ courses, setModal, openModal, closeModal });

  const filteredCourses = courses.filter(
    (course) =>
      (courseDay === '수업 요일' ||
        course.schedule.find(
          (schedule) => schedule.day === courseDay.slice(0, 1)
        )) &&
      (courseType === '수업 종류' || courseType === course.classType)
  );

  useEffect(() => {
    courseRepository.getHomeCourses().then((courses) => {
      setCourses(courses.totalCourse);
      setTodayCourses(courses.todayCourse);
    });
  }, []);

  return (
    <>
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
                <TodayCourses
                  todayCourses={todayCourses}
                  handleDetailCourse={handleDetailCourse}
                  handleFileCourse={handleFileCourse}
                  handleStartCourse={handleStartCourse}
                  handleEditCourse={handleEditCourse}
                  handleDeleteCourse={handleDeleteCourse}
                />
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
            <CircleAddButton onButtonClick={handleAddCourse} />
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
            <TotalCourses
              filteredCourses={filteredCourses}
              handleDetailCourse={handleDetailCourse}
              handleFileCourse={handleFileCourse}
              handleStartCourse={handleStartCourse}
              handleEditCourse={handleEditCourse}
              handleDeleteCourse={handleDeleteCourse}
            />
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorHome;
