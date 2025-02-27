import React from 'react';
import S from './RequestBar.module.css';

type RequestBarProps = {
  title: string;
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  count: number;
  percentage: number;
  isActive?: boolean;
};

const RequestBar = ({
  title,
  Emoji,
  count,
  percentage,
  isActive = false,
}: RequestBarProps) => {
  const displayTitle = title.slice(0, -2);
  return (
    <div className={S.container}>
      <div className={`${S.wrapper} ${isActive && S.active}`}>
        <div
          className={S.percentage}
          style={{ width: `max(${percentage}%, 18px)` }}
        />
        <div className={S.content}>
          <div className={S.main}>
            <div className={S.emojiBackground}>
              <Emoji className={S.emoji} />
            </div>
            <div className={S.title}>
              <span className={S.titleGreen}>{displayTitle}</span>
            </div>
          </div>
          <div className={S.count}>
            <span>{count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBar;
