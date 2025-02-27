import { useNavigate } from 'react-router';
import S from './Home.module.css';
import Logo from '@/assets/icons/logo.svg?react';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={S.homeLayout}>
      <Logo className={S.logo} />
      <div className={S.buttonContainer}>
        <button
          type="button"
          className={S.professorButton}
          onClick={() => navigate('/professor/login')}
        >
          교수 페이지로 이동
        </button>
        <button
          type="button"
          className={S.studentButton}
          onClick={() => navigate('/student')}
        >
          학생 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default Home;
