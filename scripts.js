const logo = document.getElementById("logo");
const gridItems = document.querySelectorAll(".work");
const numRows = 3;
const numCols = 6;

//Smooth Animation

const lenis = new Lenis({
  duration: 2.0,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin)

//Functions

function handleScrollProgress(progress, variableName) {
  CABLES.patch.setVariable(variableName, progress);
  // console.log(progress)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//OnLoaded Scripts

window.addEventListener('load', function () {
  $("a.tint").on("click", function (e) {
    e.preventDefault();
    var destination = $(this).attr("href");
    console.log(destination);
    let tl = new TimelineMax({
      onComplete: function () {
        window.location = destination;
      },
    });

    tl.to("body", { opacity: 0 });
  });

  /////////// Context Index /////////// 

  if (pageContext == "index") {
    const workElements = document.querySelectorAll(".work");
    const workArray = Array.from(workElements);
    const gridContainer = document.querySelector(".collection-list");
    const navLinks = document.querySelectorAll(".nav-link");

    const usedPositions = new Set();

    if (mq3.matches) {
      gridItems.forEach((item) => {
        let randomRow, randomCol;
        do {
          randomRow = Math.floor(Math.random() * numRows) + 1;
          randomCol = Math.floor(Math.random() * numCols) + 1;
        } while (usedPositions.has(`${randomRow}-${randomCol}`));

        usedPositions.add(`${randomRow}-${randomCol}`);

        item.style.gridRow = randomRow;
        item.style.gridColumn = randomCol;
        // item.style.marginTop = String(getRandomInt(0, 100)) + 'px';
      });
    }

    gridItems.forEach(item => {
      const depth = Math.floor(Math.random() * (100 - (-100) + 1)) - 100; // Generate random integers between -50 and 50


      gsap.to(item, {
        yPercent: () => {
          return depth;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: "#workList",
          scrub: 1
        }
      });
    });
  }

  /////////// Context Works /////////// 

  if (pageContext == "works") {
    var cmsVideos = document.querySelectorAll('[data-vid="works"]');
    var cmsImages = document.querySelectorAll('[data-img="works"]');
    var imageUrls = [];
    var imageAlt = [];

    // Adding video links to imageUrls array at the beginning
    cmsVideos.forEach(function (cmsVideo) {
      imageUrls.unshift(cmsVideo.href);
      imageAlt.unshift("video1");
    });

    // Adding image links to imageUrls array
    cmsImages.forEach(function (cmsImage) {
      imageUrls.push(cmsImage.src);
      imageAlt.push(cmsImage.alt);
    });

    CABLES.patch.setVariable("videoUrl", imageUrls[0]);

    const imageListContainer = document.getElementById('imageList');
    const cursorElement = document.getElementById('cursor');

    let currentImageIndex = 0;

    function updateActiveItem(index) {
      const listItems = imageListContainer.querySelectorAll('li');
      listItems.forEach(item => {
        item.classList.remove('active');
      });
      listItems[index].classList.add('active');
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
      updateActiveItem(currentImageIndex);
      // console.log(imageUrls[currentImageIndex]);
      CABLES.patch.setVariable("imageUrl", imageUrls[currentImageIndex]);
    }

    cursorElement.addEventListener('click', () => {
      showNextImage();
      const clickedImageUrl = imageUrls[currentImageIndex];
    });

    // Iterate through the arrays and create list items
    for (let i = 0; i < imageUrls.length; i++) {
      const listItem = document.createElement('li');

      const anchor = document.createElement('a');
      anchor.setAttribute('data-url', imageUrls[i]); // Store URL in a custom attribute
      anchor.textContent = imageAlt[i];

      listItem.appendChild(anchor);
      imageListContainer.appendChild(listItem);

      anchor.addEventListener('click', (event) => {
        event.preventDefault();
        const clickedImageUrl = event.target.getAttribute('data-url'); // Retrieve URL from custom attribute
        currentImageIndex = imageUrls.indexOf(clickedImageUrl);
        updateActiveItem(currentImageIndex);
        CABLES.patch.setVariable("imageUrl", clickedImageUrl);
      });
    }
    updateActiveItem(currentImageIndex);

    // Function to handle intersection observer callback
    function handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const url = entry.target.dataset.media;
          const index = imageUrls.indexOf(url);
          if (index !== -1) {
            currentImageIndex = index;
            updateActiveItem(currentImageIndex);
            CABLES.patch.setVariable("imageUrl", imageUrls[currentImageIndex]);
          }
        }
      });
      console.log(imageUrls[currentImageIndex])
    }

    // Use Intersection Observer to detect when an image enters the viewport
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

    // Observe each image element
    imageUrls.forEach(url => {
      const container = document.createElement('div');
      container.setAttribute('data-media', url); // Set a data attribute for each URL
      container.style.height = '100vh'; // Ensure divs are the full height of the viewport
      container.style.visibility = 'hidden';
      document.body.appendChild(container);
      observer.observe(container);
    });

    var timeline = new TimelineMax();
    timeline
      .from("body", 1, { autoAlpha: 0 }, 0.5)
      .from("#logo", 1, { autoAlpha: 0 }, 0)
      .from(".heading", 1, { x: -50, autoAlpha: 0 }, 0.5)
      .from(".textlist", 1, { x: -50, autoAlpha: 0 }, 0.5)
      .from("#description", 1, { x: -50, autoAlpha: 0 }, 0.8)
      .to("#multiplier", 1, { opacity: 1 }, 0.8);

    let sections = gsap.utils.toArray(".galleryelement");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: "#gallery",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + document.querySelector("#gallery").offsetWidth,
      },
    });

  }
});

/////////// General Functions /////////// 

// Logo player

LottieInteractivity.create({
  container: "body",
  player: "#logoPlayer",
  mode: "scroll",

  actions: [
    {
      visibility: [0, 2.0],
      type: "seek",
      loop: true,
      frames: [0, 113],
    },
  ],
});

