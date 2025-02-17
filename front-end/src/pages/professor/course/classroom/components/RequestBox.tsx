import { Requests } from '@/core/model';
import S from './RequestBox.module.css';
import BulbEmoji from '@/assets/icons/bulb-emoji.svg?react';
import EarEmoji from '@/assets/icons/ear-emoji.svg?react';
import MagnifierEmoji from '@/assets/icons/magnifier-emoji.svg?react';
import WindEmoji from '@/assets/icons/wind-emoji.svg?react';
import WishEmoji from '@/assets/icons/wish-emoji.svg?react';
import RequestCard from './RequestCard';

type RequestBoxProps = {
  request: Requests | [];
};

const EmojiType = {
  hard: WishEmoji,
  fast: WindEmoji,
  question: BulbEmoji,
  size: MagnifierEmoji,
  sound: EarEmoji,
};

const RequestBox = ({ request }: RequestBoxProps) => {
  return (
    <div className={S.container}>
      {request.map((request, index) => (
        <RequestCard
          key={`${index}-${request.type.kind}`}
          Emoji={EmojiType[request.type.kind]}
          title={request.type.title}
          description={request.type.description}
          count={request.count}
        />
      ))}
      <div className={S.popup}>
        <span>오늘 누적 반응 학생 수</span>
      </div>
    </div>
  );
};

export default RequestBox;
