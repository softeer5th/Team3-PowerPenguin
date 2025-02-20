import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import S from './ProfessorSearch.module.css';
import { CourseMeta } from '@/core/model';
import { courseRepository } from '@/di';
import { CourseDay, CourseType } from '@/utils/util';
import FilterDropDown from '../components/FilterDropDown';
import TotalCourses from '../components/TotalCourses';
import useModal from '@/hooks/useModal';
import courseActions from '@/utils/courseAction';
import ProfessorError from '@/utils/professorError';

const ProfessorSearch = () => {
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  const { openModal, closeModal, Modal } = useModal();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleDetailCourse,
    handleFileCourse,
  } = courseActions({ setModal, openModal, closeModal, navigate });
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const popupError = ProfessorError({
    setModal,
    openModal,
    closeModal,
    navigate,
  });

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
    async function searchCourses() {
      try {
        const searchedCourses = await courseRepository.searchCourses(
          keyword || ''
        );
        setCourses(searchedCourses);
      } catch (error) {
        popupError(error);
      }
    }

    searchCourses();
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
              onDetailCourse={handleDetailCourse}
              onDeleteCourse={handleDeleteCourse}
              onEditCourse={handleEditCourse}
              onFileCourse={handleFileCourse}
              onStartCourse={handleStartCourse}
            />
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorSearch;
