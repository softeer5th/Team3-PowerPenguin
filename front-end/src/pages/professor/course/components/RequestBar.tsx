import React from 'react';
import S from './RequestBar.module.css';

type RequestBarProps = {
  index: number;
  title: string;
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  count: number;
  percentage: number;
};

type RequestBarContentProps = {
  title: string;
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  count: number;
};

const RequestBarContent = ({ title, Emoji, count }: RequestBarContentProps) => {
  return (
    <div className={S.content}>
      <div className={S.main}>
        <div className={S.emojiBackground}>
          <Emoji className={S.emoji} />
        </div>
        <div className={S.title}>
          <span className={S.titleGreen}>{title}</span>
        </div>
      </div>
      <div className={S.count}>
        <span>{count}</span>
      </div>
    </div>
  );
};

const RequestBar = ({
  index,
  title,
  Emoji,
  count,
  percentage,
}: RequestBarProps) => {
  const displayTitle = title.slice(0, -2);
  return (
    <div className={`${S.requestBar} ${index < 2 && S.active}`}>
      <div
        className={S.percentage}
        style={{ width: `max(${percentage}%, 18px)` }}
      >
        <RequestBarContent title={displayTitle} Emoji={Emoji} count={count} />
      </div>
      <RequestBarContent title={displayTitle} Emoji={Emoji} count={count} />
    </div>
  );
};

export default RequestBar;
