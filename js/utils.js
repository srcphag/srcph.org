gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function handleScrollProgress(progress, variableName) {
  CABLES.patch.setVariable(variableName, progress);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createOrderedRandomArray(size, minStep, maxStep) {
  const array = [];
  let currentValue = 0;

  for (let i = 0; i < size; i++) {
    currentValue += getRandomInt(minStep, maxStep);
    array.push(currentValue);
  }

  return array;
}

function getElementPosition(elementId) {
  const element = document.querySelector(elementId);
  if (!element) {
    console.error("Element not found!");
    return;
  }

  const rect = element.getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom };
}

function isElementVisible(elementSelector) {
  const element = document.querySelector(elementSelector);
  if (!element || !element.parentElement) return false;

  const style = window.getComputedStyle(element);

  // Check basic visibility properties
  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;
  if (style.opacity === "0") return false;

  // Check element dimensions
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  // Check if element is within viewport
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return !(
    rect.bottom < 0 ||
    rect.top > windowHeight ||
    rect.right < 0 ||
    rect.left > windowWidth
  );
}

function highlightMenuItem(index) {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => link.classList.remove("highlight"));
  navLinks[index].classList.add("highlight");
}

function scrollToSectionGsap(sectionName, durationLength, offset = 0) {
  if (isScrolling) return; // Prevent multiple calls while scrolling

  const section = document.querySelector(`.${sectionName}`);
  if (!section) return;

  isScrolling = true;

  gsap.to(window, {
    duration: durationLength,
    scrollTo: {
      y: section,
      offsetY: offset,
      autoKill: false,
    },
    ease: "power3.out",
    onComplete: () => {
      isScrolling = false;
    },
  });
}

function scrollToLastWork(sectionName, durationLength = 1, offset = 0) {
  const elements = document.querySelectorAll(sectionName);
  const lastElement = elements[elements.length - 1];

  if (lastElement) {
    isScrolling = true;
    gsap.to(window, {
      duration: durationLength,
      scrollTo: {
        y: lastElement,
        offsetY: offset,
        autoKill: false,
      },
      ease: "power3.out",
      onComplete: () => {
        isScrolling = false;
      },
    });
  }
}

function vhToPx(vh) {
  return (window.innerHeight * vh) / 100;
}

$("a.tint").on("click", function (e) {
  e.preventDefault();
  var destination = $(this).attr("href");

  let tl = new TimelineMax({
    onComplete: function () {
      window.location = destination;
    },
  });

  tl.to("body", { opacity: 0 });
});
