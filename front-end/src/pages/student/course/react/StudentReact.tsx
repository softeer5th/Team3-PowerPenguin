import S from './StudentReact.module.css';
import OkaySvg from '@/assets/icons/okay-emoji.svg?react';
import ClapSvg from '@/assets/icons/clap-emoji.svg?react';
import ThumbUpSvg from '@/assets/icons/thumb-up-emoji.svg?react';
import HeartSvg from '@/assets/icons/heart-emoji.svg?react';
import CrySvg from '@/assets/icons/cry-emoji.svg?react';
import ScreamSvg from '@/assets/icons/scream-emoji.svg?react';
import SuccessPopup from '../components/SuccessPopup';
import { useState } from 'react';
import ReactCard from './components/ReactCard';
import { classroomRepository } from '@/di';
import { Reaction } from '@/core/model';
import { ClientError, ServerError } from '@/core/errorType';

const CARD_List = [
  { type: 'OKAY', icon: OkaySvg },
  { type: 'CLAP', icon: ClapSvg },
  { type: 'THUMBS_UP', icon: ThumbUpSvg },
  { type: 'SURPRISED', icon: ScreamSvg },
  { type: 'CRYING', icon: CrySvg },
  { type: 'HEART_EYES', icon: HeartSvg },
] as const;

type StudentReactProps = {
  setModalType: React.Dispatch<React.SetStateAction<string | null>>;
  openModal: () => void;
};

const StudentReact = ({ setModalType, openModal }: StudentReactProps) => {
  const [successPopup, setSuccessPopup] = useState<boolean>(false);

  const handleCardClick = async (reaction: Reaction) => {
    try {
      await classroomRepository.sendReaction(reaction);
      setSuccessPopup(true);
      return true;
    } catch (error) {
      if (error instanceof ClientError) {
        if (error.errorCode === 'COURSE_NOT_FOUND') {
          setModalType('notFound');
          openModal();
        } else if (error.errorCode === 'COURSE_NOT_ACTIVE') {
          setModalType('notStart');
          openModal();
        }
      } else if (error instanceof ServerError) {
        setModalType('server');
        openModal();
      } else {
        setModalType('unknown');
        openModal();
      }
      return false;
    }
  };
  return (
    <div className={S.pageLayout}>
      <div className={S.reactTitle}>
        <span className={S.titleStrong}>간단한 반응</span>을 남기며 소통해보세요
      </div>
      <div className={S.reactDesc}>이모지로 가볍게 감정을 표현할 수 있어요</div>
      <div className={S.cardContainer}>
        {CARD_List.map((item) => (
          <ReactCard
            key={item.type}
            type={item.type}
            Icon={item.icon}
            onCardClick={() => handleCardClick(item.type)}
          />
        ))}
      </div>
      {successPopup && (
        <SuccessPopup
          text="라이브 이모지 전송 성공"
          onClose={() => setSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default StudentReact;
