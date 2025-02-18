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
import { Reaction } from '@/core/model';

type EmojiCounterProps = {
  emojiCounts: Record<Reaction, number>;
  reactions: Reaction[];
};

const CHIP_LIST = [
  { type: 'okay', icon: OkayEmoji },
  { type: 'clap', icon: ClapEmoji },
  { type: 'thumb', icon: ThumbEmoji },
  { type: 'scream', icon: ScreamEmoji },
  { type: 'cry', icon: CryEmoji },
  { type: 'like', icon: LikeEmoji },
] as const;

const getEmojiIcon = (reaction: Reaction) =>
  CHIP_LIST.find((chip) => chip.type === reaction)?.icon;

const EmojiCounter = ({ emojiCounts, reactions }: EmojiCounterProps) => {
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

          {reactions.map((reaction, index) => {
            const EmojiComponent = getEmojiIcon(reaction);
            return EmojiComponent ? (
              <ReactionIcon key={index} Emoji={EmojiComponent} />
            ) : null;
          })}
        </>
      )}
    </div>
  );
};

export default EmojiCounter;
