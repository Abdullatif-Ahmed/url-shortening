let navToggleBtn = document.getElementById("nav-toggle-btn");
let shortenInp = document.getElementById("shorten-inp");
let shortenBtn = document.getElementById("shorten-btn");
let shortenLinksCon = document.querySelector(".shorten-links-con");
let shortenLinks = [];
navToggleBtn.addEventListener("click", (e) => {
  e.preventDefault;
  document.querySelector(".header-content nav").classList.toggle("open");
});

shortenBtn.addEventListener("click", (e) => {
  e.preventDefault;
  shortenInp.classList.remove("inp-error");
  if (document.querySelector(".shorten-inp-group .error")) {
    document.querySelector(".shorten-inp-group .error").remove();
  }
  if (shortenInp.value === "") {
    errorMs("please add a link");
  } else {
    let loadingSp = document.createElement("div");
    loadingSp.className = "loading-spinner";
    loadingSp.innerHTML = `<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`;
    shortenLinksCon.prepend(loadingSp);
    fetchData();
  }
});
async function fetchData() {
  let request = await fetch(
    `https://api.shrtco.de/v2/shorten?url=${shortenInp.value}`
  );
  if (request.ok === true) {
    let data = await request.json();

    let obj = {
      "original-link": shortenInp.value,
      "shorten-link": data.result["full_short_link"],
    };
    shortenLinks.push(obj);
    localStorage.setItem("shLinks", JSON.stringify(shortenLinks));
    addToPage(shortenLinks);
  } else {
    errorMs("please add a valid link");
    document.querySelector(".loading-spinner").remove();
  }
}
function addToPage(ar) {
  shortenLinksCon.innerHTML = "";
  ar.forEach((obj) => {
    let shortenLinkBox = document.createElement("div");
    shortenLinkBox.className = "shortenLink-box";
    let originalLink = document.createElement("div");
    originalLink.appendChild(document.createTextNode(obj["original-link"]));
    originalLink.className = "original-link";
    let shortenLink = document.createElement("div");
    shortenLink.className = "shorten-link";
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(obj["shorten-link"]));
    let copyBtn = document.createElement("button");
    copyBtn.appendChild(document.createTextNode("Copy"));
    copyBtn.className = "btn-style";
    shortenLinkBox.appendChild(originalLink);
    shortenLink.appendChild(span);
    shortenLink.appendChild(copyBtn);
    shortenLinkBox.appendChild(shortenLink);
    shortenLinksCon.prepend(shortenLinkBox);
    copyBtn.onclick = (e) => {
      e.preventDefault;
      navigator.clipboard.writeText(obj["shorten-link"]);
      document.querySelectorAll(".shorten-link button").forEach((btn) => {
        btn.innerHTML = "Copy";
        btn.classList.remove("active");
      });
      e.target.innerHTML = `Copied!`;
      e.target.classList.add("active");
    };
  });
}
if (localStorage.getItem("shLinks")) {
  shortenLinks = JSON.parse(localStorage.getItem("shLinks"));
  addToPage(JSON.parse(localStorage.getItem("shLinks")));
}
function errorMs(ms) {
  shortenInp.classList.add("inp-error");

  let error = document.createElement("span");
  error.className = "error";
  error.appendChild(document.createTextNode(ms));
  document.querySelector(".shorten-inp-group").appendChild(error);
}
