import { Outlet } from 'react-router';
import S from './ProfessorHomeLayout.module.css';
import Logo from '../../../../assets/icons/logo.svg?react';
import BasicProfile from '../../../../assets/icons/basic-profile.svg?react';
import SearchIcon from '../../../../assets/icons/Search.svg?react';
import CloseIcon from '../../../../assets/icons/close.svg?react';
import { useState } from 'react';

const ProfessorHomeLayout = () => {
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState<HTMLImageElement | null>(null);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDeleteSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSearch('');
  };

  return (
    <>
      <div className={S.gnb}>
        <div className={S.left}>
          <Logo className={S.logo} />
          <div className={S.inputContainer}>
            <input
              className={S.input}
              type="text"
              placeholder="수업 이름이나 코드로 수업을 검색해보세요"
              value={search}
              onChange={handleSearchInput}
            />
            {search ? (
              <button
                className={S.searchButton}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteSearch(e);
                }}
              >
                <CloseIcon className={S.closeIcon} />
              </button>
            ) : (
              <div
                className={S.searchButton}
                onMouseDown={(e) => e.preventDefault()}
              >
                <SearchIcon className={S.searchIcon} />
              </div>
            )}
          </div>
        </div>
        <div className={S.profile}>
          {profile ? (
            <img className={S.profileImage} src={profile.src} alt="profile" />
          ) : (
            <BasicProfile className={S.profileImage} />
          )}
        </div>
      </div>
      <div className={S.container}>
        <Outlet />
      </div>
    </>
  );
};

export default ProfessorHomeLayout;
