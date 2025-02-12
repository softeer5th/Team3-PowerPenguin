import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import S from './ProfessorSearch.module.css';
import { CourseMeta } from '../../../../core/model';
import { courseRepository } from '../../../../di';
import { CourseDay, CourseType } from '../../../../utils/util';
import FilterDropDown from '../components/FilterDropDown';
import TotalCourses from '../components/TotalCourses';
import useModal from '../../../../hooks/useModal';
import courseActions from '../../../../utils/courseAction';

const ProfessorSearch = () => {
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleDetailCourse,
    handleFileCourse,
  } = courseActions({ courses, setModal, openModal, closeModal });
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const navigate = useNavigate();

  const filteredCourses = courses.filter(
    (course) =>
      (courseDay === '수업 요일' ||
        course.schedule.find(
          (schedule) => schedule.day === courseDay.slice(0, 1)
        )) &&
      (courseType === '수업 종류' || courseType === course.classType)
  );

  useEffect(() => {
    if (keyword.trim() === '') {
      navigate('/professor');
    }
  }, [keyword, navigate]);

  useEffect(() => {
    try {
      courseRepository.searchCourses(keyword || '').then(setCourses);
    } catch (error) {
      console.error(error);
    }
  }, [keyword]);

  return (
    <>
      <div className={S.container}>
        <div className={S.content}>
          <h2 className={S.title}>
            검색 결과 <span>{filteredCourses.length}건</span>
          </h2>
          <div className={S.courseList}>
            <div className={S.filter}>
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
            <TotalCourses
              filteredCourses={filteredCourses}
              handleDetailCourse={handleDetailCourse}
              handleDeleteCourse={handleDeleteCourse}
              handleEditCourse={handleEditCourse}
              handleFileCourse={handleFileCourse}
              handleStartCourse={handleStartCourse}
            />
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorSearch;
