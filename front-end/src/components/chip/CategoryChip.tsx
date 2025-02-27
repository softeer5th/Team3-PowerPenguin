import S from './CategoryChip.module.css';

type CategoryChipProps = {
  color: 'green' | 'purple' | 'gray';
  text: string;
  isActive: boolean;
};

const CategoryChip = ({ color, text, isActive }: CategoryChipProps) => {
  const bgClass = S[color] || '';
  return (
    <div className={`${S.chipContainer} ${isActive ? bgClass : ''} `}>
      {text}
    </div>
  );
};

export default CategoryChip;
