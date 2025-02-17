import S from './EmojiChip.module.css';

type EmojiChipProps = {
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  count: number;
};

const EmojiChip = ({ Emoji, count }: EmojiChipProps) => {
  const handleCount = (count: EmojiChipProps['count']) => {
    if (count > 99) {
      return '99+';
    }
    return count;
  };

  return (
    <div className={S.chipContainer}>
      <Emoji className={S.chipEmoji} />
      <span className={S.chipCount}>{handleCount(count)}</span>
    </div>
  );
};

export default EmojiChip;
