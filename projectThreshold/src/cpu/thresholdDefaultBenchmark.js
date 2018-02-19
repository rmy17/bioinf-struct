let myimgs = []

let img1 = new T.Image('uint8',360,288);
img1.setPixels(new Uint8Array(boats_pixels));
myimgs.push(img1);

let img2 = new T.Image('uint8',360,576);
//console.log("img2");
let mypix2 = boats_pixels.concat(boats_pixels);
img2.setPixels(new Uint8Array(mypix2));
myimgs.push(img2);

let img3 = new T.Image('uint8',360,864);
let mypix3 = boats_pixels.concat(boats_pixels).concat(boats_pixels);
img3.setPixels(new Uint8Array(mypix3));
myimgs.push(img3);

let img4 = new T.Image('uint8',360,1152);
let mypix4 = boats_pixels.concat(boats_pixels).concat(boats_pixels).concat(boats_pixels);
img4.setPixels(new Uint8Array(mypix4));
myimgs.push(img4);

let img5 = new T.Image('uint8',360,1440);
let mypix5 = boats_pixels.concat(boats_pixels).concat(boats_pixels).concat(boats_pixels).concat(boats_pixels);
img5.setPixels(new Uint8Array(mypix5));
myimgs.push(img5);

console.log("Benchmark");

//----------------benchmark functional-----------


myBenchResults=[];
for (i=0; i<myimgs.length; i++){
  let raster2 = myimgs[i].getRaster();
  let binary = thresholdDefault(raster2);
  //WARMUP
  for (j=0; j<100; j++){
    thresholdDefault(raster2);
  }
//Benchmark
performance.now();
  for (j=0; j<1000; j++){
    thresholdDefault(raster2);
  }
let myTime = performance.now();
myBenchResults.push(myTime/1000);
}
console.log("Result Benchmark with functional programming");
console.log(myBenchResults);

//--------------------benchmark defaultij----------------
myBenchResultsIJ=[];
for (i=0; i<myimgs.length; i++){
  let raster2 = myimgs[i].getRaster();
  let binary = thresholdDefaultIJ(raster2);
  //WARMUP
  for (j=0; j<100; j++){
    thresholdDefaultIJ(raster2);
  }
  //BENCHMARK
performance.now();
  for (j=0; j<1000; j++){
    thresholdDefaultIJ(raster2);
  }
let myTime = performance.now();
myBenchResultsIJ.push(myTime/1000);
}
console.log("Result Benchmark");
console.log(myBenchResultsIJ);
