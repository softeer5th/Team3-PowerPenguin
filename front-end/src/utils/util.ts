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
