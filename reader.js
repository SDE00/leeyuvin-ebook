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

// 키보드 방향키로 페이지 넘기기 (보너스 기능)
document.addEventListener("keyup", function(e) {
    if ((e.keyCode || e.which) == 37) rendition.prev(); // 왼쪽 화살표
    if ((e.keyCode || e.which) == 39) rendition.next(); // 오른쪽 화살표
}, false);