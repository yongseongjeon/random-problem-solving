import workbookProblems from "./data/data.js";
import util from "./util/util.js";

const $ = (selector) => document.querySelector(selector);
const { getRandNum, localStorage } = util;

const $button = $("#button");
const $inputCount = $("#inputCount");
const $resultArea = $(".result");
const [$maxCount, $totalCount, $savedCount, $calculatedCount] = [
  $("#maxCount"),
  $("#totalCount"),
  $("#savedCount"),
  $("#calculatedCount"),
];
const $resetButton = $("#resetButton");

const problems = [...Object.values(workbookProblems)].join().split(",");

const LOCALSTORAGE_KEY_NAME = "random-PS";
const MIN_PROBLEM_IDX = 0;
const MAX_PROBLEM_IDX = problems.length - 1;

const TOTAL_COUNT = problems.length;
const MAX_COUNT = TOTAL_COUNT;

const getSavedProblemsCount = () =>
  localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)?.length || 0;
const getCalculatedProblemsCount = () => TOTAL_COUNT - getSavedProblemsCount();

const isEmpty = (value) => {
  return !value;
};

const isSavedIdx = (idx) => {
  if (!localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)) {
    return false;
  }

  const savedIdxs = [...localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)];
  return savedIdxs.includes(idx);
};

const getRandomProblems = (count) => {
  const results = [];

  const getSelectedIdx = () => getRandNum(MIN_PROBLEM_IDX, MAX_PROBLEM_IDX);

  const isDuplicateIdx = (idx) => {
    return results.includes(idx);
  };

  for (let i = 0; i < count; i++) {
    let selectedIdx = getSelectedIdx();

    while (isDuplicateIdx(selectedIdx) || isSavedIdx(selectedIdx)) {
      selectedIdx = getSelectedIdx();
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

  if (
    JSON.stringify([...localStorage.getLocalStorage(LOCALSTORAGE_KEY_NAME)]) !==
    JSON.stringify([...curTargetProblems])
  ) {
    alert("저장에 문제가 발생했습니다. 다시 시도해주세요.");
    return;
  }

  alert("저장되었습니다. 앞으로 이 문제들을 제외하고 문제를 추출합니다.");
  showCounts();
};

const createSaveButtonArea = (problemIdxs) => {
  const saveButtonArea = document.createElement("div");
  const infoMsg = `<p class="info">아래 버튼을 누르시면 앞으로는 아래 문제들을 제외하고 문제를 추출합니다.</p>`;
  const saveButton = document.createElement("button");

  saveButton.innerText = "현재 선택된 문제들 제외하기";
  saveButton.addEventListener("click", () => {
    saveSelectedProblems(problemIdxs);
  });

  saveButtonArea.innerHTML = infoMsg;
  saveButtonArea.appendChild(saveButton);

  return saveButtonArea;
};

const showResult = (results) => {
  $resultArea.innerHTML = "";

  const resultUl = document.createElement("ul");

  resultUl.innerHTML = results
    .map((result) => `<li>${problems[result]}</li>`)
    .join("");

  $resultArea.appendChild(createSaveButtonArea(results));
  $resultArea.appendChild(resultUl);
};

const showCounts = () => {
  $totalCount.innerText = TOTAL_COUNT;
  $savedCount.innerText = getSavedProblemsCount();
  $calculatedCount.innerText = getCalculatedProblemsCount();
};

const resetExtractedProblemsHandler = () => {
  const shouldResetExtractedProblems = confirm("정말 초기화하시겠습니까?");
  if (shouldResetExtractedProblems) {
    localStorage.removeFromLocalStorage(LOCALSTORAGE_KEY_NAME);
    alert("초기화 되었습니다.");
    location.reload();
  }
};

const inputHandler = (e) => {
  if (!(e.key === "-" || e.key === ".")) {
    return;
  }
  e.preventDefault();
};

const init = () => {
  $button.addEventListener("click", () => {
    const count = Number($inputCount.value);
    const calculatedProblemsCount = getCalculatedProblemsCount();

    const isValidInput = count <= calculatedProblemsCount;
    const isOverMaxCount = count > MAX_COUNT;

    if (!calculatedProblemsCount) {
      alert(`추출할 문제가 없습니다.`);
      return;
    }

    if (isOverMaxCount) {
      alert(`${MAX_COUNT}개 이하로 입력해주세요.`);
      return;
    }

    if (!isValidInput) {
      alert(`남은 문제가 ${calculatedProblemsCount}개 이하입니다.\n${calculatedProblemsCount}개 이하로 입력해주세요.
      `);
      return;
    }

    if (isEmpty(count)) {
      alert("최소 1개 이상을 입력하고 버튼을 눌러주세요.");
      return;
    }

    const selectedProblemsIdx = getRandomProblems(count);
    showResult(selectedProblemsIdx);
  });

  $resetButton.addEventListener("click", resetExtractedProblemsHandler);

  $inputCount.addEventListener("keydown", inputHandler);

  showCounts();
  $maxCount.innerText = MAX_COUNT;
  $inputCount.setAttribute("max", MAX_COUNT);
};

init();
