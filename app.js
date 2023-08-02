"use strict";
(() => {
  const userName = document.querySelector(".name");
  const email = document.querySelector(".email");
  const password = document.querySelector(".password");
  const setBtn = document.querySelector(".set");
  const checkBtn = document.querySelector(".check");
  const resetBtn = document.querySelector(".reset");

  let time = "";
  let timeToCheck = "";
  let timesArray = [];
  let timesArrayToCheck = [];
  let lettersArray = [];
  let lettersArrayToCheck = [];
  let passwordAndTimeToTest = [];
  let calculatedTime = [];
  let calculatedTimeInLS = [];
  let calculatedTimeUI;
  let calculatedTimeInLSUI;

  // Regex check if email is valid
  const format =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<div>()[\]\.,;:\s@\"]{2,})$/i;

  // html UI warnings
  const htmlRequired = `<div class="required"><h3>Fill out the form properly</h3></div>`;
  const htmlInvalidEmail = `<div class="invalidEmail"><h3>Invalid email</h3></div>`;
  const allSetAndSaved = `<div class="allSet"><h3>Nice, all data saved</h3></div>`;
  const nameIsCorrect = `<div class="nameCorrect"><h3>Name is correct 👍</h3></div>`;
  const nameIsIncorrect = `<div class="nameIncorrect"><h3>Name is Incorrect ⛔ </h3></div>`;
  const emailIsIncorrect = `<div class="emailIncorrect"><h3>Email is Incorrect ⛔ </h3></div>`;
  const emailIsCorrect = `<div class="emailCorrect"><h3>Email is correct 👍</h3></div>`;
  const lettersAreOK = `<div class="lettersOK"><h3>Characters are OK, but the timing 🤔</h3></div>`;
  const lettersAreIncorrect = `<div class="lettersIncorrect"><h3>Incorrect characters ⛔</h3></div>`;
  const allCorrect = `<div class="allMatches"><h3>Nice 😃</h3></div>`;

  checkBtn.style.display = "none";
  resetBtn.style.display = "none";

  // Check LS
  if (localStorage.getItem("name") !== null) {
    setBtn.style.display = "none";
    checkBtn.style.display = "block";
    resetBtn.style.display = "block";
  }

  // To prevent saving key "tab" on keyup event
  document.querySelector(".password").tabIndex = "-1";
  password.addEventListener("keyup", getTimesAndCharacters);

  setBtn.addEventListener("click", (e) => {
    formvalidationFirst();

    timesArrayToCheck = [];
    lettersArrayToCheck = [];
    timesArray = [];
    lettersArray = [];

    e.preventDefault();
  });

  password.addEventListener("keyup", saveTimesAndCharsToCompare);

  // Checking all data entered with data in LS
  checkBtn.addEventListener("click", (e) => {
    formvalidationSecond();

    const nameAndEmailInLS = [];
    const timesAndCharsInLS = [];
    nameAndEmailInLS.push(JSON.parse(localStorage.getItem("name")));
    timesAndCharsInLS.push(JSON.parse(localStorage.getItem("charTime")));
    const str = String(timesAndCharsInLS[0][0].length - 1);

    const infoToUser = `<div class="infoUser"><h3>You have a password with ${
      timesAndCharsInLS[0][0].length
    } characters, <br /> thus there are ${str} measurements. <br /> The hacking time of this password could take up to a ~ 1000${str.sup()}
   times more </h3></div>`;
    !document.querySelector(".infoUser")
      ? document
          .querySelector(".intro")
          .insertAdjacentHTML("beforeend", infoToUser)
      : "";

    calculatedTime = [];
    calculatedTimeInLS = [];
    for (let i = 0; i < timesArray.length; i++) {
      calculatedTime.push(timesArray[i + 1] - timesArray[i]);
    }
    calculatedTime.pop();

    for (let i = 0; i < timesAndCharsInLS[0][1].length; i++) {
      calculatedTimeInLS.push(
        timesAndCharsInLS[0][1][i + 1] - timesAndCharsInLS[0][1][i]
      );
    }
    calculatedTimeInLS.pop();
    JSON.stringify(calculatedTime);
    JSON.stringify(calculatedTimeInLS);
    calculatedTimeUI = String(calculatedTime);
    calculatedTimeInLSUI = String(calculatedTimeInLS);

    const mSecondsInLS = `<div class="mSecondsInLocalStorage">Saved milliseconds among password characters are: <br />${calculatedTimeInLSUI}</div>`;
    if (!document.querySelector(".mSecondsInLocalStorage")) {
      userName.insertAdjacentHTML("beforebegin", mSecondsInLS);
    }
    const mSeconds = `<div class="mSecondsCurrent">Current milliseconds among password characters are: <br />${calculatedTime}</div>`;
    if (!document.querySelector(".mSecondsCurrent")) {
      document
        .querySelector(".showCurrTimes")
        .insertAdjacentHTML("beforebegin", mSeconds);
      const currTimes = document.querySelector(".mSecondsCurrent");
      removeWarnings(currTimes, 15000);
    }

    // Name is incorrect
    if (
      JSON.parse(localStorage.getItem("name"))[0] !== userName.value &&
      userName.value
    ) {
      !document.querySelector(".nameIncorrect")
        ? email.insertAdjacentHTML("beforebegin", nameIsIncorrect)
        : "";
      const nameIncorrect = document.querySelector(".nameIncorrect");
      removeWarnings(nameIncorrect, 15000);
    }

    // Name is correct
    if (JSON.parse(localStorage.getItem("name"))[0] === userName.value) {
      !document.querySelector(".nameCorrect")
        ? email.insertAdjacentHTML("beforebegin", nameIsCorrect)
        : "";
      const nameOK = document.querySelector(".nameCorrect");
      removeWarnings(nameOK, 15000);
    }

    // Email is incorrect
    if (
      (JSON.parse(localStorage.getItem("name"))[0] === userName.value ||
        JSON.parse(localStorage.getItem("name"))[0] !== userName.value ||
        !userName.value) &&
      JSON.parse(localStorage.getItem("name"))[1] !== email.value &&
      email.value.match(format) &&
      email.value
    ) {
      !document.querySelector(".emailIncorrect")
        ? password.insertAdjacentHTML("beforebegin", emailIsIncorrect)
        : "";
      const emailNotOK = document.querySelector(".emailIncorrect");
      removeWarnings(emailNotOK, 15000);
    }
    // Email is correct
    if (
      (JSON.parse(localStorage.getItem("name"))[0] === userName.value ||
        JSON.parse(localStorage.getItem("name"))[0] !== userName.value ||
        !userName.value) &&
      JSON.parse(localStorage.getItem("name"))[1] === email.value
    ) {
      !document.querySelector(".emailCorrect")
        ? password.insertAdjacentHTML("beforebegin", emailIsCorrect)
        : "";
      const emailOK = document.querySelector(".emailCorrect");
      removeWarnings(emailOK, 15000);
    }
    // Incorrect characters and timing
    if (
      JSON.stringify(timesAndCharsInLS[0][0]) !==
        JSON.stringify(lettersArray) &&
      password.value
    ) {
      password.value = "";

      !document.querySelector(".lettersIncorrect")
        ? checkBtn.insertAdjacentHTML("beforebegin", lettersAreIncorrect)
        : "";
      const lettersDoNotMatch = document.querySelector(".lettersIncorrect");
      removeWarnings(lettersDoNotMatch, 15000);
    }
    // Correct characters - incorrect timing
    if (
      JSON.stringify(timesAndCharsInLS[0][0]) ===
        JSON.stringify(lettersArray) &&
      calculatedTime !== calculatedTimeInLS
    ) {
      password.value = "";

      !document.querySelector(".lettersOK")
        ? checkBtn.insertAdjacentHTML("beforebegin", lettersAreOK)
        : "";
      const lettersMatch = document.querySelector(".lettersOK");
      removeWarnings(lettersMatch, 15000);
    }

    JSON.stringify(calculatedTime);
    JSON.stringify(calculatedTimeInLS);

    if (
      JSON.parse(localStorage.getItem("name"))[0] === userName.value &&
      JSON.parse(localStorage.getItem("name"))[1] === email.value &&
      timesAndCharsInLS[0][0].length == 1
    ) {
      document.querySelector(".lettersOK").style.display = "none";
      checkBtn.style.display = "none";
      const nothingToCheck = `<div class="nothing"><h3>There was nothing to check, try again.</h3></div>`;
      checkBtn.insertAdjacentHTML("beforebegin", nothingToCheck);
    }
    // All correct

    if (
      JSON.parse(localStorage.getItem("name"))[0] === userName.value &&
      JSON.parse(localStorage.getItem("name"))[1] === email.value &&
      JSON.stringify(timesAndCharsInLS[0][0]) ===
        JSON.stringify(lettersArray) &&
      calculatedTime === calculatedTimeInLS
    ) {
      document.querySelector(".lettersOK").style.display = "none";
      !document.querySelector(".allMatches")
        ? checkBtn.insertAdjacentHTML("beforebegin", allCorrect)
        : "";
      const allGood = document.querySelector(".allMatches");
      checkBtn.style.display = "none";
    }

    timesArray = [];
    lettersArray = [];

    e.preventDefault();
  });

  // Checking form at start
  function formvalidationFirst() {
    formvalidationBasic();
    if (
      userName.value &&
      email.value &&
      password.value &&
      email.value.match(format)
    ) {
      let nameAndEmail = [];
      if (localStorage.getItem("name") === null) {
        if (userName.value && email.value && password.value) {
          nameAndEmail.push(userName.value, email.value);
          localStorage.setItem("name", JSON.stringify(nameAndEmail));
        }
      }

      let timesAndChars = [];
      if (localStorage.getItem("charTime") === null) {
        if (userName.value && email.value && password.value) {
          timesAndChars.push(lettersArray, timesArray);
          localStorage.setItem("charTime", JSON.stringify(timesAndChars));
        }
      }

      setBtn.insertAdjacentHTML("beforebegin", allSetAndSaved);
      setTimeout(() => {
        document.querySelector(".allSet").remove();
      }, 4000);
      userName.value = "";
      email.value = "";
      password.value = "";
      setBtn.style.display = "none";
      checkBtn.style.display = "block";
      resetBtn.style.display = "block";
    }
  }

  function formvalidationSecond() {
    formvalidationBasic();
  }

  function formvalidationBasic() {
    if (!userName.value || !email.value || !password.value) {
      eraseData();
      !document.querySelector(".required")
        ? setBtn.insertAdjacentHTML("beforebegin", htmlRequired)
        : "";
      const required = document.querySelector(".required");
      removeWarnings(required, 6000);
    }
    if (email.value && !email.value.match(format)) {
      eraseData();
      !document.querySelector(".invalidEmail")
        ? password.insertAdjacentHTML("beforebegin", htmlInvalidEmail)
        : "";
      const invalidEmail = document.querySelector(".invalidEmail");
      removeWarnings(invalidEmail, 6000);
    }
  }

  // Pushing values into the arrays
  function getTimesAndCharacters(e) {
    time = Date.now();
    timesArray.push(time);
    lettersArray.push(e.key);
  }
  function saveTimesAndCharsToCompare(e) {
    timeToCheck = Date.now();
    timesArrayToCheck.push(timeToCheck);
    lettersArrayToCheck.push(e.key);
  }

  // Clearing LS
  resetBtn.addEventListener("click", (e) => {
    localStorage.clear();
    setBtn.style.display = "block";
    checkBtn.style.display = "none";
    resetBtn.style.display = "none";
    timesArray = [];
    lettersArray = [];
    timesArrayToCheck = [];
    lettersArrayToCheck = [];
    userName.value = "";
    email.value = "";
    password.value = "";
    document.querySelector(".mSecondsInLocalStorage")
      ? (document.querySelector(".mSecondsInLocalStorage").style.cssText =
          "display: none")
      : "";
    document.querySelector(".nothing")
      ? (document.querySelector(".nothing").style.display = "none")
      : "";
    document.querySelector(".infoUser")
      ? (document.querySelector(".infoUser").style.display = "none")
      : "";
    e.preventDefault();
  });

  // ***************************  Helper functions *******************************

  // Remove warnings
  function removeWarnings(className, time) {
    setTimeout(() => {
      className.remove();
    }, time);
  }
  // Erase data from arrays => timesArrayToCheck, lettersArrayToCheck
  function eraseData() {
    password.value = "";
    timesArray = [];
    lettersArray = [];
  }
})();
