import S from './ProfessorHome.module.css';
import { courseRepository } from '../../../di';
import { ReactNode, useEffect, useState } from 'react';
import { CourseMeta } from '../../../core/model';
import RocketIcon from '../../../assets/icons/rocket.svg?react';
import CircleAddButton from '../../../components/button/icon/CircleAddButton';
import useModal from '../../../hooks/useModal';
import TodayCourses from './components/TodayCourses';
import TotalCourses from './components/TotalCourses';
import FilterDropDown from './components/FilterDropDown';
import { CourseDay, CourseType } from '../../../utils/util';
import useCourseActions from '../../../hooks/useCourseAction';
import CourseModal from './modal/CourseModal';

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
  } = useCourseActions({ setModal, openModal, closeModal });

  const filteredCourses = courses.filter(
    (course) =>
      (courseDay === '수업 요일' ||
        course.schedule.find(
          (schedule) => schedule.day === courseDay.slice(0, 1)
        )) &&
      (courseType === '수업 종류' || courseType === course.classType)
  );

  useEffect(() => {
    async function fetchCourses() {
      try {
        const courses = await courseRepository.getHomeCourses();
        setCourses(courses.totalCourse);
        setTodayCourses(courses.todayCourse);
      } catch (error) {
        console.error('Error while fetching courses:', error);
      }
    }

    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    console.log('Add course');
    setModal(
      <CourseModal
        onClose={() => {
          setModal(null);
          closeModal();
        }}
        onSubmit={async (course) => {
          try {
            console.log('Submit course:', course);
            setModal(null);
            closeModal();
            await courseRepository.createCourse(course);
          } catch (error) {
            console.error('Error while creating course:', error);
          }
        }}
      />
    );
    openModal();
  };

  return (
    <>
      <div className={S.container}>
        <div className={S.header}>
          <div className={S.headerContainer}>
            {todayCourses.length > 0 ? (
              <TodayCourses
                todayCourses={todayCourses}
                onDeleteCourse={handleDeleteCourse}
                onEditCourse={handleEditCourse}
                onStartCourse={handleStartCourse}
                onDetailCourse={handleDetailCourse}
                onFileCourse={handleFileCourse}
              />
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
              onDeleteCourse={handleDeleteCourse}
              onEditCourse={handleEditCourse}
              onStartCourse={handleStartCourse}
              onDetailCourse={handleDetailCourse}
              onFileCourse={handleFileCourse}
            />
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorHome;
