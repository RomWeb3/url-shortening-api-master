//Menu mobile toggle

const modalMenu = document.querySelector("#modal");
const menuToggle = document.querySelector("#menu-toggle");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  modalMenu.classList.toggle("hidden");
});

//Form active state, error message when input is empty

const formInput = document.querySelector("#input-url");
const sumbitBtn = document.querySelector("#submit-btn");
const errorMessage = document.querySelector(".message");

sumbitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (formInput.value === "") {
    formInput.classList.add("error");
    errorMessage.classList.add("error");
  } else {
    formInput.classList.remove("error");
    errorMessage.classList.remove("error");
  }
});
