import { useState } from 'react';
import RequestCard from './components/RequestCard';
import S from './StudentRequest.module.css';
import { classroomRepository } from '@/di';
import SuccessPopup from '../components/SuccessPopup';
import WishSvg from '@/assets/icons/wish-emoji.svg?react';
import WindSvg from '@/assets/icons/wind-emoji.svg?react';
import BulbSvg from '@/assets/icons/bulb-emoji.svg?react';
import MagnifierSvg from '@/assets/icons/magnifier-emoji.svg?react';
import EarSvg from '@/assets/icons/ear-emoji.svg?react';
import {
  RequestFast,
  RequestHard,
  RequestQuestion,
  RequestSize,
  RequestSound,
  RequestType,
} from '@/core/model';
import { handleStudentError } from '@/utils/studentPopupUtils';

const CARD_CONTENT = [
  {
    type: RequestHard.kind,
    icon: WishSvg,
    title: RequestHard.title,
    description: RequestHard.description,
  },
  {
    type: RequestFast.kind,
    icon: WindSvg,
    title: RequestFast.title,
    description: RequestFast.description,
  },
  {
    type: RequestQuestion.kind,
    icon: BulbSvg,
    title: RequestQuestion.title,
    description: RequestQuestion.description,
  },
  {
    type: RequestSize.kind,
    icon: MagnifierSvg,
    title: RequestSize.title,
    description: RequestSize.description,
  },
  {
    type: RequestSound.kind,
    icon: EarSvg,
    title: RequestSound.title,
    description: RequestSound.description,
  },
] as const;

type StudentRequestProps = {
  setModalType: React.Dispatch<React.SetStateAction<string | null>>;
  openModal: () => void;
};

const StudentRequest = ({ setModalType, openModal }: StudentRequestProps) => {
  const [successPopup, setSuccessPopup] = useState<boolean>(false);

  const handleCardClick = async (type: RequestType) => {
    try {
      await classroomRepository.sendRequest(type);
      setSuccessPopup(true);
      return true;
    } catch (error) {
      handleStudentError({ error, setModalType, openModal });
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
        {CARD_CONTENT.map((item) => (
          <RequestCard
            type={item.type}
            key={item.type}
            onCardClick={() => handleCardClick(item.type)}
            title={item.title}
            description={item.description}
            Icon={item.icon}
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
