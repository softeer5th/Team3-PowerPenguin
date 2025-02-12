import { useEffect, useRef, useState } from 'react';
import S from './ProfessorProfile.module.css';
import { authRepository, professorRepository } from '../../../../di';
import BasicProfile from '../../../../assets/icons/basic-profile.svg?react';
import TextButton from '../../../../components/button/text/TextButton';
import { validateImage } from '../../../../utils/util';
import useModal from '../../../../hooks/useModal';
import AlertModal from '../../../../components/modal/AlertModal';

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
    profileImage: string;
    name: string;
  }>({
    profileImage: '',
    name: '',
  });
  const [isEdit, setIsEdit] = useState({
    profile: false,
    name: false,
  });
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  const userEmail = useRef('');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const { openModal, closeModal, Modal } = useModal();

  useEffect(() => {
    professorRepository.getProfessor().then((response) => {
      setProfile({
        profileImage: response.profileURL,
        name: response.name,
      });

      userEmail.current = response.email;
    });
  }, []);

  const handleClickEdit = (type: 'profile' | 'name') => {
    try {
      if (type === 'profile') {
        if (!profile.profileImage) {
          alert('프로필 사진을 선택해 주세요.');
          return;
        }
        fetch(profile.profileImage)
          .then((response) => response.blob())
          .then((blob) => new File([blob], 'profile.jpg', { type: blob.type }))
          .then((file) => {
            professorRepository.updateProfessorProfile(file);
            setIsEdit({ ...isEdit, profile: false });
          });
      } else if (type === 'name') {
        professorRepository.updateProfessorName(profile.name);
        setIsEdit({ ...isEdit, name: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCancel = (type: 'profile' | 'name') => {
    if (type === 'profile') {
      setIsEdit({ ...isEdit, profile: false });
    } else if (type === 'name') {
      setIsEdit({ ...isEdit, name: false });
    }
  };

  const handleUpdateProfileImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      if (validateImage(files[0])) {
        if (profile.profileImage.startsWith('blob:')) {
          URL.revokeObjectURL(profile.profileImage);
        }
        setProfile({ ...profile, profileImage: URL.createObjectURL(files[0]) });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (profile.profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profile.profileImage);
      }
    };
  }, [profile.profileImage]);

  const offModal = () => {
    setModal(null);
    closeModal();
  };

  const handleClickLogoutButton = () => {
    setModal(
      <AlertModal
        type="ask"
        message="정말 로그아웃하시겠습니까?"
        description="언제든지 다시 로그인 할 수 있습니다. 로그아웃 하시겠습니까?"
        buttonText="로그아웃 하기"
        onClickModalButton={() => {
          authRepository.logout();
          offModal();
        }}
        onClickCloseButton={closeModal}
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
        onClickModalButton={() => {
          professorRepository.deleteProfessor();
          offModal();
        }}
        onClickCloseButton={closeModal}
      />
    );
    openModal();
  };

  return (
    <>
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
                      {profile.profileImage ? (
                        <img src={profile.profileImage} alt="profile" />
                      ) : (
                        <BasicProfile />
                      )}
                    </div>
                    {isEdit.profile && (
                      <>
                        <input
                          className={S.profileInput}
                          type="file"
                          accept="image/*"
                          ref={profileInputRef}
                          onChange={(event) => handleUpdateProfileImage(event)}
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
                      </>
                    )}
                  </div>
                  <div className={S.profileButtonContainer}>
                    {isEdit.profile ? (
                      createEditButton({
                        onEdit: () => handleClickEdit('profile'),
                        onCancel: () => handleClickCancel('profile'),
                      })
                    ) : (
                      <TextButton
                        color="white"
                        size="web3"
                        width="91px"
                        height="53px"
                        text="수정"
                        onClick={() => setIsEdit({ ...isEdit, profile: true })}
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
                        onEdit: () => handleClickEdit('name'),
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
      {modal && <Modal>{modal}</Modal>}
    </>
  );
};

export default ProfessorProfile;
