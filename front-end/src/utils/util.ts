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
