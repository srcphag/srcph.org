// Set context
const currentURL = window.location.href;
var pageContext;
const path =
  window.SRCPH_BASE_URL ||
  "https://cdn.jsdelivr.net/gh/srcphag/srcph.org_sandbox@main/";

if (currentURL.includes("works")) {
  pageContext = "works";
} else if (currentURL.includes("404")) {
  pageContext = "404";
} else {
  pageContext = "index";
}

document.body.setAttribute("context", pageContext);

function textureOffset() {
  if (mq1.matches) {
    CABLES.patch.setVariable("videoTextureOffsetY", 0);
  }
  if (mq2.matches) {
    CABLES.patch.setVariable("videoTextureOffsetY", 0.5);
  }
  if (mq3.matches) {
    CABLES.patch.setVariable("videoTextureOffsetY", 0.25);
  }
}

function showError(errId, errMsg) {}

let initCount = 0;
let hasInitialized = false;

function patchInitialized(patch) {
  const canvas = document.getElementById("glcanvas");
  const rect = canvas.getBoundingClientRect();

  document.addEventListener("mousemove", (event) => {
    // Coordinates relative to the canvas
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Normalize to a 0-1 range
    const normX = canvasX / rect.width;
    const normY = canvasY / rect.height;

    // Convert to -1 to 1 range (and flip y for WebGL)
    const ndcX = normX * 2 - 1;
    const ndcY = -(normY * 2 - 1);

    CABLES.patch.setVariable("mouseX", ndcX);
    CABLES.patch.setVariable("mouseY", ndcY);
  });

  initCount++;
  hasInitialized = true;
}

// NOTE: overridden by the same-named function in animations.js (loaded later),
// which is the one actually passed to the patch on CABLES.jsLoaded.
function patchFinishedLoading(patch) {
  const videoPlay = CABLES.patch.getVar("playerStatus");
  const videoFullscreen = CABLES.patch.getVar("videoFullscreen");
  const videoMuted = CABLES.patch.getVar("videoMuted");
  const isImage = CABLES.patch.getVar("isImage");
}

document.addEventListener("CABLES.jsLoaded", function (event) {
  CABLES.patch = new CABLES.Patch({
    variables: {
      pageContext: pageContext,
      mediaQuery: currentMediaQuery,
      videoUrl: "",
      imageUrl: "",
      stringTexture: "mediaDesign",
      workScroll: 0,
      aboutScroll: 0,
      workPageScroll: 0,
      videoPlay: isPlaying,
      videoMuted: isMuted,
      videoVolume: videoVolume,
      videoFullscreen: isFullscreen,
      mainColorHex: "#141414",
      indexPSR_mq3: [0.5, -0.5, -10, 7, 0, -20, 10],
      indexPSR_mq2: [0, 5, -2, 10, -40, 0, 0],
      indexPSR_mq1: [-5, 5, 0, 10, -40, 0, 0],

      indexWorkPSR_mq3: [0.5, 0, 0, 5, 180, 50, 30],
      indexWorkPSR_mq2: [0.5, 0, 0, 5, 180, 50, 30],
      indexWorkPSR_mq1: [0, 2, 0, 15, 20, 20, 10],

      indexAboutPSR_mq3: [-0.5, 0, 0, 5, 250, 50, 50],
      indexAboutPSR_mq2: [-0.5, 0, 0, 5, 250, 50, 50],
      indexAboutPSR_mq1: [0, 8, 0, 15, 20, 20, 10],
      // WorkPage
      workPSR_mq3: [-1, -1, 0, 10, 90, 0, 0],
      workPSR_mq2: [-1, -1, 0, 10, 90, 0, 0],
      workPSR_mq1: [0, -5, 0, 50, 180, 20, 20],

      workExtraPSR_mq3: [-2, -1, -2, 3, 20, 70, 0],
      workExtraPSR_mq2: [-2, -1, -2, 3, 20, 70, 0],
      workExtraPSR_mq1: [-2, -1, -2, 3, 20, 70, 0],

      workPageTextureProjection: 3,

      errorPSR_mq3: [-1, 0, 0, 3, 0, -90, 10],
      errorPSR_mq2: [0, 5, -2, 10, -40, 0, 0],
      errorPSR_mq1: [0, 5, 0, 15, -40, 0, 0],

      imageTextureWrap: 0,
      autoTransformSpeed: 0.3,
      mouseTransformSpeed: 0.08,
      trailAmmount: 0.5,
    },
    patch: CABLES.exportedPatch,
    prefixAssetPath: path,
    silent: true,
    assetPath: path,
    jsPath: path,
    glCanvasId: "glcanvas",
    glCanvasResizeToWindow: true,
    onError: showError,
    onPatchLoaded: patchInitialized,
    onFinishedLoading: patchFinishedLoading,
    canvas: { alpha: true, premultipliedAlpha: true }, // make canvas transparent
  });
  if (pageContext == "works") {
    textureOffset();
    CABLES.patch.setVariable("autoTransformSpeed", 0);
  }
  if (pageContext == "index") {
    CABLES.patch.setVariable("videoPlay", 0);
  }
});
