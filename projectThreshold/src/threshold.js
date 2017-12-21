/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

/**
 * Manual thresholding
 *
 * @param {number} value - Threshold value
 * @param {TImage} img - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TImage} - Binary output image with True = 0 (black) and False = 255 (white) pixels
 *
 * @author Jean-Christophe Taveau
 */
const threshold = (value) =>
  (img,copy_mode = true) => {
    let output = TImage.from(img,copy_mode);
    output.pixelData.forEach(px =>(px > value) ? 0 : 255);
    return output;
   }
}

/**
 * Otsu thresholding
 *
 * @param {TRaster} img - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} - Binary output image with True = 0 (black) and False = 255 (white) pixels
 *
 *
 * @author Mercia Ngoma Komb
 */

const otsu =  function(img,copy_mode=true) {
  let output = T.Raster.from(img, copy_mode);
  let histo = toHistogram(img);


  let thresh = 0;
  let N1 = histo[0];
  let N = 0;
  let BCV = 0;
  let BCVmax = 0;
  let num;
  let denom;
  let S = 0;
  let Sk=0;

  histo.reduce((a,b,c,d) => {
    S += c*d[c];
    N += d[c];
  });

  histo.reduce((a,b,c,d) => {
    Sk += c*d[c];
    N1 += d[c];


    denom = N1*(N-N1);
    num = (denom!=0) ? (N1/N)*S-Sk : num;
    BCV = (denom!=0) ? (num*num) / denom : 0;
    (BCV >= BCVmax) && (BCVmax = BCV);
    (BCV >= BCVmax) && (thresh = c);
  });
  console.log('Otsu');
  return threshold(thresh)(img,copy_mode=true);
}

/**
 * Max-entropy thresholding
 *
 * @param {TImage} img - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TImage} - Binary output image with True = 0 (black) and False = 255 (white) pixels
 *
 * @author Alexis Hubert
 */

const maxEntropy = function (img,copy=true) {
  let pixel = img.pixelData;
  let data = toHistogram(img);
  let thresh=-1;
  let ih, it;
  let tot_ent;
  let ent_back;
  let ent_obj;

  // Determine the normalized histogram /
  let total = data.reduce((a, b)=> a+b);
  let norm_histo = data.map(x => x / total);

  //Calculate cumulative normalized histogram
  let P1 = [...norm_histo];
  P1.reduce((a,b,c,d) => d[c] = a+b, 0);
  let P2 = [...P1];
  P2.reduce((a,b,c,d) => d[c] = 1-b, 0);

  // Determine the first non-zero bin
  let first_bin = data.findIndex(x => x>0);

  // Determine the last non-zero bin
  let last_bin = data.length-1 - data.slice().reverse().findIndex(x => x>0);

  // Calculate the total entropy each gray-level and find the threshold that maximizes it
  let max_ent = Number.MIN_VALUE;
  let list = data.map((x,y)=> y);
  let list3 = [];
  let list4= [];

  for (it = first_bin; it <= last_bin; it++ ) {

      // Calculate entropy of background
      ent_back = 0.0;
      list3 = list.filter(x=> x<=it);
      let back = list3.map((a,b)=> data[a] != 0 && (ent_back -= ( norm_histo[a] / P1[it] ) * Math.log ( norm_histo[a] / P1[it] )));

      // Calculate entropy of object
      ent_obj = 0.0;
      list4 = list.filter(x=> x>=(it+1));
      let obj = list4.map((a,b)=> data[a] != 0 && (ent_obj -= ( norm_histo[a] / P2[it] ) * Math.log ( norm_histo[a] / P2[it] )));

      tot_ent = ent_back + ent_obj;

      max_ent < tot_ent && (
        max_ent = tot_ent,
        thresh = it
      );
  }
  console.log('Max Entropy');
  return threshold(thresh)(img);
}


/**
 * K-means thresholding
 *
 * @param {number} k - Number of clusters wanted
 * @param {TImage} img - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TImage} - Processed Image
 *
 * @author: Julien Benetti
 */

const kmeans = (k) => (img,copy_mode = true) => {
  let output = T.Raster.from(img,true);
  let data = T.Raster.from(img,true).pixelData;
  let histo = toHistogram(img);

  // Initialize k number of random "centroids"
  let min = histo.findIndex(x => x > 0);
  let max = histo.length-histo.slice().reverse().findIndex(x => x > 0);
  let shisto = histo.slice(min,max);
  let centroidArray = shisto.map((x, idx) => idx+min).sort(() => 0.5-Math.random()).slice(0, k).sort((x, idx) => x-idx);

  // Find for each pixel the index of its closest centroid
  let labelArray = shisto.map((x, idx) => closestValueidx(idx+min, centroidArray));

  // Beginning of the kmeans loop
  let condition = true;
  while(condition) {
    // Initialize empty arrays of k lengths
    let newCentroidArray = Array(k).fill(0);
    let centroidNumber = [...newCentroidArray];

    // Add each pixel value of each cluster together
    labelArray.map((x, idx) => {
      newCentroidArray[x] += shisto[idx]*(idx+min);
      centroidNumber[x] += shisto[idx];});

    // Calculate new centroids and for each pixel the index of its closest one
    centroidArray = newCentroidArray.map((x, idx) => (x / centroidNumber[idx]) |0);
    let newLabelArray = shisto.map((x, idx) => closestValueidx(idx+min, centroidArray));

    // If none of them switch cluster : end of loop
    condition = !(labelArray.every((x, idx) => x === newLabelArray[idx]));
    (condition) && (labelArray = newLabelArray);
    cpt++
  }

  let minArray = Array(min).fill(0);
  let maxArray = Array(max-shisto.length-min).fill(k-1);
  flabelArray = [...minArray, ...labelArray, ...maxArray];

  // If binary thresholding : black and white. If multilevel : Value of the centroids.
  output.pixelData = (k==2) ? data.map(x => flabelArray[x]*255) : data.map(x => centroidArray[flabelArray[x]]);
  console.log(output);
  console.log('K-means');
  return output;
}

// Find in an array the index of its closest value to x
const closestValueidx = (x, arr) =>
        arr.map(y => x-y > 0 ? x-y : -(x-y))    // distance absolute value
           .reduce((bestidx, dist, idx, array) => dist < array[bestidx] ? idx : bestidx, 0);


/**
* <Description>
*
* @param {number} value - Threshold value
* @param {number} kernelsize - Convolution filer size
* @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
* @return {TRaster} - Binary output image with True = 0 (black) and False = 255 (white) pixels

* @author Rémy Viannais
*/
const adaptiveThreshold = (Threshold,kernelsize) => (raster,copy_mode=true) => {
  let output = T.Raster.from(raster,copy_mode);
  let sum = 0;
  let w = raster.width;
  let h = raster.height;
  let integralImg = new Float32Array(raster.length);
  let s= kernelsize;
  let t=Threshold;
  let img = raster.pixelData;

  //create Array to used functionnal language
  let warr = Array.apply(null, Array(w)).map((x, i) => i);
  let harr = Array.apply(null, Array(h)).map((y,j)=>j);

  //Creation of the integral image from the input image
  let integ = warr.map(i =>{
    sum = 0;
    harr.map(j =>{
      sum += img[i + j*w];
      (i==0) ? integralImg[i+j*w] = sum:integralImg[i+j*w] = integralImg[(i-1)+j*w] + sum;
    });
  });
  let int = warr.map(i => {
    harr.map(j => {
      //Compute of coordinated of s*s window with border check
      let x1 = (i-s<0) ? 0 : i-s;
      let x2 = (i+s>w-1) ? w-1 : i+s ;
      let y1 = (j-s<0) ? 0 : j-s;
      let y2 = (j+s>h-1) ? h-1 : j+s;
      //Compute of kernel area
      let count = (x2-x1)*(y2-y1);
      //Compute of the sum of pixel present in the kernel
      let sum = integralImg[x2+y2*w] - integralImg[x2+y1*w] - integralImg[x1+y2*w] + integralImg[x1+y1*w];
      //If the value of the current pixel is t percent less than this average then it is set black, otherwise it is set to white
      ((img[i+j*w] * count) <= (sum* (100-t)/100)) ? output.pixelData[i+j*w] = 0 : output.pixelData[i+j*w] = 255;
    });
  });
  console.log('AdaptiveThreshold');
  return output;
}

const toHistogram = (img) => {
  let y = 0;
  if (img.type == "uint8") {y=256}
  if (img.type == "uint16") {y=65536}
  let histo = Array(y).fill(0);
  data = img.pixelData;
  data.map(x => histo[x] += 1);
  return histo;
}
