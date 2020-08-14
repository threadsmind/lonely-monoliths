// DOM flag for use in jsdom automation
function complete() {
  logger('drawing complete');
  if (APP_SETTINGS.isServer) {
    window.imageComplete = true;
  }
}

//app settings (probably move this)
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

// look into data storage logic here
const generatorData = {
  test: {
    h: 100,
    w: 75,
  }
};


// ===========================================================================================


// create p5 instance for more control
const s = p => {
  // create ui on client-side
  const createUI = () => {
    if (!APP_SETTINGS.isServer) {
      logger('connecting client-side UI');
      // connect the redraw button
      const btnRedraw = document.querySelector('button');
      btnRedraw.addEventListener('click', redraw);
      btnRedraw.addEventListener('touchstart', redraw);
      btnRedraw.addEventListener('keyup', redraw);
      // TODO: connect the data object textarea display
    }
  }

  // asks p5 to redraw the scene
  const redraw = () => {
    logger('redraw');
    // TODO: try to parse data from <textarea>
    // TODO: if data parses, then call this p.redraw() function
    p.redraw();
  };

  p.setup = function () {
    createUI();
    p.createCanvas(700, 410);

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
    p.rect(100, 100, 50, 50);

    // call this after drawing for logging and server-side flagging
    complete();
  };
};
// invoke p5 instance
new p5(s, 'canvas');
