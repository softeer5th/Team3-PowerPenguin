import { useState } from 'react';
import { CourseMeta } from '../../../../core/model';
import S from './CourseModal.module.css';
import ModalInput from '../../../../components/input/ModalInput';
import CategoryChip from '../../../../components/chip/CategoryChip';
import DropDown from '../../../../components/dropdown/DropDown';
import TimeInput from './components/TimeInput';
import AddDeleteButton from '../../../../components/button/icon/AddDeleteButton';
import TextButton from '../../../../components/button/text/TextButton';
import { CourseError } from '../../../../core/errorType';
import CloseIcon from '../../../../assets/icons/close.svg?react';

type CourseModalProps = {
  course?: CourseMeta;
  onSubmit: (course: CourseMeta) => void;
  onClose: () => void;
};

type CourseForm = {
  name: string;
  code: string;
  capacity: string;
  university: string;
  classType: string;
  schedule: {
    day: string;
    start: string;
    end: string;
  }[];
};

const days = ['월', '화', '수', '목', '금', '토', '일'] as const;

const checkForm = (courseForm: CourseForm) => {
  if (courseForm.name === '') {
    throw new CourseError('강의 이름을 입력해 주세요');
  }
  if (courseForm.code === '') {
    throw new CourseError('학수번호를 입력해 주세요');
  }
  if (courseForm.capacity === '' || !/^\d*$/.test(courseForm.capacity)) {
    throw new CourseError('수업정원을 입력해 주세요');
  }
  if (
    courseForm.university === '' ||
    !courseForm.university.includes('대학교')
  ) {
    throw new CourseError('대학교를 입력해 주세요');
  }
  if (courseForm.classType === '') {
    throw new CourseError('강의 유형을 선택해 주세요');
  }
  courseForm.schedule.forEach((schedule) => {
    if (schedule.start === '00:00' && schedule.end === '00:00') {
      throw new CourseError('강의 시간을 입력해 주세요');
    }
    if (schedule.start >= schedule.end) {
      throw new CourseError('시작 시간이 종료 시간보다 빠를 수 없습니다');
    }
  });
};

const CourseModal = ({ course, onSubmit, onClose }: CourseModalProps) => {
  const [courseForm, setCourseForm] = useState<CourseForm>({
    name: course?.name || '',
    code: course?.code || '',
    capacity: course?.capacity.toString() || '',
    university: course?.university || '',
    classType: course?.classType || '',
    schedule: course?.schedule || [
      {
        day: days[0],
        start: '00:00',
        end: '00:00',
      },
    ],
  });

  const handleSubmit = () => {
    try {
      checkForm(courseForm);
    } catch (error) {
      if (error instanceof CourseError) {
        alert(error.message);
      }
      return;
    }
    onSubmit({
      ...courseForm,
      id: course?.id || 0,
      capacity: parseInt(courseForm.capacity),
      accessCode: course?.accessCode || 0,
      fileURL: course?.fileURL || '',
    } as CourseMeta);
  };

  const handleInputChange = (key: string, value: string) => {
    setCourseForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleScheduleChange = (index: number, key: string, value: string) => {
    setCourseForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((schedule, i) =>
        i === index
          ? {
              ...schedule,
              [key]: value,
            }
          : schedule
      ),
    }));
  };

  const handleScheduleDelete = (index: number) => {
    setCourseForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const handleScheduleAdd = () => {
    setCourseForm((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { day: days[0], start: '00:00', end: '00:00' },
      ],
    }));
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className={S.courseModal}>
      <button className={S.closeButton} onClick={() => onClose()}>
        <CloseIcon className={S.closeIcon} />
      </button>
      <h2 className={S.title}>
        {course ? '강의 정보 수정하기' : '새 강의 만들기'}
      </h2>
      <div className={S.modalContent}>
        <ModalInput
          size="full"
          title="강의 이름"
          placeholder="강의 이름을 입력해 주세요"
          value={courseForm.name}
          onInputChange={(value) => handleInputChange('name', value)}
        />
        <ModalInput
          title="학수번호"
          placeholder="학수번호를 입력해 주세요"
          value={courseForm.code}
          onInputChange={(value) => handleInputChange('code', value)}
        />
        <ModalInput
          title="인원 수"
          desc="숫자만 작성해 주세요"
          placeholder="수업정원을 입력해 주세요"
          value={courseForm.capacity}
          onInputChange={(value) => handleInputChange('capacity', value)}
        />
        <ModalInput
          title="대학교"
          desc="'대학교' 텍스트를 포함해 작성해 주세요"
          placeholder="대학이름을 입력해 주세요"
          value={courseForm.university}
          onInputChange={(value) => handleInputChange('university', value)}
        />
        <div className={S.inputContainer}>
          <div className={S.inputTitle}>
            <span>강의 유형</span>
          </div>
          <div className={S.categoryContainer}>
            <button
              className={S.categoryChip}
              onClick={() => handleInputChange('classType', '교양')}
            >
              <CategoryChip
                color="green"
                text="교양"
                isActive={courseForm.classType === '교양'}
              />
            </button>
            <button
              className={S.categoryChip}
              onClick={() => handleInputChange('classType', '전공')}
            >
              <CategoryChip
                color="purple"
                text="전공"
                isActive={courseForm.classType === '전공'}
              />
            </button>
            <button
              className={S.categoryChip}
              onClick={() => handleInputChange('classType', '기타')}
            >
              <CategoryChip
                color="gray"
                text="기타"
                isActive={courseForm.classType === '기타'}
              />
            </button>
          </div>
        </div>
        <div className={S.inputContainer}>
          <div className={S.inputTitle}>
            <span>강의 시간</span>
          </div>
          <div className={S.scheduleList}>
            {courseForm.schedule.map((schedule, index) => (
              <div key={index} className={S.scheduleContainer}>
                <DropDown
                  width="109px"
                  title={schedule.day}
                  options={[...days]}
                  setTitle={(value) =>
                    handleScheduleChange(index, 'day', value)
                  }
                />
                <div className={S.timeInputContainer}>
                  <TimeInput
                    time={schedule.start}
                    setTime={(value) =>
                      handleScheduleChange(index, 'start', value)
                    }
                  />
                  <span className={S.timeDivider}>-</span>
                  <TimeInput
                    time={schedule.end}
                    setTime={(value) =>
                      handleScheduleChange(index, 'end', value)
                    }
                  />
                </div>
                {index !== 0 && (
                  <div className={S.deleteButton}>
                    <AddDeleteButton
                      onButtonClick={() => handleScheduleDelete(index)}
                      type="minus"
                    />
                  </div>
                )}
                {index === courseForm.schedule.length - 1 && (
                  <div className={S.addButton}>
                    <AddDeleteButton
                      onButtonClick={handleScheduleAdd}
                      type="plus"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={S.buttonContainer}>
        <TextButton
          color="blue"
          size="web4"
          width="788px"
          height="80px"
          text={course ? '정보 수정하기' : '강의 만들기'}
          onClick={handleSubmit}
          isActive={(() => {
            try {
              checkForm(courseForm);
              return true;
            } catch {
              return false;
            }
          })()}
        />
      </div>
    </form>
  );
};

export default CourseModal;
