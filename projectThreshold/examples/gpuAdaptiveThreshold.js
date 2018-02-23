

let img = new T.Image('uint8',256,254);
img.setPixels(new Uint8Array(blobs_pixels));
let gpuEnv = gpu.getGraphicsContext("preview");
gpuDisplay(img.getRaster(),gpuEnv);



let img1 = new T.Image('uint8',256,254);
img1.setPixels(new Uint8Array(blobs_pixels));
let gpuEnv1 = gpu.getGraphicsContext("preview1");
gpuAdaptiveThreshold (0.5)(img1.getRaster(),gpuEnv1);
