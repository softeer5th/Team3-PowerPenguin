import S from './StudentHome.module.css';
import Logo from '../../../assets/icons/logo.svg?react';
import { useState } from 'react';

const StudentHome = () => {
  const [admissionCode, setAdmissionCode] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setAdmissionCode(inputValue);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 서버에 요청 보내기
  };

  return (
    <div className={S.homeLayout}>
      <Logo className={S.logo} />
      <form className={S.classForm} onSubmit={handleFormSubmit}>
        <input
          className={S.classInput}
          type="text"
          value={admissionCode}
          onChange={(e) => handleInputChange(e)}
          placeholder="입장코드를 입력해주세요"
        />
        <button
          type="submit"
          className={S.formButton}
          disabled={!admissionCode}
        >
          입장하기
        </button>
      </form>
    </div>
  );
};

export default StudentHome;
