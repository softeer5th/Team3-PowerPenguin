import S from './StudentReact.module.css';
import OkaySvg from '../../../../assets/icons/okay-emoji.svg?react';
import ClapSvg from '../../../../assets/icons/clap-emoji.svg?react';
import ThumbUpSvg from '../../../../assets/icons/thumb-up-emoji.svg?react';
import HeartSvg from '../../../../assets/icons/heart-emoji.svg?react';
import CrySvg from '../../../../assets/icons/cry-emoji.svg?react';
import ScreamSvg from '../../../../assets/icons/scream-emoji.svg?react';
import SuccessPopup from '../components/SuccessPopup';
import { useState } from 'react';
import ReactCard from './components/ReactCard';
import { classroomRepository } from '../../../../di';
import { Reaction } from '../../../../core/model';

const CARD_List = [
  { type: 'okay', icon: OkaySvg },
  { type: 'clap', icon: ClapSvg },
  { type: 'thumb', icon: ThumbUpSvg },
  { type: 'scream', icon: ScreamSvg },
  { type: 'cry', icon: CrySvg },
  { type: 'like', icon: HeartSvg },
] as const;

const StudentReact = ({ courseId }: { courseId: string }) => {
  const [successPopup, setSuccessPopup] = useState<boolean>(false);

  const handleCardClick = async (reaction: Reaction) => {
    try {
      await classroomRepository.sendReaction(courseId, reaction);
      setSuccessPopup(true);
      return true;
    } catch (error) {
      console.error(error);
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
