import S from './ModalInput.module.css';

type ModalInputProps = {
  size?: 'half' | 'full';
  title: string;
  desc?: string;
  placeholder: string;
  value: string;
  onInputChange: (value: string) => void;
  onBlur?: () => void;
};

const ModalInput = ({
  size = 'half',
  title,
  desc,
  placeholder,
  value,
  onInputChange,
  onBlur,
}: ModalInputProps) => {
  return (
    <div className={S.inputContainer}>
      <div className={S.inputTitle}>{title}</div>
      <input
        className={`${S.input} ${size === 'full' && S.full} ${desc && S.withDesc}`}
        placeholder={placeholder}
        value={value}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        onChange={(e) => onInputChange(e.target.value)}
        onBlur={onBlur}
      />
      {size === 'half' && desc && <div className={S.inputDesc}>{desc}</div>}
    </div>
  );
};

export default ModalInput;
