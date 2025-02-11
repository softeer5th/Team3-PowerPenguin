import S from './ModalInput.module.css';

type ModalInputProps = {
  size?: 'half' | 'full';
  title: string;
  desc?: string;
  placeholder: string;
  value: string;
  onInputChange: (value: string) => void;
};

const ModalInput = ({
  size = 'half',
  title,
  desc,
  placeholder,
  value,
  onInputChange,
}: ModalInputProps) => {
  return (
    <div className={S.inputContainer}>
      <div className={S.inputTitle}>{title}</div>
      <input
        className={`${S.input} ${size === 'full' ? S.full : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
      />
      {desc && <div className={S.inputDesc}>{desc}</div>}
    </div>
  );
};

export default ModalInput;
