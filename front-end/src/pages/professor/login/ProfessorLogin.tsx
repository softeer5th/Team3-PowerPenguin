import { useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import S from './ProfessorLogin.module.css';
import Logo from '../../../assets/icons/logo.svg?react';
import LoginImage from './assets/professor-login.svg?react';
import Private from './components/Private20250121';

const ProfessorLogin = () => {
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);

  const handlePrivateOpen = () => {
    setIsPrivateOpen(true);
  };

  const handlePrivateClose = () => {
    setIsPrivateOpen(false);
  };

  return (
    <>
      <div className={S.container}>
        <div className={S.info}>
          <div className={S.logo}>
            <Logo width="100%" height="auto" />
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
            <LoginImage className={S.image} />
            <h1 className={S.loginText}>간편하게 시작해 보세요</h1>
            <div className={S.buttonContainer}>
              <GoogleLoginButton />
            </div>
          </div>
          <div className={S.private}>
            <button className={S.privateButton} onClick={handlePrivateOpen}>
              개인정보 처리방침
            </button>
          </div>
        </div>
      </div>
      {isPrivateOpen && (
        <div className={S.modal}>
          <Private onClose={handlePrivateClose} />
        </div>
      )}
    </>
  );
};

export default ProfessorLogin;
