import { CourseMeta } from '../core/model';

const imageType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const validateImage = (file: File): boolean => {
  if (!file) {
    return false;
  }
  if (!imageType.includes(file.type)) {
    alert('이미지 파일만 업로드 가능합니다.');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 파일은 5MB 이하만 업로드 가능합니다.');
    return false;
  }

  return true;
};

export const validateName = (name: string): boolean => {
  if (!name) {
    alert('사용자 이름을 입력해 주세요.');
    return false;
  }

  const nameRegex = /^[A-Za-z가-힣]+$/;
  if (!nameRegex.test(name)) {
    alert('사용자 이름은 영어(대소문자)와 완성된 한글만 포함해야 합니다.');
    return false;
  }

  return true;
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

export const formatTime = ({ hour, minute, second }: TimeType) => {
  if (hour < 0) return '00 : 00 : 00';
  if (minute < 0) return '00 : 00 : 00';
  if (second < 0) return '00 : 00 : 00';

  return `${hour.toString().padStart(2, '0')} : ${minute.toString().padStart(2, '0')} : ${second
    .toString()
    .padStart(2, '0')}`;
};

export function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[now.getDay()];
  return `${year}.${month}.${day} (${dayOfWeek})`;
}

export function createCourseGroup(courses: CourseMeta[], size: number) {
  const groups: CourseMeta[][] = [];
  for (let i = 0; i < courses.length; i += size) {
    groups.push(courses.slice(i, i + size));
  }
  return groups;
}
