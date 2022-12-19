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
const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

sumbitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (formInput.value === "" || !urlRegex.test(formInput.value)) {
    formInput.classList.add("error");
    errorMessage.classList.add("error");
  } else {
    formInput.classList.remove("error");
    errorMessage.classList.remove("error");
    shortenUrl();
    createDiv();
    setTimeout(() => {
      localStore();
    }, 1000);
  }
});

let shortenUrlFromApi;

// Fetch shorten url
function shortenUrl() {
  const API = "https://api.shrtco.de/v2/shorten?url=";
  const url = formInput.value;

  fetch(API + url)
    .then((response) => response.json())
    .then((data) => {
      shortenUrlFromApi = data.result.full_short_link;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Create div with shorten url inside
const resultContainer = document.querySelector(".responses");

function createDiv() {
  setTimeout(() => {
    resultContainer.classList.add("active");

    const response = document.createElement("div");
    response.classList.add("response");
    resultContainer.append(response);

    const originalUrlDiv = document.createElement("div");
    originalUrlDiv.classList.add("original");
    response.append(originalUrlDiv);

    const originalUrl = document.createElement("a");
    originalUrl.innerHTML = formInput.value;
    originalUrlDiv.append(originalUrl);

    const separatorLine = document.createElement("div");
    separatorLine.classList.add("line");
    response.append(separatorLine);

    const shortenUrlDiv = document.createElement("div");
    shortenUrlDiv.classList.add("shortened");
    response.append(shortenUrlDiv);

    const shortenUrl = document.createElement("a");
    shortenUrl.innerHTML = shortenUrlFromApi;
    shortenUrlDiv.append(shortenUrl);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    shortenUrlDiv.append(copyBtn);
    copyBtn.addEventListener("click", () => {
      clipboard(shortenUrl.innerHTML);
      copyBtn.classList.add("active");
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("active");
        copyBtn.textContent = "Copy";
      }, 2000);
    });
  }, 300);
}

function clipboard(txtToCopy) {
  const clipboardPermission = navigator.permissions.query({
    name: "clipboard-write",
  });
  clipboardPermission.then((result) => {
    if (result.state === "granted") {
      // Clipboard write permission is granted, so we can use the writeText() method
      navigator.clipboard.writeText(txtToCopy).then(() => {
        console.log("Text copied to clipboard");
      });
    } else if (result.state === "prompt") {
      // Clipboard write permission is not granted, so we can request it from the user
      navigator.permissions
        .request({ name: "clipboard-write" })
        .then((result) => {
          if (result.state === "granted") {
            // Clipboard write permission is granted, so we can use the writeText() method
            navigator.clipboard.writeText(txtToCopy).then(() => {
              console.log("Text copied to clipboard");
            });
          } else {
            console.log("Clipboard write permission denied");
          }
        });
    } else {
      console.log("Clipboard write permission denied");
    }
  });
}

// Local storage
function localStore() {
  const shortenedUrl = shortenUrlFromApi;
  const originalUrl = formInput.value;
  const data = { shortenedUrl, originalUrl };
  let urls = [];
  if (localStorage.getItem("urls") === null) {
    urls = [];
  } else {
    urls = JSON.parse(localStorage.getItem("urls"));
  }
  urls.push(data);
  localStorage.setItem("urls", JSON.stringify(urls));
}

// Load local storage
const loadLocalStorage = () => {
  const urls = JSON.parse(localStorage.getItem("urls"));
  if (urls === null) {
    return;
  } else {
    urls.forEach((url) => {
      resultContainer.classList.add("active");
      const response = document.createElement("div");
      response.classList.add("response");
      resultContainer.append(response);

      const originalUrlDiv = document.createElement("div");
      originalUrlDiv.classList.add("original");
      response.append(originalUrlDiv);

      const originalUrl = document.createElement("a");
      originalUrl.innerHTML = url.originalUrl;
      originalUrlDiv.append(originalUrl);

      const separatorLine = document.createElement("div");
      separatorLine.classList.add("line");
      response.append(separatorLine);

      const shortenUrlDiv = document.createElement("div");
      shortenUrlDiv.classList.add("shortened");
      response.append(shortenUrlDiv);

      const shortenUrl = document.createElement("a");
      shortenUrl.innerHTML = url.shortenedUrl;
      shortenUrlDiv.append(shortenUrl);

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      shortenUrlDiv.append(copyBtn);
      copyBtn.addEventListener("click", () => {
        clipboard(shortenUrl.innerHTML);
        copyBtn.classList.add("active");
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.classList.remove("active");
          copyBtn.textContent = "Copy";
        }, 2000);
      });
    });
  }
};

loadLocalStorage();
