import workbookProblems from "./data/data.js";
import util from "./util/util.js";

const $ = (selector) => document.querySelector(selector);

const button = $("#button");
const inputCount = $("#inputCount");
const resultArea = $(".result");

const problems = [...Object.values(workbookProblems)].join().split(",");

const MIN_PROBLEM_IDX = 0;
const MAX_PROBLEM_IDX = problems.length - 1;
const LOCALSTORAGE_KEY_NAME = "random-PS";

const { getRandNum, localStorage } = util;

const isEmpty = (value) => {
  return !value;
};

const getRandomProblems = (count) => {
  const results = [];

  const selectIdx = () => getRandNum(MIN_PROBLEM_IDX, MAX_PROBLEM_IDX);

  const isDuplicateIdx = (idx) => {
    return results.includes(idx);
  };

  for (let i = 0; i < Number(count); i++) {
    let selectedIdx = selectIdx();

    while (isDuplicateIdx(selectedIdx)) {
      selectedIdx = selectIdx();
    }

    results.push(selectedIdx);
  }

  return results;
};

const saveSelectedProblems = (problemIds) => {
  if (!confirm("현재 선택된 문제들을 제외 목록에 추가하시겠습니까?")) {
    return;
  }

  let existProblems = [];
  if (localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)) {
    existProblems = [...localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)];
  }

  const curTargetProblems = [...existProblems, ...problemIds];

  localStorage.setLocalStorage(LOCALSTORAGE_KEY_NAME, curTargetProblems);
  console.log;

  if (
    JSON.stringify([...localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)]) !==
    JSON.stringify([...curTargetProblems])
  ) {
    alert("저장에 문제가 발생했습니다. 다시 시도해주세요.");
    return;
  }

  alert("저장되었습니다. 앞으로 이 문제들을 제외하고 문제를 뽑습니다.");
};

const createSaveButtonArea = (problemIds) => {
  const saveButtonArea = document.createElement("div");
  const infoMsg = `<p class="info">아래 버튼을 누르시면 앞으로는 위 문제들을 제외하고 문제들을 뽑습니다.</p>`;
  const saveButton = document.createElement("button");

  saveButton.innerText = "현재 선택된 문제들 제외하기";
  saveButton.addEventListener("click", () => {
    saveSelectedProblems(problemIds);
  });

  saveButtonArea.innerHTML = infoMsg;
  saveButtonArea.appendChild(saveButton);

  return saveButtonArea;
};

const showResult = (results) => {
  resultArea.innerHTML = "";

  const resultUl = document.createElement("ul");

  resultUl.innerHTML = results
    .map((result) => `<li>${problems[result]}</li>`)
    .join("");

  resultArea.appendChild(resultUl);
  resultArea.appendChild(createSaveButtonArea(results));
};

const init = () => {
  button.addEventListener("click", () => {
    const count = Number(inputCount.value);

    if (isEmpty(count)) {
      alert("최소 1개 이상을 입력하고 버튼을 눌러주세요.");
      return;
    }

    const selectedProblemsIdx = getRandomProblems(count);
    showResult(selectedProblemsIdx);
  });
};

init();
