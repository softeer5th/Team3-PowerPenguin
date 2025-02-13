import React, { useRef, useState } from 'react';
import S from './ProfessorRegister.module.css';
import BasicProfile from '../../../assets/icons/basic-profile.svg?react';
import TextButton from '../../../components/button/text/TextButton';
import { validateImage, validateName } from '../../../utils/util';
import { professorRepository } from '../../../di';

const ProfessorRegister = () => {
  const [profile, setProfile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (validateImage(files[0])) {
        setProfile(files[0]);
      }
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!profile) {
      alert('프로필 사진을 선택해 주세요.');
      return;
    }
    if (name.length === 0) {
      alert('사용자 이름을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('회원가입하기');
      console.log('이름:', name);
      console.log('프로필 사진:', profile);
      if (!validateName(name)) {
        return;
      }
      alert('회원가입에 성공했습니다.');
      await professorRepository.createProfessor(name, profile);
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={S.frame}>
      <div className={S.container}>
        <form className={S.content} onSubmit={handleSubmit}>
          <h1 className={S.title}>회원가입 정보 입력</h1>
          <div className={S.inputContainer}>
            <label className={S.label}>프로필 사진</label>
            <div className={S.profileContainer}>
              {profile ? (
                <div className={S.profileIcon}>
                  <img src={URL.createObjectURL(profile)} alt="profile" />
                </div>
              ) : (
                <div className={S.profileIcon}>
                  <BasicProfile
                    width="52px"
                    height="52px"
                    color="var(--blue-300)"
                  />
                </div>
              )}
              <input
                className={S.profileInput}
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={handleProfileChange}
              />
              <TextButton
                text={profile ? '다시 고르기' : '사진 선택'}
                color="white"
                size="web3"
                width={profile ? '151px' : '136px'}
                height="53px"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  profileInputRef.current?.click();
                }}
              />
            </div>
          </div>
          <div className={S.inputContainer}>
            <label className={S.label}>사용자 이름</label>
            <input
              className={S.textInput}
              type="text"
              placeholder="이름을 입력해 주세요"
              onChange={handleNameChange}
            />
          </div>
          <TextButton
            text="회원가입하기"
            color="blue"
            size="web4"
            height="80px"
            onClick={() => {}}
            isActive={name.length > 0 && profile !== null}
          />
        </form>
      </div>
    </div>
  );
};

export default ProfessorRegister;
