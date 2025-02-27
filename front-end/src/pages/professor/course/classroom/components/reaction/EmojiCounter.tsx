import S from './EmojiCounter.module.css';
import { useState } from 'react';
import OkayEmoji from '@/assets/icons/okay-emoji.svg?react';
import ClapEmoji from '@/assets/icons/clap-emoji.svg?react';
import ThumbEmoji from '@/assets/icons/thumb-up-emoji.svg?react';
import LikeEmoji from '@/assets/icons/heart-emoji.svg?react';
import ScreamEmoji from '@/assets/icons/scream-emoji.svg?react';
import CryEmoji from '@/assets/icons/cry-emoji.svg?react';
import EmojiChip from './EmojiChip';
import ToggleButton from '@/components/toggle/ToggleButton';
import ReactionIcon from './ReactionIcon';
import { Reaction, ReactionType } from '@/core/model';
import { Action } from '../../ProfessorClassroom';

type EmojiCounterProps = {
  emojiCounts: Record<Reaction, number>;
  reactions: ReactionType[];
  dispatch: React.Dispatch<Action>;
};

const CHIP_LIST = [
  { type: 'OKAY', icon: OkayEmoji },
  { type: 'CLAP', icon: ClapEmoji },
  { type: 'THUMBS_UP', icon: ThumbEmoji },
  { type: 'SURPRISED', icon: ScreamEmoji },
  { type: 'CRYING', icon: CryEmoji },
  { type: 'HEART_EYES', icon: LikeEmoji },
] as const;

const getEmojiIcon = (reaction: ReactionType) =>
  CHIP_LIST.find((chip) => chip.type === reaction.type)?.icon;

const EmojiCounter = ({
  emojiCounts,
  reactions,
  dispatch,
}: EmojiCounterProps) => {
  const [isOpenCounter, setIsOpenCounter] = useState(true);

  const handleToggle = () => setIsOpenCounter((prev) => !prev);

  return (
    <div
      className={`${S.counterContainer} ${isOpenCounter ? S.fullContainer : ''}`}
    >
      <ToggleButton isOn={isOpenCounter} onToggle={handleToggle} />
      <div className={S.counterText}>Live emoji counter</div>

      {isOpenCounter && (
        <>
          <div className={S.emojiContainer}>
            {CHIP_LIST.map(({ type, icon }) => (
              <EmojiChip key={type} Emoji={icon} count={emojiCounts[type]} />
            ))}
          </div>

          {reactions.map((reaction) => {
            const EmojiComponent = getEmojiIcon(reaction);
            return EmojiComponent ? (
              <ReactionIcon
                key={reaction.id}
                Emoji={EmojiComponent}
                onAnimatedEnd={() =>
                  dispatch({ type: 'REMOVE', payload: reaction.id })
                }
              />
            ) : null;
          })}
        </>
      )}
    </div>
  );
};

export default EmojiCounter;
