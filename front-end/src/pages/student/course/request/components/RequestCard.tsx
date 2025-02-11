import S from './RequestCard.module.css';
import WishSvg from '../../../../../assets/icons/wish-emoji.svg?react';
import WindSvg from '../../../../../assets/icons/wind-emoji.svg?react';
import BulbSvg from '../../../../../assets/icons/bulb-emoji.svg?react';
import MagnifierSvg from '../../../../../assets/icons/magnifier-emoji.svg?react';
import EarSvg from '../../../../../assets/icons/ear-emoji.svg?react';
import {
  RequestFast,
  RequestHard,
  RequestQuestion,
  RequestSize,
  RequestSound,
} from '../../../../../core/model';
import { CardType } from '../StudentRequest';
import useBlockTimer from '../../../../../hooks/useBlockTimer';
import { useState } from 'react';

const CARD_CONTENT = {
  hard: {
    icon: <WishSvg className={S.icon} />,
    title: RequestHard.title,
    description: RequestHard.description,
  },
  fast: {
    icon: <WindSvg className={S.icon} />,
    title: RequestFast.title,
    description: RequestFast.description,
  },
  question: {
    icon: <BulbSvg className={S.icon} />,
    title: RequestQuestion.title,
    description: RequestQuestion.description,
  },
  size: {
    icon: <MagnifierSvg className={S.icon} />,
    title: RequestSize.title,
    description: RequestSize.description,
  },
  sound: {
    icon: <EarSvg className={S.icon} />,
    title: RequestSound.title,
    description: RequestSound.description,
  },
};

type RequestCardProps = {
  type: CardType;
  onCardClick: () => Promise<boolean>;
};

const RequestCard = ({ type, onCardClick }: RequestCardProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { icon, title, description } = CARD_CONTENT[type] || {};
  const { isBlocked, countdown } = useBlockTimer(
    isSelected,
    setIsSelected,
    60000,
    2000
  );

  const handleButtonClick = async () => {
    const success = await onCardClick();
    if (success) {
      setIsSelected(true);
    }
  };

  return (
    <button
      className={`${S.cardContainer} ${isSelected ? S.active : ''} ${isBlocked ? S.blocked : ''} `}
      onClick={handleButtonClick}
      disabled={!!isSelected || isBlocked}
    >
      <div className={S.iconBg}>{icon}</div>
      <div className={S.cardContentContainer}>
        <div className={S.cardTitle}>{title}</div>
        <div className={S.cardDesc}>{description}</div>
      </div>
      {isBlocked && <div className={S.countdownText}>{countdown}</div>}
    </button>
  );
};

export default RequestCard;
