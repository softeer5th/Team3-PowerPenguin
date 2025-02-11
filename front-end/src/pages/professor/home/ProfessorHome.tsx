import S from './ProfessorHome.module.css';
import { courseRepository } from '../../../di';
import { ReactNode, useEffect, useState } from 'react';
import CourseCard from './components/CourseCard';
import { CourseMeta } from '../../../core/model';
import RocketIcon from '../../../assets/icons/rocket.svg?react';
import CircleAddButton from '../../../components/button/icon/CircleAddButton';
import CourseModal from './modal/CourseModal';
import AlertModal from '../../../components/modal/AlertModal';
import FileUploadPopupModal from '../../../components/modal/FileUploadPopupModal';
import useModal from '../../../hooks/useModal';
import TodayCourses from './components/TodayCourses';
import TotalCourses from './components/TotalCourses';
import FilterDropDown from './components/FilterDropDown';

const CourseDay = ['월', '화', '수', '목', '금', '토', '일'];
const CourseType = ['전공', '교양', '기타'];

const ProfessorHome = () => {
  const [todayCourses, setTodayCourses] = useState<CourseMeta[]>([]);
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [courseDay, setCourseDay] = useState<string>('수업 요일');
  const [courseType, setCourseType] = useState<string>('수업 종류');

  const [modal, setModal] = useState<ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();

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

  const handleDeleteCourse = (courseId: number) => {
    setModal(
      <AlertModal
        type="caution"
        message="강의를 삭제하시겠습니까?"
        description="삭제된 강의는 복구가 불가능합니다. 정말 삭제하시겠습니까?"
        buttonText="삭제"
        onClickCloseButton={() => {
          setModal(null);
          closeModal();
        }}
        onClickModalButton={() => {
          console.log('Delete course:', courseId);
          setModal(null);
          closeModal();
        }}
      />
    );
    openModal();
  };

  const handleEditCourse = (courseId: number) => {
    console.log('Edit course:', courseId);
    setModal(
      <CourseModal
        course={courses.find((course) => course.id === courseId)}
        onClose={() => {
          setModal(null);
          closeModal();
        }}
        onSubmit={(course) => {
          console.log('Submit course:', course);
          setModal(null);
          closeModal();
        }}
      />
    );
    openModal();
  };

  const handleStartCourse = (courseId: number) => {
    console.log('Start course:', courseId);
  };

  const handleDetailCourse = (courseId: number) => {
    console.log('Detail course:', courseId);
  };

  const handleFileCourse = (courseId: number) => {
    console.log('File course:', courseId);

    const course = courses.find((course) => course.id === courseId);
    let handleFileSave;
    if (course?.fileURL) {
      handleFileSave = (file: File) => {
        setModal(
          <AlertModal
            type="caution"
            message="새 파일을 저장하시겠습니까?"
            description="이미 저장된 강의자료가 있습니다. 삭제하고 새 파일을 저장하시겠습니까?"
            buttonText="새 파일 저장"
            onClickModalButton={() => {
              setModal(
                <AlertModal
                  type="success"
                  message="파일이 성공적으로 업로드되었습니다."
                  buttonText="확인"
                  onClickCloseButton={() => {
                    setModal(null);
                    closeModal();
                  }}
                  onClickModalButton={() => {
                    setModal(null);
                    closeModal();
                    console.log('Save file:', file);
                  }}
                />
              );
            }}
            onClickCloseButton={() => {
              setModal(null);
              closeModal();
            }}
          />
        );
      };
    } else {
      handleFileSave = (file: File) => {
        setModal(
          <AlertModal
            type="success"
            message="파일이 성공적으로 업로드되었습니다."
            buttonText="확인"
            onClickCloseButton={() => {
              setModal(null);
              closeModal();
            }}
            onClickModalButton={() => {
              setModal(null);
              closeModal();
              console.log('Save file:', file);
            }}
          />
        );
      };
    }

    setModal(
      <FileUploadPopupModal
        onClickCloseButton={() => {
          setModal(null);
          closeModal();
        }}
        onClickSaveButton={(file) => {
          handleFileSave(file);
        }}
      />
    );
    openModal();
  };

  const handleAddCourse = () => {
    console.log('Add course');
    setModal(
      <CourseModal
        onClose={() => {
          setModal(null);
          closeModal();
        }}
        onSubmit={(course) => {
          console.log('Submit course:', course);
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
