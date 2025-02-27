import {
  Requests,
  RequestHard,
  RequestFast,
  RequestQuestion,
  RequestSize,
  RequestSound,
} from '@/core/model';
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
  [RequestHard.kind]: WishEmoji,
  [RequestFast.kind]: WindEmoji,
  [RequestQuestion.kind]: BulbEmoji,
  [RequestSize.kind]: MagnifierEmoji,
  [RequestSound.kind]: EarEmoji,
};

const RequestBox = ({ request }: RequestBoxProps) => {
  return request.length === 0 ? (
    <div className={S.container}>
      <RequestCard
        Emoji={WishEmoji}
        title={RequestHard.title}
        description={RequestHard.description}
        count={0}
      />
      <RequestCard
        Emoji={WindEmoji}
        title={RequestFast.title}
        description={RequestFast.description}
        count={0}
      />
      <RequestCard
        Emoji={BulbEmoji}
        title={RequestQuestion.title}
        description={RequestQuestion.description}
        count={0}
      />
      <RequestCard
        Emoji={MagnifierEmoji}
        title={RequestSize.title}
        description={RequestSize.description}
        count={0}
      />
      <RequestCard
        Emoji={EarEmoji}
        title={RequestSound.title}
        description={RequestSound.description}
        count={0}
      />
      <div className={S.popup}>
        <span>오늘 누적 반응 학생 수</span>
      </div>
    </div>
  ) : (
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
