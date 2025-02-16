import S from './ToggleButton.module.css';

type ToggleButtonProps = {
  isOn: boolean;
  onToggle: () => void;
};

const ToggleButton = ({ isOn, onToggle }: ToggleButtonProps) => {
  return (
    <div className={S.toggleButton}>
      <label className={S.switch} onClick={onToggle}>
        <input
          type="checkbox"
          checked={!isOn}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
        <span className={S.slider}></span>
      </label>
    </div>
  );
};

export default ToggleButton;
