



<div align=center>
<h1>🐧 React:ON</h1>
</div>

![Cover](https://github.com/user-attachments/assets/acd7233f-189f-472e-9d22-9994c7ad9e8b)

</br>

<!--목차-->
# 목차
- [서비스 소개](#1-서비스-소개)
  - [기획 배경](#1-1-기획-배경)
  - [주요 기능](#1-2-주요-기능)
  - [기대 효과](#1-3-기대-효과) 
- [팀원별 역할](#2-팀원별-역할)
- [기술 스택](#3-기술-스택)
- [그라운드 룰](#4-그라운드-룰)
- [개발 룰](#5-개발-룰)


# [1] 서비스 소개
<strong>React:ON</strong>은 교수와 학생 간의 실시간 상호작용을 촉진하는 웹 서비스입니다.  
수업 중 학생들이 보다 능동적으로 의견을 표현하고, 교수는 즉각적인 피드백을 받을 수 있도록 돕습니다.

</br>

## 1-1 기획 배경
🎯 문제점: 대면 강의에서 학생들의 적극적인 참여 부족  
✅ 해결책: 실시간 리액션과 익명 질문 기능 제공

✔ 학생들이 질문하기 어려운 환경에서 손쉽게 의견을 표현할 수 있도록 합니다.  
✔ 교수는 학생들의 반응을 실시간으로 확인하고, 수업 몰입도를 높이는 피드백을 제공합니다.  
✔ 학생과 교수 간의 소통을 활성화하여 능동적인 수업 환경을 조성합니다.  

</br>

## 1-2 주요 기능 
![서비스 소개 - 학생](https://github.com/user-attachments/assets/83b1ee11-1830-4b6e-bb4b-ea9c199d784f)
![서비스 소개 - 교수](https://github.com/user-attachments/assets/c6f064c1-8a24-47ad-a250-cc69730501ce)
![서비스 소개 - 수업통계](https://github.com/user-attachments/assets/80565260-031d-40d7-bef4-2f04cd67114d)
![사용 시나리오](https://github.com/user-attachments/assets/d0039991-6e12-4996-8c65-93f3306ebc52)


## 1-3 기대 효과 
✔ 기존 수업에서 질문하지 않던 학생들도 더 적극적으로 참여  
✔ 교수는 학생들의 반응을 주기적으로 확인하여 강의 개선이 용이  
✔ 교수와 학생 간의 소통이 증가하여 수업 만족도 상승  

</br>





## [2] 팀원별 역할
	
|<img src="https://github.com/sunohkim.png" width="80">|<img src="https://github.com/uri010.png" width="80">|<img src="https://github.com/wwweric12.png" width="80">|<img src="https://github.com/DrCloy.png" width="80">|
|:---:|:---:|:---:|:---:|
|[김선오](https://github.com/sunohkim)|[김유리](https://github.com/uri010)|[김동영](https://github.com/wwweric12)|[김민교](https://github.com/DrCloy)
|BackEnd|BackEnd|FrontEnd|FrontEnd|
|BackEnd|BackEnd|학생 페이지|교수 페이지|
 

</br>

# [3] 기술 스택

<div align=center>

## Config

![yarn](https://img.shields.io/badge/npm-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Development

### Front-End

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ReactRouter](https://img.shields.io/badge/reactrouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![pdf.js](https://img.shields.io/badge/pdf.js-FF0000?style=for-the-badge&logo=adobe&logoColor=white)


### Back-End



### Architecture



</div>


</br>

# [4] 그라운드 룰 

[그라운드 룰](https://github.com/softeer5th/Team3-PowerPenguin/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0)

</br>

# [5] 개발 룰

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

