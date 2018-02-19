
let img0 = new T.Image('uint8',360,288);
img0.setPixels(new Uint8Array(boats_pixels));
let raster = img0.getRaster();
let binary = thresholdDefault(raster);
//console.log(binary.statistics.histogram[255]);
let workflow = cpu.pipe(thresholdDefault, cpu.threshold(93), cpu.view);
let view = workflow(raster);
let win = new T.Window('Default - Boats');
// Create the window content from the view
win.addView(view);
// Add the window to the DOM and display it
win.addToDOM('workspace');
