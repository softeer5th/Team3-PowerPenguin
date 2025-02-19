import { ReactNode, useEffect, useState } from 'react';
import {
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
import { ClientError, ServerError } from '@/core/errorType';
import useModal from '@/hooks/useModal';
import AlertModal from '@/components/modal/AlertModal';
import PopupModal from '@/components/modal/PopupModal';

export type OutletContext = {
  openModal: () => void;
  closeModal: () => void;
  setModal: (modal: React.ReactNode | null) => void;
  navigate: (path: string) => void;
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
        console.log('Search triggered:', search);
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
        if (error instanceof ClientError || error instanceof ServerError) {
          if (error.errorCode === 'USER_NOT_FOUND') {
            setModal(
              <AlertModal
                type="caution"
                message={error.message}
                description="로그인 페이지로 이동합니다."
                buttonText="확인"
                onClickModalButton={() => navigate('/professor/login')}
              />
            );
            openModal();
          } else {
            setModal(
              <PopupModal
                type="caution"
                title="오류가 발생했습니다."
                description="다시 시도해주세요."
              />
            );

            openModal();
            setTimeout(() => {
              closeModal();
              setModal(null);
            }, 2000);
          }
        } else {
          setModal(
            <PopupModal
              type="caution"
              title="오류가 발생했습니다."
              description="다시 시도해주세요."
            />
          );
          openModal();

          setTimeout(() => {
            closeModal();
            setModal(null);
          }, 2000);
        }
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
        <Outlet context={{ openModal, closeModal, setModal, navigate }} />
      </div>
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorHomeLayout;
