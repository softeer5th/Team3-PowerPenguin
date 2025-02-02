import S from './DropDown.module.css';
import DownVector from '../../assets/icons/down-vector.svg?react';
import { useState } from 'react';

type DropDownProps = {
  title: string;
  options: string[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

const DropDown = ({ title, options, setTitle }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    setTitle(option);
  };

  return (
    <>
      <div className={S.dropDownContainer}>
        <div
          className={S.titleContainer}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className={S.dropDownTitle}>{title}</div>
          <DownVector />
        </div>
        {isOpen && (
          <ul className={S.labelContainer}>
            {options.map((option) => (
              <li
                key={option}
                className={S.label}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default DropDown;
