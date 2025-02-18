import S from './ReactionModal.module.css';
import OkayEmoji from '@/assets/icons/okay-emoji.svg?react';
import ClapEmoji from '@/assets/icons/clap-emoji.svg?react';
import ThumbEmoji from '@/assets/icons/thumb-up-emoji.svg?react';
import LikeEmoji from '@/assets/icons/heart-emoji.svg?react';
import ScreamEmoji from '@/assets/icons/scream-emoji.svg?react';
import CryEmoji from '@/assets/icons/cry-emoji.svg?react';
import GoldIcon from '@/assets/icons/gold.svg?react';
import CloseIcon from '@/assets/icons/close.svg?react';

const emojiType = {
  okay: OkayEmoji,
  clap: ClapEmoji,
  thumb: ThumbEmoji,
  scream: ScreamEmoji,
  cry: CryEmoji,
  like: LikeEmoji,
} as const;

type ReactionModalProps = {
  firstReaction: keyof typeof emojiType;
  firstReactionCount: number;
  secondReaction: keyof typeof emojiType;
  secondReactionCount: number;
  thirdReaction: keyof typeof emojiType;
  thirdReactionCount: number;
  onClose: () => void;
};

const EmojiContainer = ({
  emoji,
  count,
  rank,
}: {
  emoji: keyof typeof emojiType;
  count: number;
  rank: number;
}) => {
  const Emoji = emojiType[emoji];
  return (
    <div className={`${S.emojiContainer} ${S[`rank${rank}`]}`}>
      <div className={S.emojiWrapper}>
        <div className={S.emojiBackground}>
          <Emoji className={S.emoji} />
        </div>
        {rank === 1 ? (
          <GoldIcon className={S.rank} />
        ) : (
          <div className={S.rank}>
            <span>{rank}</span>
          </div>
        )}
      </div>
      <span className={S.count}>총 {count}회</span>
    </div>
  );
};

const ReactionModal = ({
  firstReaction,
  firstReactionCount,
  secondReaction,
  secondReactionCount,
  thirdReaction,
  thirdReactionCount,
  onClose,
}: ReactionModalProps) => {
  return (
    <div className={S.reactionModal}>
      <button className={S.closeButton} onClick={onClose}>
        <CloseIcon className={S.closeIcon} />
      </button>
      <span className={S.title}>TOP 3</span>
      <div className={S.subTitle}>
        <span>오늘 가장 많이 사용된 이모지</span>
      </div>
      <EmojiContainer
        emoji={firstReaction}
        count={firstReactionCount}
        rank={1}
      />
      <EmojiContainer
        emoji={secondReaction}
        count={secondReactionCount}
        rank={2}
      />
      <EmojiContainer
        emoji={thirdReaction}
        count={thirdReactionCount}
        rank={3}
      />
    </div>
  );
};

export default ReactionModal;
