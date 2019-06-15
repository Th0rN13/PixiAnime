import * as PIXI from 'pixi.js';
import { TimelineMax } from 'gsap';

const texturesName = "assets/textures.json";
const defWidth = 1390;
const defHeight = 640;
const animContainer = new PIXI.Container();

let selectedStair = 0;
let changeStair = 0;
const
  angle_HAMMER        = 10,
  angle_CONTINUE      = 8;

const
  srt_BACK            = 0,// "back.png":
  srt_AUSTIN          = 1,// "Austin.png":
  srt_DECOR_1         = 2,// "book_stand.png":
  srt_DECOR_2         = 3,// "globe.png":
  srt_DECOR_3         = 4,// "Layer 1.png":
  srt_DECOR_4         = 5,// "plant-1.png":
  srt_DECOR_5         = 6,// "plant.png":
  srt_DECOR_6         = 7,// "table.png"
  srt_STAIR_1         = 8,// "new_stair_01.png":
  srt_STAIR_2         = 9,// "new_stair_02.png":
  srt_STAIR_3         = 10,// "new_stair_03.png"::
  srt_STAIR           = 11,// "stair.png":
  srt_DECOR_FRONT     = 12,// "dec_1.png":
  srt_CONTINUE        = 13,// "continue-button.png":
  srt_LOGO            = 14,// "logo.png":
  srt_STAIR_NOT_1     = 15,// "stair_1.png":
  srt_STAIR_NOT_2     = 16,// "stair_2.png":
  srt_STAIR_NOT_3     = 17,// "stair_3.png":
  srt_STAIR_SEL_1     = 18,// "sel_stair_1.png":
  srt_STAIR_SEL_2     = 19,// "sel_stair_2.png":
  srt_STAIR_SEL_3     = 20,// "sel_stair_3.png":
  srt_HAMMER          = 21,// "icon_hammer.png":
  srt_OK              = 22,// "ok-button.png":
  srt_DARK            = 23,// dark sprite
  srt_FINAL           = 24// "final-poster.png":


const initialStats = [
  { x: defWidth / 2, y: 105, alpha: 1, zIndex: 20 },// "Austin.png":
  { x: defWidth / 2, y: defHeight / 2, alpha: 1, zIndex: 10 },// "back.png":
  { x: 830, y: 0, alpha: 1, zIndex: 20 },// "book_stand.png":
  { x: defWidth / 2, y: defHeight - 90 , alpha: 1, zIndex: 50 },// "continue-button.png":
  { x: 1200, y: defHeight, alpha: 1, zIndex: 40 },// "dec_1.png":
  { x: defWidth / 2, y: defHeight / 2, alpha: 0, zIndex: 100 },// "final-poster.png":
  { x: 90, y: 100, alpha: 1, zIndex: 20 },// "globe.png":
  { x: defWidth * 5 / 6, y: defHeight / 2, alpha: 1, zIndex: 70 },// "icon_hammer.png":
  { x: 120, y: defHeight / 2, alpha: 1, zIndex: 20 },// "Layer 1.png":
  { x: 160, y: 60, alpha: 1, zIndex: 50 },// "logo.png":
  { x: defWidth, y: defHeight, alpha: 0, zIndex: 30 },// "new_stair_01.png":
  { x: defWidth, y: defHeight, alpha: 0, zIndex: 30 },// "new_stair_02.png":
  { x: defWidth, y: defHeight, alpha: 0, zIndex: 30 },// "new_stair_03.png":
  { x: -500, y: 0, alpha: 0, zIndex: 80 },// "ok-button.png":
  { x: 1140, y: 300, alpha: 1, zIndex: 20 },// "plant-1.png":
  { x: 500, y: 0, alpha: 1, zIndex: 20 },// "plant.png":
  { x: defWidth / 2 + 135, y: 75, alpha: 0, zIndex: 60 },// "sel_stair_1.png":
  { x: defWidth / 2 + 135*2, y: 75, alpha: 0, zIndex: 60 },// "sel_stair_2.png":
  { x: defWidth / 2 + 135*3, y: 75, alpha: 0, zIndex: 60 },// "sel_stair_3.png":
  { x: defWidth, y: defHeight, alpha: 1, zIndex: 30 },// "stair.png":
  { x: defWidth / 2 + 135, y: 75, alpha: 1, zIndex: 50 },// "stair_1.png":
  { x: defWidth / 2 + 135*2, y: 75, alpha: 1, zIndex: 50 },// "stair_2.png":
  { x: defWidth / 2 + 135*3, y: 75, alpha: 1, zIndex: 50 },// "stair_3.png":
  { x: 200 , y: 200, alpha: 0, zIndex: 20 } // "table.png":
]

let xScale = window.innerWidth / defWidth;
let yScale = window.innerHeight / defHeight
let myScale = Math.min(xScale, yScale);

const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resizeTo: window, backgroundColor: 0x0});
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
loader.add(texturesName)
  .on("progress", handlerLoadProgress)
  .on("load", handlerLoadAsset)
  .on("error", handlerLoadError)
  .load(handlerLoadComplete);

function handlerLoadComplete() {
  //init textures
  let texturesList = loader.resources[texturesName];

  animContainer.width = defWidth;
  animContainer.height = defHeight;

  setScale();
  // animContainer.scale.x = myScale;
  // animContainer.scale.y = myScale;
  // animContainer.x = (window.innerWidth - defWidth * myScale) / 2;
  // animContainer.y = (window.innerHeight - defHeight * myScale) / 2;

  //load textures and create object
  Object.keys(texturesList.textures).forEach((el) => {
    let sprite = new PIXI.Sprite(texturesList.textures[el]);
    animContainer.addChild(sprite);
  });

  //set initial values
  for (let i = 0; i < animContainer.children.length; i++) {
    animContainer.children[i].alpha = 0;
    animContainer.children[i].zIndex = initialStats[i].zIndex;
    animContainer.children[i].x = initialStats[i].x;
    animContainer.children[i].y = initialStats[i].y;
  }

  //dark mask sprite
  let graph = new PIXI.Graphics();
  graph.beginFill(0x000000);
  graph.drawRect(0, 0, defWidth, defHeight);
  graph.endFill();
  graph.zIndex = 90;
  graph.alpha = 0;
  animContainer.addChild(graph)

  animContainer.sortableChildren = true;
  animContainer.sortChildren();

  //hammer button
  animContainer.children[srt_HAMMER].interactive = true;
  animContainer.children[srt_HAMMER].buttonMode = true;
  animContainer.children[srt_HAMMER].on('pointerdown', onClickHammer);

  //select stair buttons
  animContainer.children[srt_STAIR_NOT_1].interactive = true;
  animContainer.children[srt_STAIR_NOT_1].buttonMode = true;
  animContainer.children[srt_STAIR_NOT_1].on('pointerdown', (event) => onClickMedal(1, event));

  animContainer.children[srt_STAIR_NOT_2].interactive = true;
  animContainer.children[srt_STAIR_NOT_2].buttonMode = true;
  animContainer.children[srt_STAIR_NOT_2].on('pointerdown', (event) => onClickMedal(2, event));

  animContainer.children[srt_STAIR_NOT_3].interactive = true;
  animContainer.children[srt_STAIR_NOT_3].buttonMode = true;
  animContainer.children[srt_STAIR_NOT_3].on('pointerdown', (event) => onClickMedal(3, event));

  //ok button
  animContainer.children[srt_OK].interactive = true;
  animContainer.children[srt_OK].buttonMode = true;
  animContainer.children[srt_OK].on('pointerdown', onClickOk);

  //continue button
  animContainer.children[srt_CONTINUE].interactive = true;
  animContainer.children[srt_CONTINUE].buttonMode = true;
  animContainer.children[srt_CONTINUE].on('pointerdown', onClickContinue);

  //preloader animation
  new TimelineMax()
    .fromTo(animContainer.children[srt_LOGO], 0.8,
      { alpha: 0 },
      { alpha: 1 }, 0.5)
    .fromTo(animContainer.children[srt_LOGO].scale, 1.2,
      { x: 1.1, y: 1.1 },
      { x: 1, y: 1 }, "-=1.2")
    .fromTo(animContainer.children[srt_LOGO].scale, 1.2,
      { x: 1, y: 1 },
      { x: 3, y: 3 })
    .fromTo(animContainer.children[srt_LOGO], 1.2,
      { x: defWidth / 2, y: defHeight / 2},
      { x: 160, y: 60})
    .fromTo(animContainer.children[srt_LOGO].scale, 1.2,
      { x: 3, y: 3 },
      { x: 1, y: 1 }, "-=1.2")
    .fromTo(animContainer.children[srt_BACK], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_FRONT], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_1], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_2], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_3], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_4], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_5], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_DECOR_6], 0.4,
      { alpha: 0 },
      { alpha: 1 })
    .fromTo(animContainer.children[srt_AUSTIN], 0.8,
      { y: -500, alpha: 0 },
      { y: 105, alpha: 1 })
    .fromTo(animContainer.children[srt_STAIR], 0.8,
      { x: defWidth*1.5, alpha: 0 },
      { x: defWidth, alpha: 1 })
    .fromTo(animContainer.children[srt_HAMMER], 0.8,
      { x: defWidth * 1.5, alpha: 0 },
      { x: defWidth * 5 / 6, alpha: 1 })
    .fromTo(animContainer.children[srt_CONTINUE], 0.8,
      { y: defHeight + 100, alpha: 0 },
      { y: defHeight - 100, alpha: 1 })

  //hammer animation repeat
  new TimelineMax()
    .fromTo(animContainer.children[srt_HAMMER], 0.04,
      { angle: 0 },
      { angle: angle_HAMMER })
    .fromTo(animContainer.children[srt_HAMMER], 0.08,
      { angle: angle_HAMMER },
      { angle: -angle_HAMMER })
    .fromTo(animContainer.children[srt_HAMMER], 0.08,
      { angle: -angle_HAMMER },
      { angle: angle_HAMMER })
    .fromTo(animContainer.children[srt_HAMMER], 0.08,
      { angle: angle_HAMMER },
      { angle: -angle_HAMMER })
    .fromTo(animContainer.children[srt_HAMMER], 0.04,
      { angle: -angle_HAMMER },
      { angle: 0 })
    .fromTo(animContainer.children[srt_HAMMER], 1.2,
      { angle: 0 },
      { angle: 0 })
    .repeat(-1)

  //button animation repeat
  new TimelineMax()
    .fromTo(animContainer.children[srt_CONTINUE], 0.04,
      { angle: 0 },
      { angle: angle_CONTINUE })
    .fromTo(animContainer.children[srt_CONTINUE], 0.08,
      { angle: angle_CONTINUE },
      { angle: -angle_CONTINUE })
    .fromTo(animContainer.children[srt_CONTINUE], 0.08,
      { angle: -angle_CONTINUE },
      { angle: angle_CONTINUE })
    .fromTo(animContainer.children[srt_CONTINUE], 0.08,
      { angle: angle_CONTINUE },
      { angle: -angle_CONTINUE })
    .fromTo(animContainer.children[srt_CONTINUE], 0.04,
      { angle: -angle_CONTINUE},
      { angle: 0 })
    .fromTo(animContainer.children[srt_CONTINUE], 3,
      { angle: 0 },
      { angle: 0 })
    .repeat(-1)

  app.stage.addChild(animContainer);
  app.ticker.add(animateAll)
}

const onClickHammer = (event) => {
  changeStair = changeStair ^ 1;
  if (changeStair) {
    new TimelineMax()
      .fromTo(animContainer.children[srt_STAIR_NOT_1], 0.3,
        { y: 0, alpha: 0 },
        { y: 75, alpha: 1 })
      .fromTo(animContainer.children[srt_STAIR_NOT_2], 0.3,
        { y: 0, alpha: 0 },
        { y: 75, alpha: 1 }, "-=0.15")
      .fromTo(animContainer.children[srt_STAIR_NOT_3], 0.3,
        { y: 0, alpha: 0 },
        { y: 75, alpha: 1 }, "-=0.15")
  } else {
    if(selectedStair) {
      new TimelineMax()
        .to(animContainer.children[srt_STAIR_SEL_1 + selectedStair - 1], 0.3,
          { y: -1000, alpha: 0 })
        .to(animContainer.children[srt_OK], 0.3,
          { x: defWidth + 500, alpha: 0 }, "-=0.1")
      selectedStair = 0;
    }
    new TimelineMax()
      .fromTo(animContainer.children[srt_STAIR_NOT_1], 0.3,
        { y: 75, alpha: 1 },
        { y: -100, alpha: 0 })
      .fromTo(animContainer.children[srt_STAIR_NOT_2], 0.3,
        { y: 75, alpha: 1 },
        { y: -100, alpha: 0 }, "-=0.3")
      .fromTo(animContainer.children[srt_STAIR_NOT_3], 0.3,
        { y: 75, alpha: 1 },
        { y: -100, alpha: 0 }, "-=0.3")
  }
}

const onClickMedal = (selected, event) => {
  //select new stair
  if ((selectedStair === 0) || (selectedStair !== selected)) {
    animContainer.children[srt_STAIR_SEL_1 + selected - 1].y = 75
    new TimelineMax()
      .fromTo(animContainer.children[srt_STAIR_SEL_1 + selected - 1], 0.3,
        { alpha: 0 },
        { alpha: 1 });
  }
  if (selectedStair !== 0) {
    new TimelineMax()
      .fromTo(animContainer.children[srt_STAIR_SEL_1 + selectedStair - 1], 0.3,
        { alpha: 1 },
        { alpha: 0 });
  }
  if (selectedStair === selected) {
    selectedStair = 0;
  } else {
    selectedStair = selected;
  }
  new TimelineMax()
    .fromTo(animContainer.children[srt_OK], 0.1,
      { alpha: 1 },
      { alpha: 0 });
  if (selectedStair !== 0) {
    animContainer.children[srt_OK].x = defWidth / 2 - 10 + 135 * selectedStair
    new TimelineMax()
      .fromTo(animContainer.children[srt_OK], 0.3,
        { y: -200, alpha: 0 },
        { y: 120, alpha: 1 });
  }
}

const onClickOk = (event) => {
  //build selected stair
  onClickHammer(); //remove medals
  new TimelineMax()
    .to(animContainer.children[srt_OK], 0.3,
      { x: -200, alpha: 0 })
    .to(animContainer.children[srt_HAMMER], 0.3,
      { x: defWidth + 200, alpha: 0 })
    .to(animContainer.children[srt_STAIR], 0.6,
      { x: "+=20", alpha: 0 })
    .fromTo(animContainer.children[srt_STAIR_1], 0.6,
      { y: "-=20", alpha: 0 },
      { y: defHeight, alpha: 1 })
}

const onClickContinue = (event) => {
  animContainer.children[srt_HAMMER].interactive = false;
  animContainer.children[srt_CONTINUE].interactive = false;
  //dark all
  new TimelineMax()
    .fromTo(animContainer.children[srt_DARK], 0.3,
      { alpha: 0 },
      { alpha: 0.6 })
    .fromTo(animContainer.children[srt_FINAL], 0.3,
      { alpha: 0 },
      { alpha: 1 })
}

const animateAll = (delta) => {
}

function handlerLoadAsset() { }
function handlerLoadProgress() { }
function handlerLoadError() {
  console.log("Error loading textures");
}

const setScale = () => {
  let xScale = window.innerWidth / defWidth;
  let yScale = window.innerHeight / defHeight
  let myScale = Math.min(xScale, yScale);

  animContainer.scale.x = myScale;
  animContainer.scale.y = myScale;
  animContainer.x = (window.innerWidth - defWidth * myScale) / 2;
  animContainer.y = (window.innerHeight - defHeight * myScale) / 2;
}

window.onresize = setScale