import { useEffect, useState } from 'react';
import S from './ReactCard.module.css';
import { Reaction } from '@/core/model';
import useTemporaryState from '@/hooks/useTemporaryState';

type ReactCardProps = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onCardClick: () => Promise<boolean>;
  type: Reaction;
};

const ReactCard = ({ type, Icon, onCardClick }: ReactCardProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const {
    isActive: isBlocked,
    countdown,
    trigger,
  } = useTemporaryState({
    storageKey: `reactions_block_${type}`,
    duration: 10,
  });

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
      trigger();
    }
  };

  return (
    <button
      className={`${S.cardContainer} ${isSelected ? S.active : ''} ${isBlocked ? S.blocked : ''} `}
      disabled={!!isSelected || isBlocked}
      onClick={() => setIsSelected(true)}
      onAnimationEnd={handleButtonClick}
    >
      <Icon className={S.icon}></Icon>
      {isBlocked && <div className={S.countdownText}>{countdown}</div>}
    </button>
  );
};

export default ReactCard;
