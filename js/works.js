document.addEventListener("CABLES.jsLoaded", function (event) {
  if (pageContext == "works") {
    var cmsVideos = document.querySelectorAll('[data-vid="works"]');
    var cmsImages = document.querySelectorAll('[data-img="works"]');
    var imageUrls = [];

    // Video links first (each unshifted to the front), then image links
    cmsVideos.forEach((cmsVideo) => imageUrls.unshift(cmsVideo.href));
    cmsImages.forEach((cmsImage) => imageUrls.push(cmsImage.src));

    CABLES.patch.setVariable("videoUrl", imageUrls[0]);

    // Setting players
    const workVideos = document.querySelectorAll(".videojs-work");
    const videoPlayers = new Map(); // observed target (container) → player

    workVideos.forEach((videoElement) => {
      const container = videoElement.closest(".video.w-embed");

      // Use the container's dynamic id (unique per item via Webflow)
      videoElement.id = container.id;

      const player = videojs(videoElement, {
        controls: false,
        autoplay: false,
        preload: "auto",
        muted: true,
        loop: true,
      });

      videoPlayers.set(container || videoElement, player);

      // Per-item player controls when the gallery element enables them
      const galleryItem = videoElement.closest(".galleryelement");

      if (galleryItem?.getAttribute("player_controls") === "1") {
        container.style.position = "relative";

        const itemControls = document.createElement("div");
        itemControls.className = "gallery-video-controls";
        Object.assign(itemControls.style, {
          position: "absolute",
          bottom: "0px",
          right: "0px",
          display: "flex",
          gap: "0px",
          zIndex: "10",
        });

        const itemPlayButton = document.createElement("button");
        itemPlayButton.textContent = player.paused()
          ? "Play video"
          : "Pause video";

        const itemMuteButton = document.createElement("button");
        itemMuteButton.textContent = player.muted() ? "Sound off" : "Sound on";

        [itemPlayButton, itemMuteButton].forEach((button) => {
          Object.assign(button.style, {
            background: "var(--bck0)",
            color: "var(--black)",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          });
          itemControls.appendChild(button);
        });

        itemPlayButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (player.paused()) {
            player.play();
          } else {
            player.pause();
          }
        });

        itemMuteButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          player.muted(!player.muted());
        });

        // Keep labels in sync with playback (e.g. viewport auto play/pause)
        player.on("play", () => (itemPlayButton.textContent = "Pause video"));
        player.on("pause", () => (itemPlayButton.textContent = "Play video"));
        player.on(
          "volumechange",
          () =>
            (itemMuteButton.textContent = player.muted()
              ? "Sound off"
              : "Sound on")
        );

        container.appendChild(itemControls);
      }
    });

    // Play videos when their container enters the viewport, pause when they leave
    function onVideoVisible(target) {
      const player = videoPlayers.get(target);
      player.muted(true);
      player.play().catch(console.error);
    }

    function onVideoHidden(target) {
      videoPlayers.get(target).pause();
    }

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVideoVisible(entry.target);
          } else {
            onVideoHidden(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    videoPlayers.forEach((player, target) => videoObserver.observe(target));

    if (mq3.matches) {
      /// Random position on grid
      const usedPositions = new Set();
      const numRows = 5;
      const numCols = 5;

      galleryImage.forEach((item) => {
        let randomRow, randomCol;
        do {
          randomRow = getRandomInt(1, numRows);
          randomCol = getRandomInt(1, numCols);
        } while (usedPositions.has(`${randomRow}-${randomCol}`));

        usedPositions.add(`${randomRow}-${randomCol}`);

        item.style.gridRow = randomRow;
        item.style.gridColumn = randomCol + 1;
      });

      /// Each gallery element in its own row, at a random column
      const galleryElements = document.querySelectorAll(".galleryelement");
      // The full-height grid container — #gallery's box is constrained by
      // top/bottom and doesn't wrap the rows, so it can't be the trigger
      const galleryGrid = galleryElements[0]?.parentElement;
      let prevCols = [];

      galleryElements.forEach((item, index) => {
        const sizeId = item.getAttribute("size_id");
        const hasDescription = item.querySelector(".description") !== null;

        // size_id = 1 → spans 2 columns, starting on column 1, 2 or 3
        // size_id = 0 → any of the 4 columns (spans 2 with a description)
        const span = sizeId === "1" || hasDescription ? 2 : 1;
        const maxCol = 4 - span + 1;

        // Avoid the predecessor's columns so no two adjacent rows align
        let candidates = [];
        for (let c = 1; c <= maxCol; c++) {
          const cols = span === 2 ? [c, c + 1] : [c];
          if (!cols.some((col) => prevCols.includes(col))) candidates.push(c);
        }
        if (candidates.length === 0) {
          candidates = Array.from({ length: maxCol }, (_, i) => i + 1);
        }

        const startCol =
          candidates[getRandomInt(0, candidates.length - 1)];

        item.style.gridRow = index + 1;
        item.style.gridColumn = `${startCol} / span ${span}`;

        prevCols = span === 2 ? [startCol, startCol + 1] : [startCol];

        // Scroll-linked depth
        gsap.to(item, {
          yPercent: getRandomInt(-50, 50),
          ease: "none",
          scrollTrigger: {
            trigger: galleryGrid,
            scrub: 1,
          },
        });
      });

      /// Sticky scroll — shared smooth-jump tween
      const jumpTo = (target) => {
        if (isScrolling) return; // Prevent multiple calls while scrolling

        isScrolling = true;

        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: target, offsetY: 0, autoKill: false },
          ease: "power3.out",
          onComplete: () => {
            isScrolling = false;
          },
        });
      };

      /// Sticky scroll — smooth jump to the gallery after 20% is scrolled
      ScrollTrigger.create({
        trigger: "#gallery",
        start: "top 80%", // gallery sits at 100vh → fires after ~20vh of scrolling
        onEnter: () => jumpTo("#gallery"),
      });

      /// Jump back to the top once the gallery is 20% out of the viewport
      ScrollTrigger.create({
        trigger: "#gallery",
        start: "top 20%",
        onLeaveBack: () => jumpTo(0),
      });

      /// Flicker the player controls (same animation as .videojs-about on index)
      const playerControlsEl = document.getElementById("playerControls");

      const controlsFlicker = gsap.to(playerControlsEl, {
        keyframes: {
          opacity: [0, 1, 0, 1, 0, 0, 1, 0, 1], // ends hidden
          ease: "none",
        },
        duration: 0.25,
        paused: true,
        // The element has a CSS opacity transition (for the mouse/touch
        // show-hide) that would smooth GSAP's per-frame updates into a
        // slow fade — suspend it while the flicker runs
        onStart: () => {
          playerControlsEl.style.transition = "none";
          playerControlsEl.style.visibility = "visible";
        },
        onComplete: () => {
          playerControlsEl.style.transition = "opacity 0.3s ease";
          playerControlsEl.style.transition = "none";
          playerControlsEl.style.visibility = "visible";
        },
      });

      ScrollTrigger.create({
        trigger: "#gallery",
        start: "top 85%", // fires after ~10vh of scrolling
        onEnter: () => controlsFlicker.restart(),
        onLeaveBack: () => controlsFlicker.restart(), // viewport near the top again
      });
    }

    /// mq2 — gallery positioning (3 columns, one element per row)
    if (mq2.matches) {
      const tabletGalleryElements = document.querySelectorAll(".galleryelement");

      tabletGalleryElements.forEach((item, index) => {
        const hasDescription = item.querySelector(".description") !== null;
        const hasBig = item.hasAttribute("big");

        let startCol;
        if (hasDescription) {
          // description items are always placed in the first column
          startCol = 1;
        } else if (hasBig) {
          // big items can only sit in the first or second column
          startCol = getRandomInt(1, 2);
        } else {
          // everything else may use any of the 3 columns
          startCol = getRandomInt(1, 3);
        }

        item.style.gridRow = index + 1;
        item.style.gridColumn = `${startCol} / span 1`;
      });
    }

    if (mq3.matches || mq2.matches) {
      const col1mask = document.getElementById("canvasMask3");
      const col2mask = document.getElementById("canvasMask4");

      col1mask.style.height = String(getElementPosition("#info").bottom) + "px";
      col2mask.style.height =
        String(getElementPosition("#description").bottom) + "px";
    }

    // VideoControls

    const playText = "Play video";
    const pauseText = "Pause video";

    const soundOff = "Sound off";
    const soundOn = "Sound on";

    const fullScreenOn = "Fullscreen";
    const fullScreenOff = "Exit fullscreen";

    playButton.innerHTML = isPlaying ? pauseText : playText; // Set initial state
    mutedButton.innerHTML = isMuted ? soundOff : soundOn; // Set initial state
    fullscreenButton.innerHTML = isFullscreen ? fullScreenOff : fullScreenOn; // Set initial state

    function setVideoPlay() {
      isPlaying = !isPlaying;

      playButton.innerHTML = isPlaying ? pauseText : playText;

      CABLES.patch.setVariable("videoPlay", isPlaying ? 1 : 0);
      CABLES.patch.setVariable("videoMuted", isMuted ? 1 : 0);
      CABLES.patch.setVariable("videoVolume", 1);
    }

    playButton.addEventListener("click", () => {
      setVideoPlay();
    });

    mutedButton.addEventListener("click", () => {
      isMuted = !isMuted;
      mutedButton.innerHTML = isMuted ? soundOff : soundOn;

      CABLES.patch.setVariable("videoMuted", isMuted ? 1 : 0);
      CABLES.patch.setVariable("videoVolume", isMuted ? 0 : 1);
    });

    fullscreenButton.addEventListener("click", () => {
      isFullscreen = !isFullscreen;

      fullscreenButton.innerHTML = isFullscreen ? fullScreenOff : fullScreenOn;
      srcShape.style.mixBlendMode = isFullscreen ? "normal" : "multiply";
      srcShape.style.zIndex = isFullscreen ? 10 : 5;

      CABLES.patch.setVariable("videoFullscreen", isFullscreen ? 1 : 0);
      if (mq1.matches && isFullscreen == true) {
        document.getElementById("playerControls").style.top = "100vh";
      }
      if (mq1.matches && isFullscreen == false) {
        document.getElementById("playerControls").style.top = "60vh";
      }
    });

    // Mouse controls for larger screens
    if (mq3.matches) {
      const playerControls = document.getElementById("playerControls");
      let timeout;
      let isHovering = false;

      function showControls() {
        playerControls.style.opacity = "1";
        clearTimeout(timeout);
        if (!isHovering) {
          timeout = setTimeout(hideControls, 2000);
        }
      }

      function hideControls() {
        if (!isHovering) {
          playerControls.style.opacity = "0";
        }
      }

      // playerControls.style.transition = "opacity 0.3s ease";
      playerControls.style.opacity = "0";

      document.addEventListener("mousemove", showControls);

      playerControls.addEventListener("mouseenter", () => {
        isHovering = true;
        showControls();
        clearTimeout(timeout);
      });

      playerControls.addEventListener("mouseleave", () => {
        isHovering = false;
        timeout = setTimeout(hideControls, 2000);
      });
    }

    if (mq2.matches) {
      const playerControls = document.getElementById("playerControls");
      let timeout;

      function showTouchControls() {
        playerControls.style.opacity = "1";
        clearTimeout(timeout);

        updateControlsVisibility();
      }

      function hideTouchControls() {
        if (!isTouching && isPlaying) {
          playerControls.style.opacity = "0";
        }
      }

      function updateControlsVisibility() {
        if (!isPlaying) {
          // If video is not playing, show controls and clear any hide timeout
          playerControls.style.opacity = "1";
          clearTimeout(timeout);
        } else if (!isTouching) {
          // If video is playing and not touching, start hide timeout
          timeout = setTimeout(hideTouchControls, 2000);
        }
      }

      playerControls.style.transition = "opacity 0.3s ease";
      // Initial visibility based on playing state
      updateControlsVisibility();

      playButton.addEventListener("click", () => {
        updateControlsVisibility();
      });

      document.addEventListener("touchstart", () => {
        isTouching = true;
        showTouchControls();
      });

      document.addEventListener("touchend", () => {
        isTouching = false;
        updateControlsVisibility();
      });
    }
  }
});
