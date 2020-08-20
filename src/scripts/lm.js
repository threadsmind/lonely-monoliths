// app settings
const APP_SETTINGS = {
  logging: true,
  isServer: navigator.userAgent.includes("jsdom"),
};
/* generator settings:
 * these settings provide the default Lonely Monoliths experience
 */
const GENERATOR_SETTINGS = {
  canvas: {
    h: 512,
    w: 512,
  },
};
// holds data about the image
const imageData = {
  data: [
    { type: "test", color: "#321098" },
    /* render will render from "0 -> n" aka "back-> front" so order matters
    {type: 'sky'},
    {type: 'stars'},
    {type: 'planets'},
    {type: 'ground'},
    {type: 'city'},
    {type: 'mountains'},
    {type: 'hills'},
    {type: 'monolith'},
    // foreground stuff? rocks, trees, ruins, hills?
    {type: 'rain'},
    {type: 'frame'},*/
  ],
};

// togglable logger for use in dev... or prod debugging
function LOGGER(message) {
  if (APP_SETTINGS.logging) {
    console.log(`%cLogger: ${message}`, "color: #fff; background: #000;");
  }
};
// DOM flag for use in jsdom automation
function complete() {
  LOGGER("drawing complete");
  if (APP_SETTINGS.isServer) {
    window.imageComplete = true;
  }
}

// ===========================================================================================

// create p5 instance for more control
const s = (p) => {
  // grab textarea to display image data (will be null on server)
  const textData = document.querySelector("textarea");
  // grab p to display errors (will be null on server)
  const outputConsole = document.querySelector("span");
  // a list of generators available to LM
  const layerTemplates = {
    test: function (layerData) {
      p.background(layerData.color);
    },
  };

  // this is the data generator
  function generateData() {}
  // create ui on client-side
  function createUI() {
    if (!APP_SETTINGS.isServer) {
      LOGGER("connecting client-side UI");
      // connect the redraw button
      const btnRedraw = document.querySelector("button");
      ["click", "touchstart", "keyup"].forEach((i) => {
        btnRedraw.addEventListener(i, redraw);
      });
    }
  }
  // asks p5 to redraw the scene - TODO add procgen option
  function redraw() {
    LOGGER("redraw");
    // try to parse data from <textarea>
    try {
      imageData.data = JSON.parse(textData.value);
      // if data parses, then call this p.redraw() function
      outputConsole.innerText = "";
      p.redraw();
    } catch (e) {
      // send message to output consoles
      LOGGER(e);
      outputConsole.innerText = "Data input is not valid JSON";
    }
  };
  // sets up the p5 environment
  p.setup = function () {
    createUI();
    generateData();
    p.createCanvas(GENERATOR_SETTINGS.canvas.w, GENERATOR_SETTINGS.canvas.h);
    /* REQUIRED: p.noLoop();
     * On client-side there's no need to render more than once.
     * On server-side render-once keeps processing power low because money
     */
    p.noLoop();
  };
  // draw loops. use p.redraw() to manually invoke
  p.draw = function () {
    // send each data array element off to be drawn by a template
    imageData.data.forEach((layer) => {
      if (layerTemplates[layer.type]) {
        layerTemplates[layer.type](layer);
      } else {
        LOGGER(`error! layer template type "${layer.type}" does not exist!`);
      }
    });
    // update the data display on client-side
    textData && (textData.value = JSON.stringify(imageData.data, null, "  "));
    // call this after drawing for logging and server-side flagging
    complete();
  };
};

// invoke p5 instance
new p5(s, "canvas");
