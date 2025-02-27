import S from './ReactionIcon.module.css';
type ReactionIconProps = {
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onAnimatedEnd: () => void;
};

const ReactionIcon = ({ Emoji, onAnimatedEnd }: ReactionIconProps) => {
  return (
    <div className={S.emojiContainer} onAnimationEnd={onAnimatedEnd}>
      <Emoji className={S.emoji} />
    </div>
  );
};

export default ReactionIcon;
