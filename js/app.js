/**
 * 애플리케이션 진입점
 * 앱 초기화 및 컨트롤러 연결을 담당합니다.
 */

// 앱 초기화 함수
function initApp() {
    // 컨트롤러 초기화
    SubjectController.init();
    NoteController.init();
    
    console.log('PureClient NoteApp이 초기화되었습니다.');
}

// DOM이 로드된 후 앱 초기화
document.addEventListener('DOMContentLoaded', initApp);

// 브라우저 종료 전 경고 메시지 (선택적)
// window.addEventListener('beforeunload', function(e) {
//     const message = '페이지를 떠나면 저장되지 않은 변경사항이 손실될 수 있습니다.';
//     e.returnValue = message;
//     return message;
// });