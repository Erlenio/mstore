$(".bx-cart").click(() => {
  $(".cart").toggleClass("open");
});

$('.bx-menu').click(() => {$('.menu').toggleClass('open')});

$(".bx-left-arrow-alt").click(() => {
  $(".cart").toggleClass("open");
});

$(".bx-user").click(() => {
  $(".user-details").toggleClass("active");
});

let header = document.querySelector("header");
let storeContainer = document.querySelector("#store");
let headerSection = document.querySelector("section#header");



if (storeContainer != undefined) {
  storeContainer.style.marginTop = header.offsetHeight + "px";
}

if (headerSection != undefined) {
  headerSection.style.marginTop = header.offsetHeight + "px";
}

window.addEventListener("scroll", () => {
  if (window.pageYOffset > header.offsetHeight) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});
