# Team3-PowerPenguin

</div>

<div >
	<h2>🐧 Developers 🐧</h2>

|<img src="https://github.com/sunohkim.png" width="80">|<img src="https://github.com/uri010.png" width="80">|<img src="https://github.com/wwweric12.png" width="80">|<img src="https://github.com/DrCloy.png" width="80">|
|:---:|:---:|:---:|:---:|
|[김선오](https://github.com/sunohkim)|[김유리](https://github.com/uri010)|[김동영](https://github.com/wwweric12)|[김민교](https://github.com/DrCloy)
|BackEnd|BackEnd|FrontEnd|FrontEnd|

 
</div>

## 📜 그라운드 룰 
### 🛠️ 기본 규칙
- 서로 존중하는 것이 기본! 구박하지 않기
- 눈치 보지 말고 필요한 사항은 즉시 공유하기
- 매주 금요일, 책상 정리 및 청소하기

### 🔥 회의 규칙
- **최대 2시간 진행**, 초과 시 15분 이상 휴식 후 재개
- 데일리 스크럼: <ins>매일 10:00 ~ 10:30 진행</ins>
- 데일리 회고: <ins>매일 18:30 ~ 19:00 진행</ins>
- 긴급 회의: 최대 30분 정도 기다린 후 회의 요청
- 서기 역할: 매일 돌아가며 담당
- 작업이 없던 날도 공유 필수: "오늘은 작업 없음"도 기록

### 🔄 Sprint 기준
- `금` / `토일월` / `화수목` 주기로 진행
- 금요일 오전: 스프린트 마무리 및 다음 스프린트 계획
- 금요일 오후: 스쿼드 세션 후 스프린트 구체화 및 주간 회고

### 📞 비대면 소통 방식
- Slack을 기본 소통 채널로 사용
    - 스레드 활용하여 답글 정리
    - 음성 대화도 Slack 사용
    - 반응 이모지 활용
        - 👀 : 확인 중
        - ✅ : 읽음
        - ❓ : 이해 안 됨
- KakaoTalk은 사담 전용


## 💻 개발 룰

### 🌿 브랜치 전략
> Git Flow 기반의 단순화된 전략
#### 브랜치 구조
<img width=60% height=60% src="https://github.com/user-attachments/assets/c00b1aa5-fcfb-4890-9490-aa0c3c462226"/> 

- main : 배포 브랜치
- dev : 개발 브랜치로 main에 병합되기 전 모든 개발 작업을 합치는 브랜치
- 기능별 브랜치 : dev 브랜치에서 파생되는 브랜치로 유형 뒤에 fe/be로 프론트엔드와 백엔드 구분
    - ex) feat/fe/기능명
 
### 📌 GitHub 활용
- Issue : 스프린트 단위로 이슈 생성 및 관리
- Milestone : 이슈와 연결하여 마감 기한 설정
- Discussions : 논의할 모든 사항을 기록
- Pull Request (PR)
    - 코드 변경 사항 반영 및 리뷰 진행
    - 최소 1인 이상의 Approve 필요
- Projects : 스프린트별 진행 상황 관리
- Wiki : 회의록, 데일리 스크럼, 개발 문서 보관

### 💬 커밋 컨벤션
```
유형: 커밋 메시지 #이슈번호

- 커밋 메시지 내용
- 커밋 메시지 내용
- 커밋 메시지 내용
```

| 유형 | 설명 |
| --- | --- |
| ✨ Feat | 새로운 기능의 추가 |
| 🐞 Fix | 버그 수정 |
| 📃 Docs | 문서 수정 |
| 🔨 Refactor | 코드 리팩토링 |
| ✅ Test | 테스트 코드 |
| 🔧 Chore | 기타 |

