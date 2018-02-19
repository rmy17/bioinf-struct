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
  * Default thresholding
  *
  * @param {TRaster} raster - Input gray-level image raster
  * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
  * @return {TRaster} - Binary output image raster with True = 0 (black) and False = 255 (white) pixels
  *
  * @author Ninon De Mecquenem
  */
const thresholdDefaultIJ=function(raster,copy=true){
function thresholdDefIJ(pixel){
  let n= pixel.length;
  let raster2= [n];
  let maxCount=0; let mode=0;
  for(let i=0; i<n; i++){
    let count=pixel[i];
    raster2[i]=pixel[i];
    if(raster2[i]>maxCount){
      maxCount=raster2[i];
      mode=i;
    }
  }
  let maxCount2=0;
  for(let i=0; i<n; i++){
    if((raster2[i]>maxCount2) && (i != mode)){
      maxCount2=raster2[i];
    }
  }
  let hmax = maxCount;
  if ((hmax>(maxCount2*2)) && (maxCount2!=0)) {
    hmax = (maxCount2 * 1.5);
    raster2[mode] = hmax;
  }
  //console.log("result def thresh : " +(IJIsoData(raster2)))
  return (IJIsoData(raster2));
}
let binNumber = (raster.type === 'uint8' || raster.type === 'float32') ? 256 : 65536;
raster = cpu.histogram(binNumber)(raster);
// Compute threshold
let the_threshold = thresholdDefIJ(raster.statistics.histogram, copy_mode=true);
//console.log(`Default Threshold: ${the_threshold}`);
// Apply threshold
return threshold(the_threshold)(raster, copy_mode);
}
/**
 * IsoData function
 *
 * @param {TRaster} raster - Input gray-level image raster
 * @return {Integer} - level that will be used to threshold
 *
 * @author Ninon De Mecquenem
 */

function IJIsoDataIJ(data) {
  // This is the original ImageJ IsoData implementation, here for backward compatibility.
  let level=0;
  let maxValue = data.length - 1;
  let result; let sum1; let sum2; let sum3; let sum4;
  let count0 = data[0];
  data[0] = 0; //set to zero so erased areas aren't included
  let countMax = data[maxValue];
  data[maxValue] = 0;
  let min = 0;
  while ((data[min]==0) && (min<maxValue)){
    min++;}
  let max = maxValue;
  while ((data[max]==0) && (max>0)){
    max--;}
  if (min>=max) {
    data[0]= count0; data[maxValue]=countMax;
    level = data.length/2;
    return level;
  }

  let movingIndex = min;
  let inc = Math.max(max/40, 1);
  do {
    sum1=0.0;sum2=0.0;sum3=0.0;sum4=0.0;
    for (let i=min; i<=movingIndex; i++) {
      sum1 += i*data[i];
      sum2 += data[i];
    }
    for (let i=(movingIndex+1); i<=max; i++) {
      sum3 += i*data[i];
      sum4 += data[i];
    }
    result = (sum1/sum2 + sum3/sum4)/2.0;
    movingIndex++;
  } while ((movingIndex+1)<=result && movingIndex<max-1);
  data[0]= count0; data[maxValue]=countMax;
  level = Math.round(result);
  return level;
}

/**
 * Default thresholding - using paradigm of functional programming
 *
 * @param {TRaster} raster - Input gray-level image raster
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} - Binary output image raster with True = 0 (black) and False = 255 (white) pixels
 *
 * @author Ninon De Mecquenem
 */
const thresholdDefault=function(raster,copy=true){ //modif img->raster + check si ça marche seulement en 8bits
  const thresholdDefaultfunctional = (pixel) =>{
  let n= pixel.length
  let raster2= [n];
  let maxCount=0; let mode=0;
  pixel.reduce((acc,curVal, curIdx, array) => {raster2[curIdx]=array[curIdx]; (raster2[curIdx]>maxCount) ? (maxCount=raster2[curIdx], mode=curIdx) : (maxCount) ;},0);
  let maxCount2=0;
  raster2.reduce((acc,curVal, curIdx, array) => ((raster2[curIdx]>maxCount && (curIdx != mode)) ? (maxCount2=raster2[curIdx]): (maxCount2)),0);
  hmax = maxCount;
  ((hmax>(maxCount2*2)) && (maxCount2!=0)) ? (hmax = (maxCount2 * 1.5), raster2[mode] = hmax) : (hmax);
  return (IJIsoData(raster2));
}
let binNumber = (raster.type === 'uint8' || raster.type === 'float32') ? 256 : 65536;
raster = cpu.histogram(binNumber)(raster);
// Compute threshold
let the_threshold = thresholdDefaultfunctional(raster.statistics.histogram, copy_mode=true);
return threshold(the_threshold)(raster, copy_mode);
}
/**
 * IsoData function - using paradigm of functional programming
 *
 * @param {TRaster} raster - Input gray-level image raster
 * @return {Integer} - level that will be used to threshold
 *
 * @author Ninon De Mecquenem
 */
const IJIsoData= (data) => {
  // This is the original ImageJ IsoData implementation, here for backward compatibility.
  let level=0; let maxValue = data.length - 1;
  let result; let sum1; let sum2; let sum3; let sum4; let count0 = data[0];
  data[0] = 0; //set to zero so erased areas aren't included
  let countMax = data[maxValue];
  data[maxValue] = 0;
  let min = 0;
  while ((data[min]==0) && (min<maxValue)){min++;}
  let max = maxValue;
  while ((data[max]==0) && (max>0)){max--;}
  if (min>=max) {
    data[0]= count0; data[maxValue]=countMax;
    level = data.length/2;
    return level;
  }
  let movingIndex = min;
  let inc = Math.max(max/40, 1);
  do {
    sum1=sum2=sum3=sum4=0.0;
    data.reduce((acc,curVal, curIdx, array) => ((curIdx<=movingIndex) ? (sum1 += curIdx*data[curIdx], sum2 += data[curIdx]) : (sum2)),0);
    data.reduce((acc,curVal, curIdx, array) => ((curIdx >= movingIndex+1) ? ((curIdx<=max) ? (sum3 += curIdx*data[curIdx], sum4 += data[curIdx]) : (max)) : (max)), 0);
    result = (sum1/sum2 + sum3/sum4)/2.0;
    movingIndex++;
  } while ((movingIndex+1)<=result && movingIndex<max-1);
  data[0]= count0; data[maxValue]=countMax;
  level = Math.round(result);
  return level;
}

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
const threshold = (value) => (raster, copy_mode = true) => {
    let output = T.Raster.from(raster, copy_mode);
    raster.pixelData.forEach((px, i) => output.pixelData[i] = (px > value) ? 0 : 255);
    // Update statistics + histogram
    cpu.histogram(256)(output, copy_mode);
    return output;
};
