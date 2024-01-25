
let boxes = document.querySelectorAll("main input");
window.onload = () => {
  boxes[0].focus();
};

fetch("dictionary.json")
  .then((response) => response.json())
  .then((data) => {
    const dict = data;
    let tragetWord = dict[Math.floor(Math.random() * 12972)];
    const pattern = /[a-zA-Z]{1}/i;

    function insertLetter(box) {
      if (pattern.test(box.value)) {
        let index = box.dataset.index;
        if (index != 5) {
          box.nextElementSibling.focus();
        } else {
          let line = box.parentElement;
          checkWord(line);
        }
      } else {
        box.value = "";
      }
    }

    function checkWord(line) {
      let inputs = [...line.children];
      let word = "";
      inputs.forEach((input) => {
        word += input.value;
      });

      if (wordExists(word)) {
        let tempTargetWord = [...tragetWord];
        inputs.forEach((element, i) => {
          let color = "";
          let CurrentLetter = element.value;

          if (CurrentLetter == tempTargetWord[i]) {
            color = "#6aaa64";
            tempTargetWord[i] = null;
          } else if (
            CurrentLetter != tempTargetWord[i] &&
            tempTargetWord.indexOf(CurrentLetter) >= 0
          ) {
            tempTargetWord[tempTargetWord.indexOf(CurrentLetter)] = null;
            color = "#b59f3b";
          } else {
            color = "#363636";
          }

          setTimeout(() => {
            element.classList.add("active");
            element.style.backgroundColor = color;
            element.style.border = "none";
          }, (i + 1) * 300);
        });

        if (word == tragetWord) {
          let winPopup = document.querySelector(".win");
          setTimeout(() => {
            winPopup.style.display = "flex";
          }, 2500);
        } else {
          if (line.dataset.num == 6) {
            let losePopup = document.querySelector(".lose");
            setTimeout(() => {
              losePopup.style.display = "flex";
            }, 2500);
            losePopup.children[1].innerHTML = `The Word Was : ${tragetWord.toUpperCase()}`;
          }
        }
        if (line.dataset.num < 6) {
          line.nextElementSibling.children[0].focus();
        }
      } else {
        line.classList.add("shake");
      }
    }
    function wordExists(word) {
      return dict.indexOf(word) >= 0 ? true : false;
    }
    boxes.forEach((box) => {
      box.addEventListener("input", function () {
        insertLetter(box);
      });

      let index = box.dataset.index;
      if (index > 1) {
        box.addEventListener("keydown", function (event) {
          const key = event.key;
          if (key === "Backspace" || key === "Delete") {
            box.value = "";
            box.parentElement.classList.remove("shake");
            box.previousElementSibling.focus();
          }
        });
      }
    });
  });
