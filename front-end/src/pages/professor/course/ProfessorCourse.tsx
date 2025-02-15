import CircleBackButton from '@/components/button/icon/CircleBackButton';
import S from './ProfessorCourse.module.css';
import RecIconButton from '@/components/button/icon/RecIconButton';
import TextButton from '@/components/button/text/TextButton';
import useCourseActions from '@/hooks/useCourseAction';
import useModal from '@/hooks/useModal';
import { useEffect, useState } from 'react';
import { Course, CourseMeta } from '@/core/model';
import ClockIcon from '@/assets/icons/clock.svg?react';
import PeopleIcon from '@/assets/icons/people.svg?react';
import { formatSchedule, getCourseColor } from '@/utils/util';
import { courseRepository } from '@/di';
import { useNavigate, useParams } from 'react-router';
import CourseQuestion from './components/CourseQuestion';
import CourseRequest from './components/CourseRequest';
import CategoryChip from '@/components/chip/CategoryChip';

const ProfessorCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const {
    handleDeleteCourse,
    handleEditCourse,
    handleStartCourse,
    handleFileCourse,
  } = useCourseActions({ setModal, openModal, closeModal });
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate('/professor');
  };

  useEffect(() => {
    async function getCourse() {
      try {
        if (!courseId) {
          navigate('/professor');
          return;
        }

        const course = await courseRepository.getCourseById(parseInt(courseId));
        setCourse(course);
      } catch (error) {
        alert(error);
        navigate('/professor');
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
                  onButtonClick={() => handleEditCourse(course as CourseMeta)}
                  type="setting"
                  bg="gray"
                />
                <RecIconButton
                  onButtonClick={() => handleDeleteCourse(course as CourseMeta)}
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
                width="20.5rem"
                height="5.0625rem"
                text={course?.fileURL ? '파일 업로드 상태 수정' : '자료 업로드'}
                onClick={() => handleFileCourse(course as CourseMeta)}
              />
              <TextButton
                color="blue"
                size="web2"
                height="5.0625rem"
                text="오늘 수업 시작하기"
                onClick={() => handleStartCourse(course as CourseMeta)}
              />
            </div>
          </div>
        </div>
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorCourse;
