import S from './ReactionIcon.module.css';
type ReactionIconProps = {
  Emoji: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const ReactionIcon = ({ Emoji }: ReactionIconProps) => {
  return (
    <div className={S.emojiContainer}>
      <Emoji className={S.emoji} />
    </div>
  );
};

export default ReactionIcon;
