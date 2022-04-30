import workbookProblems from "./data/data.js";
import util from "./util/util.js";

const $ = (selector) => document.querySelector(selector);

const button = $("#button");
const inputCount = $("#inputCount");
const resultArea = $(".result");

const problems = [...Object.values(workbookProblems)].join().split(",");

const MIN_PROBLEM_IDX = 0;
const MAX_PROBLEM_IDX = problems.length - 1;

const { getRandNum } = util;

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

const showResult = (results) => {
  resultArea.innerHTML = "";

  const resultUl = document.createElement("ul");

  resultUl.innerHTML = results
    .map((result) => `<li>${problems[result]}</li>`)
    .join("");
  resultArea.appendChild(resultUl);
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
