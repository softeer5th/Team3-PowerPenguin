import { useEffect, useState } from 'react';
import S from './ReactCard.module.css';
import useBlockTimer from '@/hooks/useBlockTimer';
import { Reaction } from '@/core/model';

type ReactCardProps = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onCardClick: () => Promise<boolean>;
  type: Reaction;
};

const ReactCard = ({ type, Icon, onCardClick }: ReactCardProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const { isBlocked, countdown, startBlock } = useBlockTimer(
    `reactions_block_${type}`,
    10000,
    2000
  );

  useEffect(() => {
    if (isBlocked) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [isBlocked]);

  const handleButtonClick = async () => {
    const success = await onCardClick();
    if (success) {
      setIsSelected(true);
      startBlock();
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
