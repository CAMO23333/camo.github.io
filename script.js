const scenes = ["example-01", "example-02", "example-03", "example-04", "example-05"];
const methods = [
  ["HATIR", "baseline-hatir"],
  ["DGAF-VSR", "baseline-dgaf-vsr"],
  ["DLoRAL", "baseline-dloral"],
  ["FMA-Net", "baseline-fma-net"],
  ["STAR", "baseline-star"],
  ["MambaTM", "baseline-mambatm"],
  ["DATUM", "baseline-datum"],
  ["Turb-Seg-Res", "baseline-turb-seg-res"]
];

let currentScene = 2;

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const gifPath = (folder, scene) => `assets/gifs/${folder}/${scene}.gif`;

const splitView = $("#splitView");
const splitRange = $("#splitRange");

function setSplit(value) {
  splitView.style.setProperty("--split", `${value}%`);
}

splitRange.addEventListener("input", (event) => setSplit(event.target.value));

function loadImage(element, src) {
  if (element.getAttribute("src") !== src) element.setAttribute("src", src);
}

function updateScene() {
  const scene = scenes[currentScene];
  loadImage($("#oursSplit"), gifPath("result", scene));
  loadImage($("#lrSplit"), gifPath("input", scene));
  loadImage($("#comparisonLR"), gifPath("input", scene));
  loadImage($("#comparisonOurs"), gifPath("result", scene));
  loadImage($("#comparisonGT"), gifPath("reference", scene));
  updateMethod();

  const counter = `Example ${currentScene + 1} / ${scenes.length}`;
  $("#resultCount").textContent = counter;
  $("#comparisonCount").textContent = counter;
}

function stepScene(direction) {
  currentScene = (currentScene + direction + scenes.length) % scenes.length;
  updateScene();
}

all("[data-scene-step]").forEach((button) => {
  button.addEventListener("click", () => stepScene(Number(button.dataset.sceneStep)));
});

const methodSelect = $("#methodSelect");
methods.forEach(([label, folder]) => {
  const option = document.createElement("option");
  option.value = folder;
  option.textContent = label;
  methodSelect.append(option);
});
methodSelect.value = "baseline-dgaf-vsr";

function updateMethod() {
  const folder = methodSelect.value || methods[0][1];
  const method = methods.find(([, itemFolder]) => itemFolder === folder) || methods[0];
  $("#comparisonMethodName").textContent = method[0];
  $("#comparisonMethod").alt = `${method[0]} restoration`;
  loadImage($("#comparisonMethod"), gifPath(method[1], scenes[currentScene]));
}

methodSelect.addEventListener("change", updateMethod);

const imageDialog = $("#imageDialog");
const dialogImage = $("#dialogImage");
all("[data-image]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogImage.src = button.dataset.image;
    imageDialog.showModal();
  });
});

$("#dialogClose").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageDialog.open) imageDialog.close();
});

setSplit(splitRange.value);
updateScene();
