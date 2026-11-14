let currentMediaQuery = "";

function handleMediaQuery(queryName, x) {
  if (x.matches) currentMediaQuery = queryName;
}

const mq1 = window.matchMedia("(min-width: 300px) and (max-width: 700px)");
const mq2 = window.matchMedia("(min-width: 700px) and (max-width: 1200px)");
const mq3 = window.matchMedia("(min-width: 1200px)");

[
  ["mq1", mq1],
  ["mq2", mq2],
  ["mq3", mq3],
].forEach(([name, mq]) => {
  handleMediaQuery(name, mq);
  mq.addEventListener("change", () => handleMediaQuery(name, mq));
});
