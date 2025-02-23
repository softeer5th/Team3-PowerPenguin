import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CircleBackButton from '@/components/button/icon/CircleBackButton';
import S from './ProfessorCourse.module.css';
import RecIconButton from '@/components/button/icon/RecIconButton';
import TextButton from '@/components/button/text/TextButton';
import courseActions from '@/utils/courseAction';
import useModal from '@/hooks/useModal';
import { Course, CourseMeta } from '@/core/model';
import ClockIcon from '@/assets/icons/clock.svg?react';
import PeopleIcon from '@/assets/icons/people.svg?react';
import { formatSchedule, getCourseColor } from '@/utils/util';
import { courseRepository } from '@/di';
import CourseQuestion from './components/CourseQuestion';
import CourseRequest from './components/CourseRequest';
import CategoryChip from '@/components/chip/CategoryChip';
import ProfessorError from '@/pages/professor/professorError';

const ProfessorCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const navigate = useNavigate();
  const { popupError, ErrorModal } = ProfessorError();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleFileCourse,
  } = courseActions({ setModal, openModal, closeModal, navigate, popupError });

  const handleClickBack = () => {
    navigate('/professor');
  };

  useEffect(() => {
    async function getCourse() {
      try {
        if (!courseId) {
          popupError(new Error('수업 정보를 불러올 수 없습니다.'));
          return;
        }

        const course = await courseRepository.getCourseById(courseId);
        setCourse(course);
      } catch (error) {
        popupError(error);
      }
    }

    getCourse();
  }, [courseId, navigate]);

  return (
    <>
      <div className={S.professorCourse}>
        <div className={S.professorCourseHeader}>
          <div className={S.backButton}>
            <CircleBackButton onButtonClick={handleClickBack} />
          </div>
          <div className={S.professorCourseHeaderContainer}>
            <div className={S.professorCourseHeaderInfo}>
              <div className={S.infoText}>
                <h3 className={S.courseUniversity}>{course?.university}</h3>
                <h1 className={S.courseTitle}>{course?.name}</h1>
              </div>
              <div className={S.courseSubInfo}>
                <div className={S.courseSchedule}>
                  <ClockIcon className={S.clockIcon} />
                  <span className={S.subInfoText}>
                    {course?.schedule.map((schedule, index) =>
                      formatSchedule(
                        schedule,
                        index === course.schedule.length - 1
                      )
                    )}
                  </span>
                </div>
                <div className={S.divider} />
                <div className={S.coursePeople}>
                  <PeopleIcon className={S.peopleIcon} />
                  <span className={S.subInfoText}>{course?.capacity}명</span>
                </div>
                <div className={S.courseCategory}>
                  <CategoryChip
                    color={getCourseColor(course?.classType || '기타')}
                    text={course?.classType || '기타'}
                    isActive={true}
                  />
                </div>
              </div>
            </div>
            <div className={S.right}>
              <div className={S.courseAccessCode}>
                <span className={S.accessCodeText}>
                  입장코드 : {course?.accessCode}
                </span>
              </div>
              <div className={S.headerButtonContainer}>
                <RecIconButton
                  onButtonClick={() =>
                    course && handleEditCourse(course as CourseMeta)
                  }
                  type="setting"
                  bg="gray"
                />
                <RecIconButton
                  onButtonClick={() =>
                    course && handleDeleteCourse(course as CourseMeta)
                  }
                  type="trash"
                  bg="red"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={S.professorCourseBody}>
          <div className={S.bodyContainer}>
            <h2 className={S.bodyHeader}>지난번 수업 데이터</h2>
            <div className={S.bodyContent}>
              <div className={S.courseBodyContainer}>
                <h3 className={S.courseBodyTitle}>
                  💬 이전 수업에서 해결되지 못한 질문
                </h3>
                <CourseQuestion questions={course?.questions || []} />
              </div>
              <div className={S.courseBodyContainer}>
                <h3 className={S.courseBodyTitle}>📊 이전 수업 반응 통계</h3>
                <CourseRequest requests={course?.requests || []} />
              </div>
            </div>
            <div className={S.bodyButtonContainer}>
              <TextButton
                color="black"
                size="web2"
                width="328px"
                height="81px"
                text={
                  course?.fileName ? '파일 업로드 상태 수정' : '자료 업로드'
                }
                onClick={() => handleFileCourse(course as CourseMeta)}
              />
              <TextButton
                color="blue"
                size="web2"
                height="81px"
                text="오늘 수업 시작하기"
                onClick={() => handleStartCourse(course as CourseMeta)}
              />
            </div>
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
      <ErrorModal />
    </>
  );
};

export default ProfessorCourse;
