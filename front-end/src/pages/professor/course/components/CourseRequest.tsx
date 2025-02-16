import S from './CourseRequest.module.css';
import {
  Requests,
  RequestFast,
  RequestHard,
  RequestQuestion,
  RequestSize,
  RequestSound,
} from '@/core/model';
import BulbEmoji from '@/assets/icons/bulb-emoji.svg?react';
import EarEmoji from '@/assets/icons/ear-emoji.svg?react';
import MagnifierEmoji from '@/assets/icons/magnifier-emoji.svg?react';
import WindEmoji from '@/assets/icons/wind-emoji.svg?react';
import WishEmoji from '@/assets/icons/wish-emoji.svg?react';
import RequestBar from './RequestBar';

type CourseRequestProps = {
  requests: Requests | [];
};

const EmojiType = {
  hard: WishEmoji,
  fast: WindEmoji,
  question: BulbEmoji,
  size: MagnifierEmoji,
  sound: EarEmoji,
};

const getRequestPercentage = (count: number, max: number) => {
  if (max === 0) return 0;
  return (count / max) * 100;
};

const CourseRequest = ({ requests }: CourseRequestProps) => {
  const sortedRequests = requests.sort((a, b) => b.count - a.count);

  return (
    <div className={S.courseRequest}>
      {sortedRequests.length === 0 ? (
        <>
          <RequestBar
            index={0}
            title={RequestSize.title}
            Emoji={EmojiType.size}
            count={0}
            percentage={0}
          />
          <RequestBar
            index={1}
            title={RequestQuestion.title}
            Emoji={EmojiType.question}
            count={0}
            percentage={0}
          />
          <RequestBar
            index={2}
            title={RequestHard.title}
            Emoji={EmojiType.hard}
            count={0}
            percentage={0}
          />
          <RequestBar
            index={3}
            title={RequestSound.title}
            Emoji={EmojiType.sound}
            count={0}
            percentage={0}
          />
          <RequestBar
            index={4}
            title={RequestFast.title}
            Emoji={EmojiType.fast}
            count={0}
            percentage={0}
          />
        </>
      ) : (
        sortedRequests.map((request, index) => (
          <RequestBar
            key={index}
            index={index}
            title={request.type.title}
            Emoji={EmojiType[request.type.kind]}
            count={request.count}
            percentage={getRequestPercentage(
              request.count,
              sortedRequests[0].count
            )}
          />
        ))
      )}
    </div>
  );
};

export default CourseRequest;
