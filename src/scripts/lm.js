// ===========================================================================================
// GENERATOR SETTINGS
// ===========================================================================================
// these settings provide the default Lonely Monoliths experience.
const GENERATOR_SETTINGS = {
  canvas: {
    w: 512,
    h: 512,
  },
};

// ===========================================================================================
// IMAGE DATA
// ===========================================================================================
// default imageData is an empty object.
// the renderer uses data populated here to draw an image.
// each object in the "data" array is required to have a key "type" that corresponds to a render layer template.
const imageData = {
  data: [
    /* {
      type: "example",
      color: [175, 125, 71],
      alpha: 1,
      square: [30, 20, 55],
      blur: 2
    }, */
    // the template renderer will render from "array[0] -> array[n]" aka "back -> front" so order matters
    {
      type: 'sky',
      colorA: [128, 128, 128],
      colorB: [255, 255, 255]
    },
    //{type: 'stars'},
    //{type: 'planets'},
    //{type: 'ground'},
    //{type: 'city'},
    //{type: 'mountains'},
    //{type: 'hills'},
    //{type: 'monolith'},
    // foreground stuff? rocks, trees, ruins, hills?
    //{type: 'rain'},
    //{type: 'frame'}
  ],
};

// ===========================================================================================
// RENDERER LAYER TEMPLATES
// ===========================================================================================
/* a list of generators available to LM.
 * NOTE: each function should take in: [1] an object for the layer's image data and [2] a p5 renderer.
 */
const layerTemplates = {
  // this is an example layer template
  example: function (layerData, renderer) {
    /* When blur is applied to an object on a transparent background it is required to set the
     * layer background to the same color as the rendered object (but with 0.01 alpha), because p5's
     * blur function blends the the background color with the rendered object as if the background
     * were not transparent. The default result leaves a blurred shadow around the rendered object.
     * NOTE: There may be lower-level canvas options that could mitigate this.
     */
    renderer.colorMode(renderer.RGB, 255, 255, 255, 1.0); // colorMode is required to be RGB x,x,x,x for blur to work.
    renderer.background(...layerData.color, 0.01); // alpha at 0.01 for blur to work.
    renderer.noStroke();
    renderer.fill(...layerData.color, layerData.alpha);
    renderer.square(...layerData.square);
    renderer.filter(renderer.BLUR, layerData.blur); // see notes above. using blur in a temporary renderer comes with requirements.
    return renderer; // all templates MUST return the renderer they were given to be rendered to the final canvas.
  },
  sky: function (layerData, renderer) {
    helpers.linearGradient(renderer, layerData.colorA, layerData.colorB);
    return renderer;
  },
};

// ===========================================================================================
// APP STUFF
// ===========================================================================================
// app settings
const APP_SETTINGS = {
  logging: true, // probably change this to 'false' for production use.
  generateData: true, // change this to 'false' to display custom image data on page load.
  isServer: navigator.userAgent.includes("jsdom"),
};

// togglable logger for use in dev... or prod debugging
function LOGGER(message) {
  if (APP_SETTINGS.logging) {
    console.log(`%cLogger: ${message}`, "color: #fff; background: #000;");
  }
}
// DOM flag for use in jsdom automation
function complete() {
  LOGGER("drawing complete");
  if (APP_SETTINGS.isServer) {
    window.imageComplete = true;
  }
}

// ===========================================================================================
// RENDERER HELPERS
// ===========================================================================================
const helpers = {
  linearGradient: function (renderer, cArrayA, cArrayB) {
    const h = renderer.height;
    const w = renderer.width;
    const c1 = renderer.color(...cArrayA);
    const c2 = renderer.color(...cArrayB);
    let color = null;
    for (let i = 0; i <= h; i++) {
      color = (i === 0) ? c1 : renderer.lerpColor(c1, c2, i / h);
      renderer.stroke(color);
      renderer.line(0, i, w, i);
    }
  },
};

// ===========================================================================================
// IMAGE DATA GENERATOR
// ===========================================================================================
// this is the image data generator
const generateData = () => { };

// ===========================================================================================
// p5 LIFECYCLE
// ===========================================================================================
// create p5 instance for more control
const s = (p) => {
  const canvas = GENERATOR_SETTINGS.canvas;
  // grab textarea to display image data (will be null on server)
  const textData = document.querySelector("textarea");
  // grab span to display errors (will be null on server)
  const outputConsole = document.querySelector("span");
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
      outputConsole.innerText += "Data input is not valid JSON\n";
    }
  }
  // sets up the p5 environment
  p.setup = function () {
    createUI();
    generateData();
    p.createCanvas(canvas.w, canvas.h);
    /* REQUIRED: p.noLoop();
     * On client-side there's no need to render more than once.
     * On server-side render-once keeps processing power low because money
     */
    p.noLoop();
  };
  // draw loops. use p.redraw() to manually invoke
  p.draw = function () {
    // send each image data array element off to be drawn by a template
    imageData.data.forEach((layerData) => {
      if (layerTemplates[layerData.type]) {
        // create a p5 renderer on which the layer template can render stuff
        const newRenderer = p.createGraphics(canvas.w, canvas.h);
        // send the new renderer off to its layer template function to be rendered, then store the returned renderer
        const renderedRenderer = layerTemplates[layerData.type](
          layerData,
          newRenderer
        );
        // render the newly rendered p5 renderer as a p5 image component to the main canvas
        p.image(renderedRenderer, 0, 0);
      } else {
        const log = `error! layer template type "${layerData.type}" does not exist!`;
        outputConsole.innerText += `${log}\n`;
        LOGGER(log);
      }
    });
    // update the data display on client-side
    textData && (textData.value = JSON.stringify(imageData.data, null, "  "));
    // call this after drawing for logging and server-side flagging
    complete();
  };
};

// ===========================================================================================
// APP FUNCTIONALITY EXECUTION
// ===========================================================================================
// check if we should generate new image data
if (APP_SETTINGS.generateData) {
  generateData();
}
// invoke p5 instance
new p5(s, "canvas");
