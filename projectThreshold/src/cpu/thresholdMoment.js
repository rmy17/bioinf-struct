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
    raster.pixelData.forEach((px, i) => output.pixelData[i] = (px < value) ? 0 : 255);
    // Update statistics + histogram
    cpu.histogram(256)(output, copy_mode);
    return output;
};

/** 
 * Moment thresholding
 *
 * @param {number} value - Threshold value
 * @param {TRaster}   raster - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} raster - Thresholded Image
 *
 * @author Antoine Kourmanalieva
 */

const _thresholdMoment = function (raster, copy_mode = true){
    
    const thresholdMomentIJ = (histogram) => {
      
        let total = 0;
        let m0 = 1.0, m1 = 0.0, m2 = 0.0, m3 = 0.0, sum = 0.0, p0 = 0.0;
        let cd, c0, c1, z0, z1;	/* auxiliary letiables */
        let thresh = -1;

        let histo = [256];

        for (let i = 0; i < histogram.length; i++)
            total += histogram[i];

        for (let i = 0; i < histogram.length; i++)
            histo[i] = (histogram[i] / total); //normalised histogram

        /* Calculate the first, second, and third order moments */
        for (let i = 0; i < histogram.length; i++) {
            m1 += i * histo[i];
            m2 += i * i * histo[i];
            m3 += i * i * i * histo[i];
        }
        /* 
        First 4 moments of the gray-level image should match the first 4 moments
        of the target binary image. This leads to 4 equalities whose solutions 
        are given in the Appendix of Ref. 1 
        */
        cd = m0 * m2 - m1 * m1;
        c0 = (-m2 * m2 + m1 * m3) / cd;
        c1 = (m0 * -m3 + m2 * m1) / cd;
        z0 = 0.5 * (-c1 - Math.sqrt(c1 * c1 - 4.0 * c0));
        z1 = 0.5 * (-c1 + Math.sqrt(c1 * c1 - 4.0 * c0));
        p0 = (z1 - m1) / (z1 - z0);  /* Fraction of the object pixels in the target binary image */

        // The threshold is the gray-level closest  
        // to the p0-tile of the normalized histogram 
        sum = 0;
        for (let i = 0; i < histogram.length; i++) {
            sum += histo[i];
            if (sum > p0) {
                thresh = i;
                break;
            }
        }
        return thresh;
       
    }
    const thresholdMoment = (histogram) => {

        let total = 0;
        let m0 = 1.0, m1 = 0.0, m2 = 0.0, m3 = 0.0, sum = 0.0, p0 = 0.0;
        let cd, c0, c1, z0, z1;	/* auxiliary letiables */
        let thresh = -1;

        let histo = [256];


        histogram.reduce((a, v, i) => { total += v }); // WORK
        
        for (let i = 0; i < histogram.length; i++)
           histo[i] = (histogram[i] / total); //normalised histogram
        // histogram.reduce((v, i) => { histo[i] = (v/total) });  DOESN'T WORK -- TO DO

        /* Calculate the first, second, and third order moments */
        // REDUCE
        histo.reduce((a, v, i) => {   // WORK       
            m1 += i * v;
            m2 += i * i * v;
            m3 += i * i * i * v});  
       
        /* 
        First 4 moments of the gray-level image should match the first 4 moments
        of the target binary image. This leads to 4 equalities whose solutions 
        are given in the Appendix of Ref. 1 
        */
        cd = m0 * m2 - m1 * m1;
        c0 = (-m2 * m2 + m1 * m3) / cd;
        c1 = (m0 * -m3 + m2 * m1) / cd;
        z0 = 0.5 * (-c1 - Math.sqrt(c1 * c1 - 4.0 * c0));
        z1 = 0.5 * (-c1 + Math.sqrt(c1 * c1 - 4.0 * c0));
        p0 = (z1 - m1) / (z1 - z0);  /* Fraction of the object pixels in the target binary image */

        // The threshold is the gray-level closest  
        // to the p0-tile of the normalized histogram 
        sum = 0;
        
        // histo.reduce((a, v, i) => {   -- DOESN'T WORK -- TO DO
        //     sum += v;          
        //     if (sum > p0) {
        //         thresh = i;
        //         return thresh;
        //         }
            // })
        // REDUCE         
       for (let i = 0; i < histogram.length; i++) {  
           sum += histo[i];
            if (sum > p0) {
                thresh = i;
                return thresh;
            }
        }
        return thresh;
       
    }
    let binNumber = (raster.type === 'uint8' || raster.type === 'float32') ? 256 : 65536;
    raster = cpu.histogram(binNumber)(raster);
    // Compute threshold
    let the_threshold = thresholdMoment(raster.statistics.histogram);
    console.log(`Moment Threshold: ${the_threshold}`);
    // Apply threshold
    return threshold(the_threshold)(raster, copy_mode);
}

