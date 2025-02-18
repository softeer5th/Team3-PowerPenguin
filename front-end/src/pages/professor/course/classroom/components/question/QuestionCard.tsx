import TextButton from '@/components/button/text/TextButton';
import S from './QuestionCard.module.css';
import ExpandSvg from '@/assets/icons/expansion.svg?react';

type QuestionCardProps = {
  question: string;
  onModalOpen: () => void;
  onResolveClick: () => void;
};

const QuestionCard = ({
  question,
  onModalOpen,
  onResolveClick,
}: QuestionCardProps) => {
  return (
    <div className={S.questionContainer}>
      <div className={S.questionMessage}>{question}</div>
      <div className={S.buttonContainer}>
        <TextButton
          type="button"
          color="green"
          size="web3"
          width="382px"
          height="48px"
          text="질문이 해결되었어요"
          onClick={onResolveClick}
        />
        <button className={S.expandButton} onClick={onModalOpen}>
          <ExpandSvg className={S.expandSvg} />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
