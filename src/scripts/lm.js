//app settings
const APP_SETTINGS = {
  logging: true, // TODO: set this with an "or" and check for an environment variable
  isServer: navigator.userAgent.includes('jsdom'),
};

// togglable logger for use in dev... or prod debugging
const logger = message => {
  if (APP_SETTINGS.logging) {
    console.log(`%cLogger: ${message}`, 'color: #fff; background: #000;');
  }
};

// DOM flag for use in jsdom automation
function complete() {
  logger('drawing complete');
  if (APP_SETTINGS.isServer) {
    window.imageComplete = true;
  }
}

// holds data about the image
const generatorData = {
  data: {
    canvas: {
      w: 700,
      h: 410,
    },
    layers: [
      {
        type: 'box',
        h: 100,
        w: 75,
      }
    ],
  }
};


// ===========================================================================================


// create p5 instance for more control
const s = p => {
  // this is the data generator
  const generateData = () => {

  }

  // grab textarea to display image data (will be null on server)
  const textData = document.querySelector('textarea');
  // grab p to display errors (will be null on server)
  const outputConsole = document.querySelector('span');
  // create ui on client-side
  const createUI = () => {
    if (!APP_SETTINGS.isServer) {
      logger('connecting client-side UI');
      // connect the redraw button
      const btnRedraw = document.querySelector('button');
      btnRedraw.addEventListener('click', redraw);
      btnRedraw.addEventListener('touchstart', redraw);
      btnRedraw.addEventListener('keyup', redraw);
    }
  }

  // asks p5 to redraw the scene - TODO add procgen option
  const redraw = () => {
    logger('redraw');
    // try to parse data from <textarea>
    try {
      generatorData.data = JSON.parse(textData.value);
      // if data parses, then call this p.redraw() function
      outputConsole.innerText = '';
      p.redraw();
    } catch (e) {
      // send message to output consoles
      logger(e);
      outputConsole.innerText = 'Data input is not valid JSON';
    }

  };

  p.setup = function () {
    createUI();
    generateData();
    p.createCanvas(generatorData.data.canvas.w, generatorData.data.canvas.h);
    /* REQUIRED: p.noLoop();
    * On client-side there's no need to render more than once.
    * On server-side render-once keeps processing power low because money
    */
    p.noLoop();
  };

  // draw loops. use p.redraw() to manually invoke
  p.draw = function () {
    /* TODO:
    * Work out draw functions and logic.
    * How do we programmatically draw shapes based on an incoming data object?
    */

    // placeholder test drawing. please discard
    p.background(0);
    const f = p.random(0, 255);
    p.fill(f);
    p.rect(100, 100, generatorData.data.layers[0].w, generatorData.data.layers[0].h);

    // update the data display on client-side
    textData && (textData.value = JSON.stringify(generatorData.data, null, '  '));

    // call this after drawing for logging and server-side flagging
    complete();
  };
};
// invoke p5 instance
new p5(s, 'canvas');
