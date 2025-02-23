import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import S from './ProfessorProfile.module.css';
import { professorRepository } from '@/di';
import BasicProfile from '@/assets/icons/basic-profile.svg?react';
import TextButton from '@/components/button/text/TextButton';
import { validateImage } from '@/utils/util';
import AlertModal from '@/components/modal/AlertModal';
import { OutletContext } from '../layout/ProfessorHomeLayout';

const createEditButton = ({
  onEdit,
  onCancel,
}: {
  onEdit: () => void;
  onCancel: () => void;
}) => {
  return (
    <>
      <TextButton
        color="white"
        size="web3"
        width="91px"
        height="53px"
        text="확인"
        onClick={onEdit}
      />
      <TextButton
        color="gray"
        size="web3"
        width="91px"
        height="53px"
        text="취소"
        onClick={onCancel}
      />
    </>
  );
};

const ProfessorProfile = () => {
  const [profile, setProfile] = useState<{
    profileImage: HTMLImageElement | null;
    name: string;
  }>({
    profileImage: null,
    name: '',
  });
  const [isEdit, setIsEdit] = useState({
    profileImage: false,
    name: false,
  });
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(
    null
  );

  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const userName = useRef('');
  const userEmail = useRef('');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const { openModal, closeModal, setModal, popupError } =
    useOutletContext<OutletContext>();

  useEffect(() => {
    async function getProfessor() {
      try {
        const response = await professorRepository.getProfessor();
        let img: HTMLImageElement | null = null;
        if (response.profileURL && response.profileURL !== '') {
          img = new Image();
          img.src = response.profileURL;
          profileImageRef.current = img;
        }
        setProfile({
          profileImage: img,
          name: response.name,
        });
        userName.current = response.name;
        userEmail.current = response.email;
      } catch (error) {
        popupError(error);
      }
    }
    getProfessor();
  }, []);

  useEffect(() => {
    return () => {
      if (profile.profileImage?.src.startsWith('blob:')) {
        URL.revokeObjectURL(profile.profileImage.src);
      }
    };
  }, [profile.profileImage]);

  const handleEditProfile = async () => {
    try {
      const newProfileURL =
        await professorRepository.updateProfessorProfile(selectedProfileFile);
      if (newProfileURL !== '') {
        const img = new Image();
        img.src = newProfileURL;
        profileImageRef.current = img;
      } else {
        profileImageRef.current = null;
      }
      setSelectedProfileFile(null);
      setProfile({
        ...profile,
        profileImage: profileImageRef.current,
      });
      setIsEdit({ ...isEdit, profileImage: false });
    } catch (error) {
      popupError(error);
    }
  };

  const handleEditName = async () => {
    try {
      const newName = await professorRepository.updateProfessorName(
        profile.name
      );
      userName.current = newName;
      setProfile({ ...profile, name: userName.current });
      setIsEdit({ ...isEdit, name: false });
    } catch (error) {
      popupError(error);
    }
  };

  const handleUpdateProfileImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = event.target.files;
      if (files && files[0]) {
        validateImage(files[0]);

        if (profile.profileImage?.src.startsWith('blob:')) {
          URL.revokeObjectURL(profile.profileImage.src);
        }

        const file = files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        setProfile({ ...profile, profileImage: img });
        setSelectedProfileFile(file);
        event.target.value = '';
      }
    } catch (error) {
      popupError(error);
    }
  };

  const handleClickCancel = (type: 'profile' | 'name') => {
    if (type === 'profile') {
      setIsEdit({ ...isEdit, profileImage: false });
      setProfile({
        ...profile,
        profileImage: profileImageRef.current,
      });
      setSelectedProfileFile(null);
    } else if (type === 'name') {
      setIsEdit({ ...isEdit, name: false });
      setProfile({ ...profile, name: userName.current });
    }
  };

  const offModal = () => {
    closeModal();
    setModal(null);
  };

  const handleClickLogoutButton = () => {
    setModal(
      <AlertModal
        type="ask"
        message="정말 로그아웃하시겠습니까?"
        description="언제든지 다시 로그인 할 수 있습니다. 로그아웃 하시겠습니까?"
        buttonText="로그아웃 하기"
        onClickModalButton={async () => {
          try {
            await professorRepository.logout();
          } catch (error) {
            popupError(error);
          }
        }}
        onClickCloseButton={offModal}
      />
    );

    openModal();
  };

  const handleClickDeleteAccountButton = () => {
    setModal(
      <AlertModal
        type="caution"
        message="정말 탈퇴하시겠습니까?"
        description="모든 데이터가 삭제되며 취소할 수 없습니다. 정말 탈퇴하시겠습니까?"
        buttonText="회원탈퇴하기"
        onClickModalButton={async () => {
          try {
            await professorRepository.deleteProfessor();
          } catch (error) {
            popupError(error);
          }
        }}
        onClickCloseButton={offModal}
      />
    );

    openModal();
  };

  return (
    <div className={S.background}>
      <div className={S.container}>
        <div className={S.contentContainer}>
          <h2 className={S.title}>계정 정보</h2>
          <div className={S.content}>
            <div className={S.profileContent}>
              <h3 className={S.subTitle}>프로필 사진</h3>
              <div className={S.profileWrapper}>
                <div className={S.profileImageContainer}>
                  <div className={S.profileImage}>
                    {profile.profileImage && profile.profileImage.src !== '' ? (
                      <img src={profile.profileImage.src} alt="profile" />
                    ) : (
                      <BasicProfile />
                    )}
                  </div>
                  {isEdit.profileImage && (
                    <>
                      <input
                        className={S.profileInput}
                        type="file"
                        accept="image/*"
                        ref={profileInputRef}
                        onChange={handleUpdateProfileImage}
                      />
                      <TextButton
                        color="white"
                        size="web3"
                        width="182px"
                        height="53px"
                        text="다시 고르기"
                        onClick={(event: React.MouseEvent) => {
                          event.preventDefault();
                          profileInputRef.current?.click();
                        }}
                      />
                      <TextButton
                        color="red"
                        size="web3"
                        width="93px"
                        height="53px"
                        text="삭제"
                        onClick={() => {
                          setProfile({ ...profile, profileImage: null });
                          setSelectedProfileFile(null);
                        }}
                      />
                    </>
                  )}
                </div>
                <div className={S.profileButtonContainer}>
                  {isEdit.profileImage ? (
                    createEditButton({
                      onEdit: () => handleEditProfile(),
                      onCancel: () => handleClickCancel('profile'),
                    })
                  ) : (
                    <TextButton
                      color="white"
                      size="web3"
                      width="91px"
                      height="53px"
                      text="수정"
                      onClick={() =>
                        setIsEdit({ ...isEdit, profileImage: true })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={S.profileContent}>
              <h3 className={S.subTitle}>사용자 이름</h3>
              <div className={S.profileWrapper}>
                {isEdit.name ? (
                  <input
                    className={S.text}
                    type="text"
                    value={profile.name}
                    onChange={(event) =>
                      setProfile({ ...profile, name: event.target.value })
                    }
                  />
                ) : (
                  <span className={S.text}>{profile.name}</span>
                )}
                <div className={S.profileButtonContainer}>
                  {isEdit.name ? (
                    createEditButton({
                      onEdit: () => handleEditName(),
                      onCancel: () => handleClickCancel('name'),
                    })
                  ) : (
                    <TextButton
                      color="white"
                      size="web3"
                      width="91px"
                      height="53px"
                      text="수정"
                      onClick={() => setIsEdit({ ...isEdit, name: true })}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={S.profileContent}>
              <h3 className={S.subTitle}>이메일 주소</h3>
              <span className={S.text}>{userEmail.current}</span>
            </div>
          </div>
        </div>
        <div className={S.contentContainer}>
          <h2 className={S.title}>계정 관리</h2>
          <div className={S.content}>
            <div className={S.profileContent}>
              <div className={S.profileWrapper}>
                <div className={S.accountContentText}>
                  <h3 className={S.subTitle}>로그아웃</h3>
                  <span className={S.subDescription}>
                    언제든지 다시 이메일로 로그인 할 수 있습니다
                  </span>
                </div>
                <TextButton
                  color="white"
                  size="web3"
                  width="185px"
                  height="53px"
                  text="로그아웃"
                  onClick={handleClickLogoutButton}
                />
              </div>
            </div>
            <div className={S.profileContent}>
              <div className={S.profileWrapper}>
                <div className={S.accountContentText}>
                  <h3 className={S.subTitle}>회원탈퇴</h3>
                  <span className={S.subDescription}>
                    탈퇴시 모든 데이터가 삭제되며 취소할 수 없습니다
                  </span>
                </div>
                <TextButton
                  color="red"
                  size="web3"
                  width="185px"
                  height="53px"
                  text="회원탈퇴"
                  onClick={handleClickDeleteAccountButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;
