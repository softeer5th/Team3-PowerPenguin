import S from './RequestCard.module.css';
import useBlockTimer from '../../../../../hooks/useBlockTimer';
import { useState } from 'react';

type RequestCardProps = {
  onCardClick: () => Promise<boolean>;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const RequestCard = ({
  onCardClick,
  Icon,
  title,
  description,
}: RequestCardProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
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
      <div className={S.iconBg}>
        <Icon className={S.icon} />
      </div>
      <div className={S.cardContentContainer}>
        <div className={S.cardTitle}>{title}</div>
        <div className={S.cardDesc}>{description}</div>
      </div>
      {isBlocked && <div className={S.countdownText}>{countdown}</div>}
    </button>
  );
};

export default RequestCard;
