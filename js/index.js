document.addEventListener("CABLES.jsLoaded", function (event) {
  if (pageContext == "index") {
    const createTriggers = (triggers) =>
      triggers.forEach((t) => ScrollTrigger.create(t));

    // Setting players
    videojs(document.querySelector(".videojs-work"), {
      controls: false,
      autoplay: false,
      preload: "auto",
      muted: true,
    });

    const aboutPlayer = videojs(document.querySelector(".videojs-about"), {
      controls: false,
      autoplay: false,
      preload: "auto",
      muted: true,
      loop: true,
    });

    // Play the about video only while it is in the viewport
    const aboutVideoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutPlayer.muted(true);
            aboutPlayer.play().catch(console.error);
          } else {
            aboutPlayer.pause();
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    aboutVideoObserver.observe(document.querySelector(".videojs-about"));

    /// mq3

    if (mq3.matches) {
      const usedPositions = new Set();
      const numRows = 5;
      const numCols = 5;

      gridItems.forEach((item) => {
        // Random position on grid
        let randomRow, randomCol;
        do {
          randomRow = getRandomInt(1, numRows);
          randomCol = getRandomInt(1, numCols);
        } while (usedPositions.has(`${randomRow}-${randomCol}`));

        usedPositions.add(`${randomRow}-${randomCol}`);

        item.style.gridRow = randomRow;
        item.style.gridColumn = randomCol + 1;

        // Scroll-linked depth
        gsap.to(item, {
          yPercent: getRandomInt(-50, 50),
          ease: "none",
          scrollTrigger: {
            trigger: "#workList",
            scrub: 1,
          },
        });
      });

      workElements.forEach((container) => {
        const videoElement = container.querySelector(".videojs-work");
        const descriptionElement = container.querySelector(".description");
        const titleElement = container.querySelector(".title");

        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          descriptionElement,
          { x: -30 },
          { x: 0, duration: 0.2, ease: "power2.out" }
        );

        if (videoElement) {
          const player = videojs(videoElement);

          container.addEventListener("mouseenter", function () {
            player.muted(true);
            player.play();
            mainColor = container.getAttribute("color");
            CABLES.patch.setVariable("mainColorHex", mainColor);
          });

          container.addEventListener("mouseleave", function () {
            player.muted(true);
            player.pause();
            mainColor = "#0d0d0d";
            CABLES.patch.setVariable("mainColorHex", mainColor);
          });
        }

        container.addEventListener("mouseenter", (event) => {
          container.classList.add("workIndex");
          titleElement.classList.add("textVisible");
          descriptionElement.classList.add("visibleDescription");
          tl.progress(0);
          tl.play();
        });

        container.addEventListener("mouseleave", () => {
          container.classList.remove("workIndex");
          titleElement.classList.remove("textVisible");
          descriptionElement.classList.remove("visibleDescription");
        });
      });
    }

    /// mq2

    if (mq2.matches) {
      const numCols = 3;
      const indexRows = createOrderedRandomArray(gridItems.length, 1, 2);

      gridItems.forEach((item, index) => {
        item.style.gridColumn = (index % numCols) + 1;
        item.style.gridRow = indexRows[index];
        item.style.transform = `translateY(${getRandomInt(-20, 200)}px)`;
      });
    }

    /// Scroll control

    if (mq3.matches) {
      createTriggers([
        {
          trigger: "#work",
          start: "top 30%",
          end: "bottom 80%",
          onEnter: () => {
            scrollToSectionGsap("collection-list", 2, 65);
            highlightMenuItem(1);
          },
          onLeave: () => {
            scrollToSectionGsap("about", 2, 0);
            highlightMenuItem(2);
          },
          onEnterBack: () => {
            scrollToSectionGsap("collection-list", 2, 65);
            highlightMenuItem(1);
          },
          onLeaveBack: () => {
            scrollToSectionGsap("header", 2, 0);
            highlightMenuItem(2);
          },
        },
        {
          trigger: "#workList",
          start: "top 90%",
          end: "bottom bottom",
          onEnter: () => {
            CABLES.patch.setVariable("stringTexture", "works");
          },
          onLeave: () => {
            CABLES.patch.setVariable("stringTexture", "about");
            CABLES.patch.setVariable("mainColorHex", "#0b00ff");
          },
          onEnterBack: () => {
            CABLES.patch.setVariable("stringTexture", "works");
          },
        },
      ]);
    }

    if (mq1.matches || mq2.matches) {
      const isMobile = mq1.matches;
      const marginBottom = vhToPx(isMobile ? 10 : 35);

      const triggers = [
        {
          trigger: "#work",
          start: isMobile ? "top 90%" : "top 50%",
          end: isMobile ? "bottom 60%" : "bottom 50%",
          onEnter: () => {
            scrollToSectionGsap("work", 1, "65");
            highlightMenuItem(1);
          },
          onLeave: () => {
            scrollToSectionGsap("about", 1);
            highlightMenuItem(2);
          },
          onEnterBack: () => {
            if (isMobile) scrollToLastWork(".work", 1, "65");
            highlightMenuItem(1);
          },
          onLeaveBack: () => {
            scrollToSectionGsap("header", 1);
            highlightMenuItem(0);
          },
        },
        {
          trigger: "#workList",
          start: "bottom 10%",
          end: "bottom bottom",
          onEnter: () => {
            CABLES.patch.setVariable("stringTexture", "works");
          },
          onLeave: () => {
            CABLES.patch.setVariable("stringTexture", "about");
            CABLES.patch.setVariable("mainColorHex", "#0b00ff");
          },
          onEnterBack: () => {
            CABLES.patch.setVariable("stringTexture", "works");
          },
          onLeaveBack: () => {
            CABLES.patch.setVariable("stringTexture", "mediaDesign");
            CABLES.patch.setVariable("mainColor", "#141414");
          },
        },
      ];

      function onElementVisible(element) {
        element.classList.add("visibleImage", "active");

        const titleElement = element.querySelector(".title");
        titleElement?.classList.add("visibleTitle");

        const descriptionElement = element.querySelector(".description");
        descriptionElement?.classList.add("visibleDescription");

        // Update main color if available
        const mainColor = element.getAttribute("color");
        if (mainColor && CABLES?.patch) {
          CABLES.patch.setVariable("mainColorHex", mainColor);
        }

        // Handle video playback
        const videoElement = element.querySelector(".videojs-work");
        if (videoElement) {
          const player = videojs(videoElement);
          player.muted(true);
          player.play().catch(console.error);
        }
      }

      function onElementHidden(element) {
        element.classList.remove("visibleImage", "active");

        const titleElement = element.querySelector(".title");
        titleElement?.classList.remove("visibleTitle");

        const descriptionElement = element.querySelector(".description");
        descriptionElement?.classList.remove("visibleDescription");

        const videoElement = element.querySelector(".videojs-work");
        if (videoElement) {
          const player = videojs(videoElement);
          player.muted(true);
          player.pause();
        }
      }

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onElementVisible(entry.target);
            } else {
              onElementHidden(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: `65px 0px -${marginBottom}px 0px`,
          threshold: 1.0,
        }
      );

      workElements.forEach((element) => {
        observer.observe(element);
      });

      createTriggers(triggers);
    }

    // Mask positions

    if (mq1.matches || mq2.matches || mq3.matches) {
      mask4.style.height = String(getElementPosition("#text1").bottom) + "px";

      // Track position of the mask
      function updatePosition() {
        if (workList && mask1 && mask5) {
          const rect = workList.getBoundingClientRect();

          mask1.style.transform = `translateY(${rect.top + window.scrollY}px)`;
          mask1.style.height = `${workList.offsetHeight}px`;
          mask5.style.transform = `translateY(${
            rect.bottom + window.scrollY
          }px)`;
        }
      }
      requestAnimationFrame(function animate() {
        updatePosition();
        requestAnimationFrame(animate);
      });
    }

    if (mq2.matches || mq1.matches) {
      document.getElementById("deco3").style.top =
        String(getElementPosition("#text1").bottom) + "px";
    }

    if (mq2.matches) {
      const backgroundMask1 = document.getElementById("backgroundMask1");
      const text1Position = document
        .querySelector("#text1")
        .getBoundingClientRect();
      backgroundMask1.style.height = `calc(100% - ${text1Position.bottom}px + 65px)`;
    }
  }
});
