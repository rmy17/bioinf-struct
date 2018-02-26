
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
 * This program is distributed in the hope that it will be useful,
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
 * @param {TRaster}   raster - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} - Binary output image with True = 0 (black) and False = 255 (white) pixels
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

/**
 * Moment IJ thresholding
 *
 * @param {number} value - Threshold value
 * @param {TRaster}   raster - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} - Binary output image with True = 0 (black) and False = 255 (white) pixels
 *
 * @author Mercia Ngoma Komb
 */
 const intermodes = function (raster, copy_mode = true ) {

     const intermodesIJ = (histogram) => {
       let data = raster;

       let minbin=-1, maxbin=-1;
       for (let i=0; i<data.length; i++){
           if (data[i]>0) maxbin = i;
         }
       for (let i=data.length-1; i>=0; i--){
           if (data[i]>0) minbin = i;
         }
       let length = (maxbin-minbin)+1;
       let hist = [length];
       for (let i=minbin; i<=maxbin; i++){
           hist[i-minbin] = data[i];
         }

       let iter = 0;
       let threshold=-1;
       while (!bimodalTest(hist) ) {
            //smooth with a 3 polet running mean filter
           let previous=0;
           let current=0;
           let next=hist[0];
           for (let i=0; i<length-1; i++) {
               previous = current;
               current = next;
               next = hist[i + 1];
               hist[i] = (previous+current+next)/3;
           };

           hist[length-1] = (current+next)/3;
           iter++;
           //console.log(iter);
           if (iter>10000) {
               threshold = -1;
               //console.log("ici");
               console.log("intermodes Threshold not found after 10000 iterations.");
               return threshold};
        }
        let tt=0;
        for (let i=1; i<length - 1; i++) {
            if (hist[i-1] < hist[i] && hist[i+1] < hist[i]){
                tt += i;
            }
        }
        threshold = Math.floor(tt/2.0);
        console.log("la");
        return threshold+minbin;

      }


      const bimodalTest = function (y) {
          let len = y.length;
          let b = false ;
          let modes = 0;

          for ( let k = 1 ; k < len- 1 ; k ++) {
              if (y [k - 1 ] <y [k] && y [k + 1 ] <y [k]) {
                  modes++;
                  if (modes> 2 ){
                      return false };
              };
          };
          if (modes == 2 )
              b = true ;
          return b;
      }


      // Get Histogram
      let binNumber = (raster.type === 'uint8' || raster.type === 'float32') ? 256 : 65536;
      raster = cpu.histogram(binNumber)(raster);
      // Compute threshold
      let the_threshold = intermodesIJ(raster.statistics.histogram);
      console.log(`ThresholdIntermodes: ${the_threshold}`);
      // Apply threshold
      return threshold(the_threshold)(raster,copy_mode);;
  }

         // The threshold is the mean between the two peaks.
