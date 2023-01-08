const passwordForm = document.querySelector(".FORM");
const cardsContainer = document.querySelector(".CARDS");
passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(passwordForm).entries());
  const password = generatePassword(data);
  createNewCard(data["URL"], data["Name"], password);
  modifyStorage(data["URL"], data["Name"], password)
});

let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let lowercase = "abcdefghijklmnopqrstuvwxyz";
let symbols = "!@#$%^&*";
let numbers = "0123456789";
const generatePassword = ({
  Symbols = "off",
  Numbers = "off",
  Uppercase = "off",
}) => {
  let passwordLength = Math.floor(Math.random() * 8) + 10;
  let conjoinedRandomPasswordString = lowercase;
  if (Symbols == "on") conjoinedRandomPasswordString += symbols;
  if (Numbers == "on") conjoinedRandomPasswordString += numbers;
  if (Uppercase == "on") conjoinedRandomPasswordString += uppercase;
  return [...new Array(passwordLength)].reduce((a) => {
    const randomSelection =
      conjoinedRandomPasswordString[
        Math.floor(Math.random() * conjoinedRandomPasswordString.length)
      ];
    return a + randomSelection;
  }, "");
};

const createNewCard = (url, name, password) => {
  const newCard = document.createElement("div");
  newCard.innerHTML = `<div
          class="bg-[#FAFFFD] rounded text-[#342E37] hover:bg-[#e8edeb] transition relative"
        >
          <a href="${url}" target="_blank" class="block p-4">
            <h4 class="text-3xl mb-4">${name}</h4>
            <p class="text-xl">${password}</p>
          </a>
          <div class="absolute top-[.5rem] right-[.5rem] text-slate-400 hover:text-red-400 transition cursor-pointer CARD_DELETE">
          <i class="fa-regular fa-trash-can"></i>
          </div>
        </div>`;
  const cardDelete = newCard.querySelector(".CARD_DELETE");
  cardDelete.addEventListener("click", ()=>{
    modifyStorage(url, name, password, "remove")
    cardsContainer.removeChild(newCard);
  })
  cardsContainer.appendChild(newCard);
};

const modifyStorage = (url, name, password, type="add") =>{
    let storage = JSON.parse(localStorage.getItem("passwords") || "[]");
    if(type=="add"){
        storage.push({ name: name, value: password, link: url });
    }else{
        storage = storage.filter(i=>i.value!==password);
    }
    localStorage.setItem("passwords", JSON.stringify(storage));
}

window.addEventListener("load", () => {
  const startingPasswords = JSON.parse(localStorage.getItem("passwords"));
  if (startingPasswords) {
    startingPasswords.forEach(({ name, value, link }) => {
        createNewCard(link, name, value);
    });
  }
})

