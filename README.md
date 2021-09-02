# 노션 클로닝 프로젝트

## 기본 요구사항

- [x] 바닐라 JS만 이용
- [x] 기본적인 레이아웃은 노션과 같으며, 스타일링, 컬러값 등은 원하는대로 커스텀
- [x] Document는 Document 여러개를 포함할 수 있음
- [x] 화면 좌측에 Root Documents를 불러오는 API를 통해 루트 Documents를 렌더링
- [x] Root Document를 클릭하면 오른쪽 편집기 영역에 해당 Document의 Content를 렌더링
- [x] 해당 Root Document에 하위 Document가 있는 경우, 해당 Document 아래에 트리 형태로 렌더링
- [x] Document Tree에서 각 Document 우측에는 + 버튼
  - 해당 버튼을 클릭하면, 클릭한 Document의 하위 Document로 새 Document를 생성하고 편집화면으로 넘김
- [x] 편집기에는 기본적으로 저장 버튼이 없습니다. Document Save API를 이용해 지속적으로 서버에 저장
- [ ] History API를 이용해 SPA 형태로 만들기
- [x] 루트 URL 접속 시엔 별다른 편집기 선택이 안 된 상태
- [x] /documents/{documentId} 로 접속시, 해당 Document 의 content를 불러와 편집기에 로딩

## 보너스 요구사항

- [ ] 기본적으로 편집기는 textarea 기반으로 단순한 텍스트 편집기로 시작하되, 여력이 되면 div와 contentEditable을 조합해서 좀 더 Rich한 에디터 만들기
- [x] 편집기 최하단에는 현재 편집 중인 Document의 하위 Document 링크를 렌더링하도록 추가
- [ ] 편집기 내에서 다른 Document name을 적은 경우, 자동으로 해당 Document의 편집 페이지로 이동하는 링크를 거는 기능을 추가

## 내가 추가로 구현한 것

- [x] 제목에 emoji 붙이는 기능 추가
