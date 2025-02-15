import S from './CourseRequest.module.css';
import { Requests } from '@/core/model';
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

const CourseRequest = ({ requests }: CourseRequestProps) => {
  const sortedRequests = requests.sort((a, b) => b.count - a.count);

  return (
    <div className={S.courseRequest}>
      {sortedRequests.length === 0 ? (
        <div className={S.requestBar}>
          <p>No requests yet</p>
        </div>
      ) : (
        sortedRequests.map((request, index) => (
          <RequestBar
            key={index}
            index={index}
            title={request.type.title}
            Emoji={EmojiType[request.type.kind]}
            count={request.count}
            percentage={(request.count / sortedRequests[0].count) * 100}
          />
        ))
      )}
    </div>
  );
};

export default CourseRequest;
