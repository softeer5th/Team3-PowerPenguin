import { useState } from 'react';
import RequestCard from './components/RequestCard';
import S from './StudentRequest.module.css';
import { classroomRepository } from '../../../../di';
import SuccessPopup from '../components/SuccessPopup';

const CARD_TYPES = ['hard', 'fast', 'question', 'size', 'sound'] as const;
export type CardType = 'hard' | 'fast' | 'question' | 'size' | 'sound';

const StudentRequest = ({ courseId }: { courseId: string }) => {
  const [successPopup, setSuccessPopup] = useState<boolean>(false);

  const handleCardClick = async (type: CardType) => {
    try {
      await classroomRepository.sendRequest(courseId, type);
      setSuccessPopup(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <div className={S.pageLayout}>
      <div className={S.requestTitle}>
        <span className={S.titleStrong}>불편 사항</span>이 있을 때 사용해보세요{' '}
      </div>
      <div className={S.requestDesc}>
        수업 중 말하기 힘들 때 이모지로 알릴 수 있어요
      </div>
      <div className={S.cardContainer}>
        {CARD_TYPES.map((type) => (
          <RequestCard
            key={type}
            type={type}
            onCardClick={() => handleCardClick(type)}
          />
        ))}
      </div>
      {successPopup && (
        <SuccessPopup
          text="라이브 피드백 전송 성공"
          onClose={() => setSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default StudentRequest;
