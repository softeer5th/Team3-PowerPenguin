import S from './ProfessorHome.module.css';
import { courseRepository } from '../../../di';
import { useEffect, useState } from 'react';
import CourseCard from './components/CourseCard';
import { CourseMeta } from '../../../core/model';

const ProfessorHome = () => {
  const [courses, setCourses] = useState<CourseMeta[]>([]);

  useEffect(() => {
    courseRepository.getHomeCourses().then((courses) => {
      setCourses(courses.totalCourse);
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
      <div className={S.header}></div>
      <div className={S.content}>
        {courses.map((course) => (
          <div key={course.id}>
            <CourseCard
              course={course}
              size="small"
              onDeleteCourse={handleDeleteCourse}
              onEditCourse={handleEditCourse}
              onStartCourse={handleStartCourse}
              onDetailCourse={handleDetailCourse}
              onFileCourse={handleFileCourse}
            />
            <CourseCard
              course={course}
              size="medium"
              onDeleteCourse={handleDeleteCourse}
              onEditCourse={handleEditCourse}
              onStartCourse={handleStartCourse}
              onDetailCourse={handleDetailCourse}
              onFileCourse={handleFileCourse}
            />
            <CourseCard
              course={course}
              size="large"
              onDeleteCourse={handleDeleteCourse}
              onEditCourse={handleEditCourse}
              onStartCourse={handleStartCourse}
              onDetailCourse={handleDetailCourse}
              onFileCourse={handleFileCourse}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorHome;
