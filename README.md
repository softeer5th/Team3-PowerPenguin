



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
- [아키텍처](#4-아키텍처-&-CI/CD)
- [그라운드 룰](#5-그라운드-룰)
- [개발 룰](#6-개발-룰)


# [1] 서비스 소개
### 🎯 React:ON이란?

React:ON은 교수와 학생 간의 실시간 상호작용을 촉진하는 웹 서비스입니다.
학생들은 보다 능동적으로 의견을 표현할 수 있으며, 교수는 즉각적인 피드백을 받을 수 있도록 돕습니다.


## 1-1 기획 배경
### 📌 문제점
🎓 대면 강의에서 학생들의 적극적인 참여 부족

### ✅ 해결책
💡 실시간 리액션과 익명 질문 기능 제공
<br>
🤝 학생들이 질문하기 어려운 환경에서도 쉽게 의견을 표현할 수 있도록 합니다.
<br>
📊 교수는 학생들의 반응을 실시간으로 확인하고, 수업 몰입도를 높이는 피드백을 제공합니다.
<br>
🔗 학생과 교수 간의 소통을 활성화하여 능동적인 수업 환경을 조성합니다.

</br>

## 1-2 주요 기능 

<div align=center>
<img src="https://github.com/user-attachments/assets/83b1ee11-1830-4b6e-bb4b-ea9c199d784f" alt="서비스 소개 - 학생" width="750">
<img src="https://github.com/user-attachments/assets/c6f064c1-8a24-47ad-a250-cc69730501ce" alt="서비스 소개 - 교수" width="750">
<img src="https://github.com/user-attachments/assets/80565260-031d-40d7-bef4-2f04cd67114d" alt="서비스 소개 - 수업통계" width="750">
<img src="https://github.com/user-attachments/assets/d0039991-6e12-4996-8c65-93f3306ebc52" alt="사용 시나리오" width="750">		
</div>

## 1-3 기대 효과 
✔ 기존 수업에서 질문하지 않던 학생들도 더 적극적으로 참여  
✔ 교수는 학생들의 반응을 주기적으로 확인하여 강의 개선이 용이  
✔ 교수와 학생 간의 소통이 증가하여 수업 만족도 상승  

</br>



# [2] 팀원별 역할

<p align="center">
    <table align="center">
        <tr>
            <th><a href="https://github.com/sunohkim">김선오</a></th>
            <th><a href="https://github.com/uri010">김유리</a></th>
            <th><a href="https://github.com/wwweric12">김동영</a></th>
            <th><a href="https://github.com/DrCloy">김민교</a></th>
        </tr>
        <tr>
            <td><img width="150" src="https://github.com/sunohkim.png"></td>
            <td><img width="150" src="https://github.com/uri010.png"></td>
            <td><img width="150" src="https://github.com/wwweric12.png"></td>
            <td><img width="150" src="https://github.com/DrCloy.png"></td>
        </tr>
        <tr>
            <td align="center">BE</td>
            <td align="center">BE</td>
            <td align="center">FE</td>
            <td align="center">FE</td>
        </tr>
	<tr>
	    <td align="center">SSE 서버 구축<br>성능 테스트<br>DB 최적화<br>Oauth 로그인 구현<br>실시간 수업 API<br>조회 API</td>
	    <td align="center">협업 관련 자동화<br>OAuth 로그인 구현<br>서버 인프라 구축<br>CI/CD 구축<br>DB 최적화<br>S3 파일 관련 API<br>회원, 수업 관련 API</td>
	    <td align="center">학생 페이지 및 기능 구현<br>PDF 기능 구현 </td>
	    <td align="center">교수 페이지 및 기능 구현<br>PDF 기능 구현 <br> 프론트엔드 배포</td>
	</tr>
    </table>
</p>

</br>

# [3] 기술 스택

<div align=center>

### 프론트엔드

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ReactRouter](https://img.shields.io/badge/reactrouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![pdf.js](https://img.shields.io/badge/pdf.js-FF0000?style=for-the-badge&logo=adobe&logoColor=white)
![yarn](https://img.shields.io/badge/npm-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### 백엔드
![JAVA](https://img.shields.io/badge/JAVA-007396?style=for-the-badge&logo=java&logoColor=white)
![SpringBoot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-6DB33F?style=for-the-badge&logo=jpa&logoColor=white)
![OAuth 2.0](https://img.shields.io/badge/OAuth2.0-2088FF?style=for-the-badge&logo=oauth2.0&logoColor=white)
![MySQL](https://img.shields.io/badge/MySql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHubActions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)


### 협업
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![GithubProjects](https://img.shields.io/badge/GithubProjects-181717?style=for-the-badge&logo=github&logoColor=white)
</div>
</br>

# [4] 아키텍처 & CI/CD
## 🛠️ 백엔드 아키텍처
<div align="center">
<img src="https://github.com/user-attachments/assets/bf4e5247-7dca-478d-9c0a-f69d6008ebe7" width=75% height=75%/>
</div>

## 🚀 백엔드 CI/CD 

<div align="center">
<img src="https://github.com/user-attachments/assets/d72c8182-081f-43dc-a8df-1d5db4a6eafb" width=65% height=65%/>
</div>

## 프론트엔드 아키텍처 

# [5] 그라운드 룰 
우리 팀의 원활한 협업을 위한 기본 규칙과 회의, 스프린트 기준, 소통 방식을 정리했습니다. 
 
궁금하시다면 [링크](https://github.com/softeer5th/Team3-PowerPenguin/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0)를 클릭해 주세요! 🚀

</br>

# [6] 개발 룰

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

