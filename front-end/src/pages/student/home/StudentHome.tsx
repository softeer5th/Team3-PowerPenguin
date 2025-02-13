import S from './StudentHome.module.css';
import Logo from '@/assets/icons/logo.svg?react';
import { useState } from 'react';
import useModal from '@/hooks/useModal';
import ClassModal from './components/ClassModal';
import StudentPopup from '../components/StudentPopup';
import { useNavigate } from 'react-router';

const StudentHome = () => {
  const navigate = useNavigate();
  const [admissionCode, setAdmissionCode] = useState<string>('');
  const [modalType, setModalType] = useState<
    'classModal' | 'notFound' | 'notStart' | null
  >(null);
  const [classInfo, setClassInfo] = useState({});

  const { openModal, closeModal, Modal } = useModal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setAdmissionCode(inputValue);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 서버에서 요청 받아서 어떤 모달 띄울지 정하기
    // setModalType();
    // setClassInfo();
    openModal();
  };

  const handleCheckClick = () => {
    closeModal();

    // 입장하기 버튼
    // navigate(`/course/${classInfo.id}`);
  };

  const renderModal = () => {
    switch (modalType) {
      case 'classModal':
        return (
          <ClassModal
            closeModal={closeModal}
            classInfo={classInfo}
            onCheckClick={handleCheckClick}
          />
        );
      case 'notFound':
        return (
          <StudentPopup
            closeModal={closeModal}
            checkModal={closeModal}
            title="존재하지 않는 코드입니다"
            content="다시 한번 코드를 확인해주세요"
          />
        );
      case 'notStart':
        return (
          <StudentPopup
            closeModal={closeModal}
            checkModal={closeModal}
            title="아직 수업이 시작하지 않았습니다"
            content="잠시만 기다려주세요"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {modalType && <Modal>{renderModal()}</Modal>}
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
    </>
  );
};

export default StudentHome;
