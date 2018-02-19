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
 * Julien Benetti
 */


 /**
  * Get one or more thresholds with the k-means clustering method
  *
  * @alias Threshold~kmeans
  * @param {array} histogram - Histogram of the Image
  * @param {number} k - Number of clusters wanted, 2 by default
  * @returns {number or array}  One or more thresholds
  *
  * @author: Julien Benetti
  */

function kmeans(histogram, k=2) {

  // Find the first the last non-empty bin and create a smaller histogram
  let first = histogram.findIndex(x => x > 0);
  let last = histogram.length-1 - histogram.slice().reverse().findIndex(x => x > 0);
  let newHistogram = histogram.slice(first, last);

  /* Array of k numbers of unique random histogram values called centroids

     Create a array filled with number from 0 to the histogram length
     Shuffles it randomly then slice it to have the k desired numbers
     Sort the sliced array in an ascendant order                           */

  let centroidArray = newHistogram.map((currentValue, index) => index)
                               .sort(() => 0.5 - Math.random())
                               .slice(0, k)
                               .sort((currentValue, index) => currentValue - index);

  // Array labeling each value of the histogram with the index of its closest centroid
  let labelArray = histogram.map((currentValue, index) => closestValueIndex(index, centroidArray));

  // K-means For loop. Stop after 100 iteration or when the break condition is fulfilled.
  for (let x = 0; x<100; x++) {

    // Initialisation of two 0-filled arrays
    let newCentroidArray = Array(k).fill(0);
    let centroidNumber = [...newCentroidArray];

    /* Fill the new centroid array with the number of their closest pixels weighted by their value
       Fill the centroid number array with the number of the closest pixels of each centroids      */
    labelArray.map((currentValue, index) => { newCentroidArray[currentValue] += histogram[index] * index;
                                                centroidNumber[currentValue] += histogram[index]    });

    /* Array of the new centroids; "|0" is a binary operation to floor a number
       Division between the weighted centroids and their number of pixels       */
    centroidArray = newCentroidArray.map((currentValue, index) => (currentValue / centroidNumber[index]) |0);

    // Array of the new labels (see l. 50)
    let newLabelArray = histogram.map((currentValue, index) => closestValueIndex(index, centroidArray));

    // Break condition : if the new label array is exactly the same as the previous label array it then stops the For Loop
    if (labelArray.every((currentValue, index) => currentValue === newLabelArray[index])) {
       break;
    } else {
       labelArray = newLabelArray;
    }
  }

    /* Return a threshold if k=2 or a array of thresholds if k>2
       A threshold value is a mean between two centroids          */
    let thresholdArray = Array(k - 1).fill(0).map((currentValue, index) => ((centroidArray[index] + centroidArray[index + 1]) / 2) |0);
    let arrayThresholdCentroid = [[...thresholdArray],[...centroidArray]];
    return thresholdArray.length == 1 ? thresholdArray[0] : arrayThresholdCentroid;
}

/**
 * Get the index of the closest number of a array compared to a number
 *
 * @alias Threshold~closestValueIndex
 * @param {number} testedValue - Compared number
 * @param {array} arr - Compared Array
 * @returns {number}  Index of the closest number of the array to a tested value
 *
 * @author: Julien Benetti
 */

 /* Create a array of the absolute values of the substract of a testedValue and each number of the inputted array
    Find the index of the minimum absolute value                                                                   */
const closestValueIndex = (testedValue, arr) =>
        arr.map(currentValue => testedValue-currentValue > 0 ? testedValue-currentValue : -(testedValue-currentValue))
           .reduce((bestIndex, currentValue, currentIndex, array) => currentValue < array[bestIndex] ? currentIndex : bestIndex, 0);
