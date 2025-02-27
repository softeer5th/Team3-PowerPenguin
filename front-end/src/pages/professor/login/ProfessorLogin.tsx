import GoogleLoginButton from './components/GoogleLoginButton';
import S from './ProfessorLogin.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import LoginImage from './assets/professor-login.png';
import Private from './components/Private20250121';
import useModal from '@/hooks/useModal';
import { authRepository } from '@/di';
import { useState } from 'react';

const ProfessorLogin = () => {
  const { Modal, openModal, closeModal } = useModal();
  const [modal, setModal] = useState(false);

  const handleClickPrivate = () => {
    setModal(true);
    openModal();
  };

  const handleLoginGoogle = () => {
    authRepository.login('google');
  };

  return (
    <>
      <div className={S.container}>
        <div className={S.info}>
          <div className={S.logo}>
            <Logo width="100%" height="100%" />
          </div>
          <h1 className={S.mainDescription}>
            함께 만드는 활기찬 강의, <br />
            익명으로 소통하고 참여로 성장하는 수업
          </h1>
          <p className={S.subDescription}>
            대면 강의의 새로운 변화! 실시간 피드백 확인이 가능한 수업 보조
            서비스. <br />
            익명 리액션과 질문으로 누구나 부담 없이 참여하고, 모두 함께 몰입하는
            수업을 경험하세요.
          </p>
        </div>
        <div className={S.divider}>
          <div className={S.loginArea}>
            <div className={S.image}>
              <img src={LoginImage} alt="login" />
            </div>
            <h1 className={S.loginText}>간편하게 시작해 보세요</h1>
            <div className={S.buttonContainer}>
              <GoogleLoginButton onClick={handleLoginGoogle} />
            </div>
          </div>
          <div className={S.private}>
            <button className={S.privateButton} onClick={handleClickPrivate}>
              개인정보 처리방침
            </button>
          </div>
        </div>
      </div>
      {modal && (
        <Modal>
          <Private
            onClose={() => {
              closeModal();
              setModal(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ProfessorLogin;
