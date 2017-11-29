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
* Rémy Viannais
*/


/**
  * Get one or more thresholds with the k-means clustering method
  *
  * @alias Threshold~AdaptativeThreshold
  * @param {TRaster} img - Input gray-level image
  * @param {number} width - Width of the input image
  * @param {number} height - Height of the input image
  * @returns {TRaster}  One or more thresholds
  * @author: Julien Benetti
  */

const AdaptativeThreshold = function (img,w,h,copy=true){
  let sum = 0;
  let i = 0;
  let integralImg = [];
  let s= w >> 4;
  let out = [];
  let t =10;

  //Create an array from 0 to width to perform functional coding
  let warr = Array.apply(null, Array(w));
  let wArray = warr.map((x, i) => i);

  //Create an array from 0 to height to perform functional coding
  let harr = Array.apply(null, Array(h));
  let hArray = harr.map((y,j)=>j);

  /*
  Filling the integral image.The first row and the first column are
  the cumulative sum of the pixels of the input image and the rest
  and the sum of the all f(x,y) terms to left and above the pixel (x,y)
  */
  let integ = wArray.map(i =>{
    sum = 0;
    hArray.map(j =>{
      sum += img[i + j*w];
      (i==0) ? integralImg[i+j*w] = sum:integralImg[i+j*w] = integralImg[(i-1)+j*w] + sum;
    });
  });

let int = wArray.map(i => {
    hArray.map(j => {
      //Compute of coordinated of s*s window
      let x1 = (i-s>0) ? i-s : 1;
      let x2 = (i+s<w-1) ? i+s : w-1;
      let y1 = (j-s>0) ? j-s : 1;
      let y2 = (j+s<h-1) ? j+s : h-1;
      //Average s*s
      let count = (x2-x1)*(y2-y1);
      //Compute integral image
      let sum = integralImg[x2+y2*w] - integralImg[x2+(y1-1)*w] - integralImg[(x1-1)+y2*w] + integralImg[(x1-1)+(y1-1)*w];
      //If the value of the current pixel is t percent less than this average then it is set black, otherwise it is set to white
      ((img[i+j*w] * count) <= (sum* (100-t)/100)) ? out[i+j*w] = 0 : out[i+j*w] = 255;
    });
  });
  console.log('AdaptativeThreshold');
  return out;
}
