import React, { useEffect, useRef, useState } from 'react';
import S from './RequestCard.module.css';

type ReactionCardProps = {
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  count: number;
};

const RequestCard = ({
  Emoji,
  title,
  description,
  count,
}: ReactionCardProps) => {
  const [isActive, setIsActive] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsActive(true);
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [count]);

  return (
    <div className={`${S.requestCard} ${isActive ? S.active : ''}`}>
      <div className={S.container}>
        <div className={S.left}>
          <div className={S.emojiContainer}>
            <Emoji className={S.emoji} />
          </div>
          <div className={S.textContainer}>
            <h3 className={S.title}>{title}</h3>
            <p className={S.description}>{description}</p>
          </div>
        </div>
        <div className={S.right}>
          <p className={S.count}>{count}</p>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
