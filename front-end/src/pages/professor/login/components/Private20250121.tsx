import S from './Private20250121.module.css';
import CloseIcon from '@/assets/icons/close.svg?react';

type PrivateProps = {
  onClose: () => void;
};

const Private = ({ onClose }: PrivateProps) => {
  return (
    <div className={S.container} onClick={(e) => e.stopPropagation()}>
      <button className={S.closeButton} onClick={onClose}>
        <CloseIcon width="19px" height="19px" />
      </button>
      <div className={S.content}>
        <h1 className={S.title}>개인정보 처리방침</h1>
        <p className={S.updatedDate}>최종 업데이트일: 2025년 1월 21일</p>
        <p className={S.description}>
          리액트온(이하 "서비스")은 사용자의 개인정보를 소중히 여기며, 관련
          법률과 규정을 준수하여 개인정보를 안전하게 관리합니다. 본 개인정보
          처리방침은 사용자가 제공한 개인정보가 어떻게 수집, 사용, 저장 및
          보호되는지에 대해 설명합니다.
        </p>
        <div className={S.divider}>
          <div>
            <h2>1. 수집하는 개인정보</h2>
            <p>
              리액트온은 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul>
              1. Google 로그인 시 자동 수집
              <li>이름</li>
              <li>이메일 주소</li>
              <li>사용자가 직접 입력하는 정보</li>
            </ul>
            <ul>
              2. 사용자가 직접 입력하는 정보
              <li>대학교 이름</li>
              <li>강의 명 및 학수번호</li>
              <li>강의 자료 (PDF 파일)</li>
            </ul>
          </div>
          <div>
            <h2>2. 개인정보 수집 및 이용 목적</h2>
            <p>수집된 개인정보는 다음과 같은 목적을 위해 사용됩니다:</p>
            <ul>
              <li>
                서비스 제공 및 관리: 강의 참여 및 자료 공유를 위한 계정 생성 및
                관리.
              </li>
              <li>
                커뮤니케이션: 사용자 문의 응대 및 서비스 관련 공지사항 전달.
              </li>
              <li>서비스 개선: 사용 경험 개선 및 서비스 품질 향상.</li>
            </ul>
          </div>
          <div>
            <h2>3. 개인정보 보관 및 파기</h2>
            <h3>(1) 보관 기간</h3>
            <p>
              수집된 개인정보는 사용자가 서비스를 이용하는 동안 보관되며, 탈퇴
              요청 시 안전하게 삭제됩니다.
            </p>
            <h3>휴면 계정 정책:</h3>
            <ul>
              <li>
                교수님이 마지막으로 접속한 시점을 기준으로 1년 동안 로그인
                기록이 없으면 해당 계정을 휴면 상태로 전환합니다.
              </li>
              <li>
                휴면 상태로 전환된 계정은 다시 로그인하면 활성 상태로
                복구됩니다.
              </li>
              <li>
                휴면 상태로 전환된 후 2년(마지막 접속 시점으로부터 총 3년) 동안
                추가 접속이 없을 경우, 해당 계정과 관련된 모든 강의 데이터를
                영구 삭제합니다.
              </li>
              <li>삭제된 데이터는 복구가 불가능합니다.</li>
            </ul>
            <h3>(2) 파기 절차 및 방법</h3>
            <p>
              개인정보는 보관 기간이 종료된 후 복구할 수 없도록 안전하게
              삭제됩니다.
            </p>
            <ul>
              <li>전자 파일은 영구 삭제됩니다.</li>
            </ul>
          </div>
          <div>
            <h2>4. 개인정보의 제3자 제공</h2>
            <p>
              리액트온은 원칙적으로 사용자의 개인정보를 제3자에게 제공하지
              않습니다. 단, 법률에 의해 요구되는 경우나 사용자의 동의를 받은
              경우에 한하여 제공할 수 있습니다.
            </p>
          </div>
          <div>
            <h2>5. 개인정보의 안전성 확보 조치</h2>
            <p>
              리액트온은 사용자의 개인정보를 안전하게 보호하기 위해 다음과 같은
              조치를 취하고 있습니다:
            </p>
            <ul>
              <li>데이터 암호화 및 접근 제한</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </div>
          <div>
            <h2>6. 사용자 권리 및 행사 방법</h2>
            <p>
              사용자는 언제든지 본인의 개인정보 열람, 수정, 삭제를 요청할 수
              있습니다. 요청은 서비스 내 설정 페이지 또는 아래의 연락처를 통해
              가능합니다.
            </p>
          </div>
          <div>
            <h2>7. 개인정보 관련 문의</h2>
            <p>
              개인정보와 관련된 문의 사항이 있으시면 아래의 연락처로 연락 주시기
              바랍니다:
            </p>
            <ul>
              <li>
                이메일:
                <a href="mailto:alsry0712@gmail.com">alsry0712@gmail.com</a>
              </li>
            </ul>
          </div>
          <p className={S.privateStart}>
            위 개인정보 처리방침은 2025년 1월 21일부터 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Private;
