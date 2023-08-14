const clouds = [
  {
    variant: "./Cloud1.svg",
  },
  {
    variant: "./Cloud2.svg",
  },
  {
    variant: "./Cloud3.svg",
  },
  {
    variant: "./Cloud4.svg",
  },
  {
    variant: "./Cloud5.svg",
  },
  {
    variant: "./Cloud6.svg",
  },
  {
    variant: "./Cloud7.svg",
  },
];

const notepadEl = document.querySelector("#notepad");
const submitButton = document.querySelector(".submit");
const notesPendingEl = document.querySelector("#notes-pending");
const charCounter = document.querySelector("#char-counter");
const noteLimitWarning = document.querySelector("#note-limit-warning");
const propeller = document.querySelector(".blimp-propeller");
const blimp = document.querySelector(".blimp");
// const sortButton = document.querySelector(".sort-button");

const localStorageKey = "noteList";
let noteList = JSON.parse(localStorage.getItem(localStorageKey)) || [];

const maxNoteCount = 5;

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  createNote();
});

function createNote() {
  const noteText = notepadEl.value.trim();
  if (noteText !== "") {
    if (noteList.length >= maxNoteCount) {
      noteLimitWarning.textContent = `You can only create ${maxNoteCount} notes`;
      return;
    }

    const note = {
      name: noteText,
      id: Date.now(),
    };

    noteList.push(note);
    updateLocalStorage();

    createNoteHtml(note);

    notepadEl.value = "";
    noteLimitWarning.textContent = "";
  }
}

notepadEl.addEventListener("input", adjustTextareaHeight);

function adjustTextareaHeight() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";

  const remainingChars = 100 - this.value.length;
  charCounter.textContent = `${remainingChars} characters remaining`;

  if (remainingChars <= 10) {
    charCounter.style.color = "rgb(150, 0, 0)";
  } else {
    charCounter.style.color = "rgb(1, 75, 100)";
  }
}

window.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    createNote();
  }
});

function updateLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(noteList));
}

function removeNoteFromList(noteId) {
  noteList = noteList.filter((note) => note.id !== noteId);
  updateLocalStorage();
}

function renderPendingNotes() {
  notesPendingEl.textContent = "";
  noteList.forEach(createNoteHtml);
}

function createNoteHtml(note) {
  const noteDiv = document.createElement("div");
  noteDiv.className = "note";

  const noteParagraph = document.createElement("p");
  noteParagraph.textContent = note.name;

  const removeButton = document.createElement("button");
  removeButton.classList.add("x");
  removeButton.textContent = "𐄂";

  removeButton.addEventListener("click", function () {
    const cloudContainer = this.parentElement.parentElement;
    const noteId = note.id;
    notesPendingEl.removeChild(cloudContainer);
    removeNoteFromList(noteId);
  });

  noteDiv.appendChild(noteParagraph);
  noteDiv.appendChild(removeButton);

  const cloudContainer = document.createElement("div");
  cloudContainer.className = "cloud-container";
  cloudContainer.setAttribute("data-note", note.name);
  const cloudIndex = noteList.findIndex((n) => n.id === note.id);
  const cloudVariant = clouds[cloudIndex % clouds.length].variant;
  const cloudImage = new Image();
  cloudImage.src = cloudVariant;

  cloudContainer.appendChild(cloudImage);
  cloudContainer.appendChild(noteDiv);

  notesPendingEl.appendChild(cloudContainer);
}

renderPendingNotes();

function handleForm(event) {
  event.preventDefault();
  const noteText = notepadEl.value.trim();
  if (noteText !== "") {
    createNote();
    notepadEl.value = "";
  }
}

const form = document.querySelector("form");
form.addEventListener("submit", handleForm);

blimp.addEventListener("click", function () {
  propeller.style.animation = "dropProp 1s ease-out forwards";
  blimp.style.animation = "getLost 1.3s ease-out forwards";
});
