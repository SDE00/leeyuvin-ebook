// 'book/' 폴더 안에 있는 content.opf 파일 경로를 지정합니다.
// ePub마다 경로가 다를 수 있으니 확인 필수! (예: book/OEBPS/content.opf)

console.log("스크립트 시작됨!!");
const book = ePub("books/OEBPS/content.opf"); 
console.log("book 객체 생성됨:", book);
const rendition = book.renderTo("viewer", {
  width: "100%",
  height: "100%",
  flow: "paginated" // 페이지 넘김 방식
});

// 이 부분에 로그를 찍어 어디서 멈추는지 확인합니다.
book.opened.then(() => {
    console.log("책 파일 열기 성공!");
    return rendition.display();
}).then(() => {
    console.log("렌더링 완료!");
}).catch(err => {
    console.error("에러 발생:", err);
});

// 책 렌더링
rendition.display().then(() => {
    console.log("렌더링 완료!");
}).catch(err => {
    console.error("렌더링 중 에러 발생:", err);
});

// 이전/다음 버튼 기능
document.getElementById("prev").addEventListener("click", () => {
  rendition.prev();
});

document.getElementById("next").addEventListener("click", () => {
  rendition.next();
});

let touchStartX = 0;
let touchEndX = 0;

// 뷰어 내부의 터치 이벤트 감지
rendition.on("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

rendition.on("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // 스와이프로 인정할 최소 거리 (픽셀)
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // 왼쪽으로 밀었을 때 -> 다음 페이지
        rendition.next();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // 오른쪽으로 밀었을 때 -> 이전 페이지
        rendition.prev();
    }
}

// 책 안쪽(iframe)의 이벤트를 바깥쪽으로 연결하는 함수
rendition.hooks.content.register(function(contents) {
    const el = contents.document.documentElement;

    // 1. Iframe 내부 키보드 이벤트 감지
    el.addEventListener("keyup", function(e) {
        if ((e.keyCode || e.which) == 37) rendition.prev(); // 왼쪽
        if ((e.keyCode || e.which) == 39) rendition.next(); // 오른쪽
    }, false);

    // 2. PC 마우스 드래그 & 모바일 터치 통합 스와이프
    let startX = 0;

    // 터치 시작 & 마우스 클릭 시작
    el.addEventListener('mousedown', e => startX = e.screenX);
    el.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX);

    // 터치 종료 & 마우스 클릭 종료
    el.addEventListener('mouseup', e => handleEnd(e.screenX));
    el.addEventListener('touchend', e => handleEnd(e.changedTouches[0].screenX));

    function handleEnd(endX) {
        const threshold = 50; // 50px 이상 움직여야 페이지 이동
        if (startX - endX > threshold) rendition.next();
        if (startX - endX < -threshold) rendition.prev();
    }
});

// 3. 바깥쪽 document 키보드 이벤트
document.addEventListener("keyup", function(e) {
    if ((e.keyCode || e.which) == 37) rendition.prev(); // 왼쪽 화살표
    if ((e.keyCode || e.which) == 39) rendition.next(); // 오른쪽 화살표
}, false);