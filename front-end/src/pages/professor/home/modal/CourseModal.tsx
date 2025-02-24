import { useEffect, useState } from 'react';
import { CourseMeta } from '@/core/model';
import S from './CourseModal.module.css';
import ModalInput from '@/components/input/ModalInput';
import CategoryChip from '@/components/chip/CategoryChip';
import DropDown from '@/components/dropdown/DropDown';
import TimeInput from './components/TimeInput';
import AddDeleteButton from '@/components/button/icon/AddDeleteButton';
import TextButton from '@/components/button/text/TextButton';
import CloseIcon from '@/assets/icons/close.svg?react';
import { CourseType, CourseDay, getCourseColor } from '@/utils/util';

type CourseModalProps = {
  course?: CourseMeta;
  onSubmit: (course: CourseMeta) => Promise<void>;
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

type CourseError = {
  name: string;
  code: string;
  capacity: string;
  university: string;
  classType: string;
  schedule: string;
};

const makeFullUniversity = (university: string) => {
  if (university === '') {
    return '';
  }
  if (university.endsWith('대학')) {
    return university + '교';
  }
  if (university.endsWith('대')) {
    return university + '학교';
  }

  return university;
};

const checkFormError = (
  courseError: CourseError,
  courseForm: CourseForm
): boolean => {
  if (courseError.name || courseForm.name === '') {
    return true;
  }
  if (courseError.code || courseForm.code === '') {
    return true;
  }
  if (courseError.capacity || courseForm.capacity === '') {
    return true;
  }
  if (courseError.university || courseForm.university === '') {
    return true;
  }
  if (courseError.classType || courseForm.classType === '') {
    return true;
  }
  if (courseError.schedule) {
    return true;
  }
  courseForm.schedule.forEach((schedule) => {
    if (schedule.day === '') {
      return true;
    }
    if (schedule.start > schedule.end) {
      return true;
    }
  });
  return false;
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
        day: CourseDay[0],
        start: '00:00',
        end: '00:00',
      },
    ],
  });

  const [formError, setFormError] = useState<CourseError>({
    name: '',
    code: '',
    capacity: '',
    university: '',
    classType: courseForm.classType === '' ? '강의 유형을 선택해 주세요' : '',
    schedule: '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...courseForm,
      id: course?.id || '',
      capacity: parseInt(courseForm.capacity),
      accessCode: course?.accessCode || 0,
      fileName: course?.fileName || '',
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
    if (courseForm.schedule.length >= 10) {
      return;
    }
    setCourseForm((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { day: CourseDay[0], start: '00:00', end: '00:00' },
      ],
    }));
  };

  useEffect(() => {
    if (courseForm.classType === '') {
      setFormError((prev) => ({
        ...prev,
        classType: '강의 유형을 선택해 주세요',
      }));
    } else {
      setFormError((prev) => ({ ...prev, classType: '' }));
    }
  }, [courseForm.classType]);

  useEffect(() => {
    courseForm.schedule.forEach((schedule, index) => {
      if (schedule.day === '') {
        setFormError((prev) => ({
          ...prev,
          schedule: `${index + 1}번째 강의 요일을 선택해 주세요`,
        }));
        return;
      } else if (schedule.start > schedule.end) {
        setFormError((prev) => ({
          ...prev,
          schedule: `${index + 1}번째 강의 시간을 확인해 주세요`,
        }));
        return;
      } else {
        setFormError((prev) => ({ ...prev, schedule: '' }));
      }
    });
  }, [courseForm.schedule]);

  return (
    <form
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={S.courseModal}
    >
      <button
        className={S.closeButton}
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <CloseIcon className={S.closeIcon} />
      </button>
      <h2 className={S.title}>
        {course ? '강의 정보 수정하기' : '새 강의 만들기'}
      </h2>
      <div className={S.modalContent}>
        <ModalInput
          size="full"
          title="강의 이름"
          desc={formError.name}
          placeholder="강의 이름을 입력해 주세요"
          value={courseForm.name}
          onInputChange={(value) => handleInputChange('name', value)}
          onBlur={() => {
            if (courseForm.name === '') {
              setFormError((prev) => ({
                ...prev,
                name: '강의 이름을 입력해 주세요',
              }));
            } else {
              setFormError((prev) => ({ ...prev, name: '' }));
            }
          }}
        />
        <div className={S.inputContainer}>
          <div className={S.inputTitle}>
            <span>강의 유형</span>
          </div>
          <div className={S.categoryContainer}>
            {CourseType.map((type) => (
              <button
                key={type}
                className={S.categoryChip}
                onClick={(e) => {
                  e.preventDefault();
                  handleInputChange('classType', type);
                }}
              >
                <CategoryChip
                  color={getCourseColor(type)}
                  text={type}
                  isActive={courseForm.classType === type}
                />
              </button>
            ))}
            {formError.classType && (
              <span className={S.errorText}>{formError.classType}</span>
            )}
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
                  options={[...CourseDay]}
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
                {index === courseForm.schedule.length - 1 && index < 9 && (
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
        <ModalInput
          title="학수번호"
          placeholder="학수번호를 입력해 주세요"
          desc={formError.code}
          value={courseForm.code}
          onInputChange={(value) => handleInputChange('code', value)}
          onBlur={() => {
            if (courseForm.code === '') {
              setFormError((prev) => ({
                ...prev,
                code: '학수번호를 입력해 주세요',
              }));
            } else {
              setFormError((prev) => ({ ...prev, code: '' }));
            }
          }}
        />
        <ModalInput
          title="인원 수"
          placeholder="수업정원을 입력해 주세요"
          desc={formError.capacity}
          value={courseForm.capacity}
          onInputChange={(value) => handleInputChange('capacity', value)}
          onBlur={() => {
            if (courseForm.capacity === '') {
              setFormError((prev) => ({
                ...prev,
                capacity: '수업정원을 입력해 주세요',
              }));
            } else if (!/^\d*$/.test(courseForm.capacity)) {
              setFormError((prev) => ({
                ...prev,
                capacity: '숫자만 입력해 주세요',
              }));
            } else {
              setFormError((prev) => ({ ...prev, capacity: '' }));
            }
          }}
        />
        <ModalInput
          title="대학교"
          placeholder="대학이름을 입력해 주세요"
          desc={formError.university}
          value={courseForm.university}
          onInputChange={(value) => handleInputChange('university', value)}
          onBlur={() => {
            if (courseForm.university === '') {
              setFormError((prev) => ({
                ...prev,
                university: '대학이름을 입력해 주세요',
              }));
            } else {
              setFormError((prev) => ({ ...prev, university: '' }));
              setCourseForm((prev) => ({
                ...prev,
                university: makeFullUniversity(prev.university),
              }));
            }
          }}
        />
      </div>
      <div className={S.buttonContainer}>
        <TextButton
          type="submit"
          color="blue"
          size="web4"
          height="80px"
          text={course ? '정보 수정하기' : '강의 만들기'}
          onClick={() => {}}
          isActive={!checkFormError(formError, courseForm)}
        />
      </div>
    </form>
  );
};

export default CourseModal;
