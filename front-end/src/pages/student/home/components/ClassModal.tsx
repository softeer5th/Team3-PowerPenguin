import S from './ClassModal.module.css';
import CloseSvg from '../../../../assets/icons/close.svg?react';

const ClassModal = () => {
  return (
    <div className={S.modalContainer}>
      <div className={S.modalTitle}>강의 정보를 확인해주세요</div>
      <button className={S.closeButton}>
        <CloseSvg width="12px" height="12px" />
      </button>
      <div className={S.contentContainer}>
        <div className={S.university}>소프대학교</div>
        <div className={S.courseTitle}>학생의 생성과 발전</div>
        <div className={S.courseDescBox}>
          <span className={S.courseTime}>월 8:00-10:00</span>
          <span className={S.coursePeople}>300명</span>
        </div>
      </div>
      <div className={S.buttonContainer}>
        <button className={S.backButton}>뒤로가기</button>
        <button className={S.enterButton}>입장하기</button>
      </div>
    </div>
  );
};

export default ClassModal;
