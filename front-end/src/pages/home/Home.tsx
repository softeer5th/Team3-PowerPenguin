import S from './Home.module.css';

const Home = () => {
  return (
    <div className={S.container}>
      <a href="/professor/login" className={S.text}>
        교수 시작
      </a>
      <a href="/student" className={S.text}>
        학생 시작
      </a>
    </div>
  );
};

export default Home;
