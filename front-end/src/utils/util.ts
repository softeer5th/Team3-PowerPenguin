import { ClientError } from '@/core/errorType';
import { CourseMeta, Schedule } from '@/core/model';

const imageType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const validateImage = (file: File) => {
  if (!imageType.includes(file.type)) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_IMAGE_TYPE',
      message: '이미지 파일만 업로드 가능합니다.',
    });
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_IMAGE_SIZE',
      message: '이미지 파일은 5MB 이하만 업로드 가능합니다.',
    });
  }
};

export const validateName = (name: string) => {
  if (!name) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_NAME',
      message: '이름을 입력해주세요.',
    });
  }

  if (name.length > 20) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_NAME_LENGTH',
      message: '이름은 20자 이하로 입력해주세요.',
    });
  }

  const nameRegex = /^[A-Za-z가-힣]+$/;
  if (!nameRegex.test(name)) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_NAME_REGEX',
      message: '이름은 한글과 영문 대소문자만 입력 가능합니다.',
    });
  }
};

export const validateFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_FILE_TYPE',
      message: '파일 형식이 올바르지 않습니다.',
    });
  }

  if (file.size > 100 * 1024 * 1024) {
    throw new ClientError({
      success: false,
      errorCode: 'INVALID_FILE_SIZE',
      message: '파일은 100MB 이하만 업로드 가능합니다.',
    });
  }
};

const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
export const getDayString = (day: number) => dayMap[day];

export const getCourseColor = (category: string) => {
  switch (category) {
    case '전공':
      return 'purple';
    case '교양':
      return 'green';
    default:
      return 'gray';
  }
};

export const createTargetDate = (time: string): Date => {
  const [targetHour, targetMinute] = time.split(':');
  const target = new Date();
  target.setHours(Number(targetHour), Number(targetMinute), 0, 0);
  return target;
};

export const isSoon = (time: string) => {
  const leftTime = createTargetDate(time).getTime() - Date.now();
  return leftTime > 0 && leftTime < 3600000;
};

export type TimeType = {
  hour: number;
  minute: number;
  second: number;
};

export const formatTime = (time?: TimeType) => {
  if (!time) return '00 : 00 : 00';
  if (time.hour < 0) return '00 : 00 : 00';
  if (time.minute < 0) return '00 : 00 : 00';
  if (time.second < 0) return '00 : 00 : 00';

  return `${time.hour.toString().padStart(2, '0')} : ${time.minute.toString().padStart(2, '0')} : ${time.second
    .toString()
    .padStart(2, '0')}`;
};

export function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dayOfWeek = dayMap[now.getDay()];
  return `${year}.${month}.${day} (${dayOfWeek})`;
}

export function createCourseGroup(courses: CourseMeta[], size: number) {
  const groups: CourseMeta[][] = [];
  for (let i = 0; i < courses.length; i += size) {
    groups.push(courses.slice(i, i + size));
  }
  return groups;
}

export const CourseDay = ['월', '화', '수', '목', '금', '토', '일'];
export const CourseType = ['전공', '교양', '기타'];

export const formatSchedule = (schedule: Schedule, isEnd: boolean) => {
  return `${schedule.day} ${schedule.start} - ${schedule.end}${isEnd ? '' : ', '}`;
};

export const filterCourse = (
  courses: CourseMeta[],
  courseDay: string,
  courseType: string
) => {
  return courses.filter(
    (course) =>
      (courseDay === '수업 요일' ||
        course.schedule.find(
          (schedule) => schedule.day === courseDay.slice(0, 1)
        )) &&
      (courseType === '수업 종류' || courseType === course.classType)
  );
};

export const utcToKst = (isoString: string) => {
  const date = new Date(isoString);
  const kstHours = (date.getHours() + 9).toString().padStart(2, '0');
  const kstMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${kstHours}:${kstMinutes}`;
};
