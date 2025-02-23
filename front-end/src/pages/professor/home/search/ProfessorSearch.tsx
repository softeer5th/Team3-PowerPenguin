import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import S from './ProfessorSearch.module.css';
import { CourseMeta } from '@/core/model';
import { courseRepository } from '@/di';
import { CourseDay, CourseType, filterCourse } from '@/utils/util';
import FilterDropDown from '../components/FilterDropDown';
import TotalCourses from '../components/TotalCourses';
import courseActions from '@/utils/courseAction';
import { OutletContext } from '../layout/ProfessorHomeLayout';

const ProfessorSearch = () => {
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');
  const { openModal, closeModal, setModal, navigate, popupError } =
    useOutletContext<OutletContext>();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleDetailCourse,
    handleFileCourse,
  } = courseActions({ setModal, openModal, closeModal, navigate, popupError });
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const filteredCourses = filterCourse(courses, courseDay, courseType);

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
  );
};

export default ProfessorSearch;
