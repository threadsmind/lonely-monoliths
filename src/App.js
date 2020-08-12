// create virtual DOM
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// create virtual console to catch errors in the virtual DOM
const vc = new jsdom.VirtualConsole();
vc.on('error', (e) => { console.log('error: ' + e) });
vc.on('warn', (e) => { console.log('warn: ' + e) });
vc.on('info', (e) => { console.log('info: ' + e) });
vc.on('log', (e) => { console.log('log: ' + e) });

// jsdom options
const options = {
  resources: 'usable',
  runScripts: 'dangerously',
  vc
};

// load and parse the html file
JSDOM.fromFile('./src/index.html', options).then((dom) => {
  // wait for p5 script to load and run
  function isFinished() {
    if (dom.window.imageComplete === true) {
      // gather the canvas data
      const { getImageData } = require('./GetImageData');
      const imageData = getImageData(dom);
      // send data to Twitter / discord / etc.
      const { exportImage } = require('./ExportImage');
      exportImage(imageData);
    } else {
      setTimeout(() => {
        isFinished();
      }, 100);
    }
  }
  isFinished();
});
