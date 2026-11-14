const gridItems = document.querySelectorAll(".work");
const workElements = Array.from(document.querySelectorAll(".work"));
const srcShape = document.querySelector(".srcshape");
const navBar = document.querySelector(".navbar");
const galleryImage = document.querySelectorAll(".galleryimage");

const mask1 = document.getElementById("canvasMask1");
const mask4 = document.getElementById("canvasMask4");
const mask5 = document.getElementById("canvasMask5");

const playButton = document.getElementById("play");
const mutedButton = document.getElementById("mute");
const fullscreenButton = document.getElementById("fullScreen");

let isPlaying = false;
let isMuted = true;
let isFullscreen = false;
let videoVolume = 0;

let mainColor;
let isScrolling = false;
