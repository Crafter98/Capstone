# 한국항공대학교 소프트웨어학과 Capstone Design
날짜별 뉴스 키워드 분석 및 딥러닝을 이용한 댓글 긍/부정 감정 분석

<br>

### 개발 배경
실시간 검색어와 유사한 서비스를 개발하되, 실제로 이슈가 된 뉴스 기사들을 기반으로 키워드와 네티즌들의 반응을 시각적으로 보여줄 수 있는 웹 사이트를 개발하고자 하였다.

<br>

### 사용 기술
DB : MySQL

크롤링 : Python ( BeautifulSoup )

데이터 분석 : R

웹 개발 : Javascript, PHP

딥러닝 모델 : KoELECTRA

<br>

### 시연 화면

**1. 웹페이지 메인 화면**

![2022-06-08 (2)](https://user-images.githubusercontent.com/58458054/172585248-fd3f93f4-d6d3-4b39-9271-86f5a538e541.png)

<br><br>

**2. 자세히 알아보기 버튼 클릭시 아래로 이동 - 해당 날짜의 TOP5 키워드**

![main 2](https://user-images.githubusercontent.com/58458054/172585721-fbfaf43b-f47b-45a3-9c77-623f616f2ca3.png)

<br><br>

**3. 스크롤 내릴 시 – 해당 날짜와 전전날까지의 상위 TOP10 키워드와 관련 뉴스의 링크 표시**

![main 3](https://user-images.githubusercontent.com/58458054/172585742-2e686fed-d6a2-4994-b2d7-4ca320092757.png)

<br><br>

**4. 선택된 날짜는 파랗게 표시, 뉴스 기사를 클릭하면 새 탭에서 뉴스 링크 띄움**

![main 4](https://user-images.githubusercontent.com/58458054/172586611-b9cb4ef5-6869-4e14-a664-27b46a9550b8.png)

![main 5](https://user-images.githubusercontent.com/58458054/172586436-5106dbed-7a56-4204-881a-f02ef509dc6f.png)

<br><br>

**5. [2]에서 원하는 키워드 클릭시 – 키워드와 카테고리를 유지하며 페이지 이동 ( 3등 '정인' 키워드 선택 )**
- 위에서 현재 선택된 키워드가 무엇인지 확인 가능
- 화살표로 날짜를 하루씩 이동하거나 달력 아이콘을 눌러 직접 날짜 선택할 수 있음
- 왼쪽에서 6개 카테고리중 원하는 카테고리 선택


- 특정 날짜의 특정 카테고리에서 TOP 5 키워드 선택 가능
- 댓글 반응에서 긍정/부정 선택 가능 ( 딥러닝으로 도출된 댓글의 감성 분석 결과 )

![detail 1](https://user-images.githubusercontent.com/58458054/172588109-f2d9339c-8ee5-4602-b19e-25e63b492d70.png)

<br><br>

**6. 워드클라우드와 뉴스 기사**
- 선택된 키워드와 관련된 연관어를 뽑아 워드클라우드로 시각화 -> 어떤 이슈가 있었는지 짐작 가능
- 관련 뉴스 기사 링크를 띄워 클릭 시 빠르게 확인할 수 있음

![detail 2](https://user-images.githubusercontent.com/58458054/172587603-8e847073-6326-4a54-ad06-50f9301a11ac.png)

<br><br>
