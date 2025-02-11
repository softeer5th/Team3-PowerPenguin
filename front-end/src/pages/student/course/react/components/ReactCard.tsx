import { useState } from 'react';
import S from './ReactCard.module.css';
import useBlockTimer from '../../../../../hooks/useBlockTimer';

type ReactCardProps = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onCardClick: () => Promise<boolean>;
};

const ReactCard = ({ Icon, onCardClick }: ReactCardProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { isBlocked, countdown } = useBlockTimer(
    isSelected,
    setIsSelected,
    10000,
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
      disabled={!!isSelected || isBlocked}
      onClick={handleButtonClick}
    >
      <Icon className={S.icon}></Icon>
      {isBlocked && <div className={S.countdownText}>{countdown}</div>}
    </button>
  );
};

export default ReactCard;
