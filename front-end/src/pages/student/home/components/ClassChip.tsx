import S from './ClassChip.module.css';

type ClassChipProps = {
  text: string;
};

const handleChipColor = (text: string) => {
  if (text === '교양') {
    return 'green';
  } else if (text === '전공') {
    return 'purple';
  } else {
    return 'gray';
  }
};

const ClassChip = ({ text }: ClassChipProps) => {
  const bgClass = S[handleChipColor(text)] || '';

  return <div className={`${S.chipContainer}  ${bgClass} } `}>{text}</div>;
};

export default ClassChip;
