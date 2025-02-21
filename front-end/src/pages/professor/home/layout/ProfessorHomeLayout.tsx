import { ReactNode, useEffect, useState } from 'react';
import {
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router';
import S from './ProfessorHomeLayout.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import BasicProfile from '@/assets/icons/basic-profile.svg?react';
import SearchIcon from '@/assets/icons/Search.svg?react';
import CloseIcon from '@/assets/icons/close.svg?react';
import { professorRepository } from '@/di';
import useModal from '@/hooks/useModal';
import ProfessorError from '@/pages/professor/professorError';

export type OutletContext = {
  openModal: () => void;
  closeModal: () => void;
  setModal: React.Dispatch<React.SetStateAction<ReactNode>>;
  navigate: NavigateFunction;
  popupError: (error: unknown) => void;
};

const ProfessorHomeLayout = () => {
  const [searchParams] = useSearchParams('');
  const keyword = searchParams.get('keyword') || '';
  const [search, setSearch] = useState(keyword);
  const [profile, setProfile] = useState<HTMLImageElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ReactNode | null>(null);
  const { openModal, closeModal, Modal } = useModal();
  const { popupError, ErrorModal } = ProfessorError();

  const handleClickLogo = () => {
    setSearch('');
    navigate('/professor');
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDeleteSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSearch('');
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (search.trim() !== '') {
        if (search.trim() === keyword) {
          return;
        }
        navigate(`/professor/search/?keyword=${search}`);
      }
    } else if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  };

  const handleClickProfile = () => {
    navigate('/professor/profile');
  };

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await professorRepository.getProfessorProfile();
        if (res) {
          const img = new Image();
          img.src = res;
          img.onload = () => {
            setProfile(img);
          };
        }
      } catch (error) {
        popupError(error);
      }
    }

    getProfile();
  }, []);

  return (
    <>
      <div className={S.gnb}>
        <div className={S.left}>
          <button className={S.logoButton} onClick={handleClickLogo}>
            <Logo className={S.logo} />
          </button>
          <div className={S.inputContainer}>
            <input
              className={S.input}
              type="text"
              placeholder="수업 이름이나 코드로 수업을 검색해보세요"
              value={search}
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyDown}
            />
            {search ? (
              <button
                className={S.searchButton}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  handleDeleteSearch(e);
                }}
              >
                <CloseIcon className={S.closeIcon} />
              </button>
            ) : (
              <div className={S.searchButton}>
                <SearchIcon className={S.searchIcon} />
              </div>
            )}
          </div>
        </div>
        {location.pathname !== '/professor/profile' && (
          <button className={S.profile} onClick={handleClickProfile}>
            {profile ? (
              <img className={S.profileImage} src={profile.src} alt="profile" />
            ) : (
              <BasicProfile className={S.profileImage} />
            )}
          </button>
        )}
      </div>
      <div className={S.container}>
        <Outlet
          context={{ openModal, closeModal, setModal, navigate, popupError }}
        />
      </div>
      {modal && <Modal>{modal}</Modal>}
      <ErrorModal />
    </>
  );
};

export default ProfessorHomeLayout;
