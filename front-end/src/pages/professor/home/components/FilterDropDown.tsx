import { useState, useRef } from 'react';
import S from './FilterDropDown.module.css';
import BottomVector from '@/assets/icons/bottom-vector.svg?react';

type FilterDropDownProps = {
  title: string;
  options: string[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

const FilterDropDown = ({ title, options, setTitle }: FilterDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialTitleRef = useRef(title);

  return (
    <div
      className={S.filterDropDownContainer}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <div
        className={`${S.filterContainer} ${
          title !== initialTitleRef.current ? S.active : ''
        } ${isOpen ? S.open : ''}`}
        onClick={() => {
          if (isOpen) setTitle(initialTitleRef.current);
          setIsOpen((prev) => !prev);
        }}
      >
        <div className={S.filterDropDown}>
          <div className={S.filterDropDownTitle}>
            <span>{title}</span>
            <BottomVector className={S.filterDropDownIcon} />
          </div>
          {isOpen && (
            <div
              className={S.filterDropDownContent}
              onMouseDown={(e) => e.preventDefault()}
            >
              {title !== initialTitleRef.current && (
                <div
                  key="all"
                  className={S.filterDropDownOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTitle(initialTitleRef.current);
                    setIsOpen(false);
                  }}
                >
                  전체
                </div>
              )}
              {options.map((option) => (
                <div
                  key={option}
                  className={S.filterDropDownOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTitle(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterDropDown;
