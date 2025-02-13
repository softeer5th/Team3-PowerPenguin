import S from './DropDown.module.css';
import DownVector from '@/assets/icons/down-vector.svg?react';
import { useState } from 'react';

type DropDownProps = {
  width: string;
  title: string;
  options: string[];
  setTitle: (value: string) => void;
};

const DropDown = ({ width, title, options, setTitle }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    setTitle(option);
  };

  return (
    <div
      className={`${S.dropDown} ${isOpen ? S.dropDownActive : ''}`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      style={{ width: width }}
    >
      <div
        className={S.dropDownWrapper}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={S.dropDownContainer}>
          <div className={S.titleContainer}>
            <span className={S.dropDownTitle}>{isOpen ? '   ' : title}</span>
            <DownVector className={S.dropDownIcon} />
          </div>
          {isOpen && (
            <ul className={S.labelContainer}>
              {options.map((option) => (
                <li
                  key={option}
                  className={S.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(option);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropDown;
