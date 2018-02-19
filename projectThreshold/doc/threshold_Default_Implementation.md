# Implementation of the Default ImageJ Threshold Method

Author : De Mecquenem Ninon

## Introduction

Image segmentation consists in modifying an image to make it easier to process afterward. The image segmentation methods are very important in image processing. Indeed, it allows automatic target detection and recognition which is useful in domains like the analysis of medical images or microscope images in Biology or video surveillance. It can be applied to different methods just as Edge Detection, the watershed, and the method that interesting us, the thresholding[^SEG2007].
Thresholding consists in the calculation of a value depending on the image given in input and then transforms the pixels depending on this value. It transforms the image in binary, if the pixel is under or upper this value, its value will become 0 or 255 (depending on the chosen parameters).
Here we are interested in the Default mode which uses the Iso Data thresholding. This method has been established by Ridler and TW&Calvard[^RID1978].
Here is proposed two implementations of this method in javascript, with one using the paradigm of functional programming. The implementation has been done using the Java code of ImageJ of the function *defaultIsoData()* in the file *AutoThresholder.java*.
This work has been done in the context of the *time* project which stands for Tiny Image Processing in ECMAScript. It can be found on Github at [crazybiocomputing][times].
The Material and methods part will explain what is ImageJ and describe its function *defaultIsoData()* . The result part will be about the comparison of the proposed implementation with the ImageJ implementation.


## Material and Methods

ImageJ is an open source image processing program which is used by the scientific community. The [ImageJ][ij] application and its source code will always be freely available.
The Default function of ImageJ is the original method of auto-thresholding of ImageJ. The source code of the function can be found on the Github of ImageJ in the *Auto_Thresholder.java* file. It uses the IsoData methods which use an iterative mean procedure.
It consists in dividing the image into object and background by calculating the averages of the pixels that are above or below an initial threshold. Then it increments the threshold with the previously calculated values and repeats the process until the threshold calculated is larger than the composite average.
It is expressed by the formula:  
*threshold = (average background + average objects)/2.*

The function works with an image histogram (array) as entry and returns an integer which is the value of the threshold.
The aim of this work is to translate from the java code of ImageJ to a javascript code. It is interesting because Javascript can be used to create a web interface of ImageJ.

Once the function has been translated, the code has been transformed using the paradigm of functional programming. It consists in another way of thinking programing.  It is different from imperative programming because it uses few loops and use High Order function and pure functions.  The code is shorter and this approach avoid the side effects[^JHU1989].
Once the functions written, it is interesting to know which implementation is the more efficient. To answer this question, we will use Benchmarking, more precisely Micro-Benchmarking. The Benchmark consists in knowing the relative performance of a program while running it. It allows the developper to see if his algorithm and implementation are an improvement compared to the references. Micro Benchmarking is a specific Benchmark. The difference is that Micro Benchmark just mesure the performances of a little piece of code, here we compare plugins and not softwares for instance.  So here we will compare the execution time of our functions of interest on different images.
To measure the efficiency of our different functions, images with different sizes have been created from the Boat image available on the time project and the ImageJ image samples.

![Image1](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Boats.png "Boats")


Figure 1: Image of Boats used to test our function and run the Benchmark.


The pixel list of this image has been concatenated to obtain a higher image from the original one.  Thus, from a 360x288 image, we obtain 360x576, 360x864, 360x1152 and 360x1440 images.
 The two implementations done (with and without functional programming) will be compared with the ImageJ function. It is interesting to know if the version of a web ImageJ is more or less fast and resource consuming than the original one.

## Results and discussion
The function has been translated in javascript (thresholdDefaultIJ file) then modified using the functional programming paradigm (thresholdDefaukt file). The translation part of this work has been done. The modification has been done using first-order functions but not all the loops have been removed. Indeed, no other way to do the while loops and the do/while loop has been found. Furthermore, an "if" statement remains after the transformation because it contains a return statement, it was then no longer possible to use the ternary operator.

The implemented functions return the same threshold value than the ImageJ implementation. We can see below the image thresholded with our implementation and the ImageJ threshold.

![Image2](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/ComparisonImageJFunctionDefaultThreshold.png "Comparison ImageJ Function Default Threshold")


Figure 2: Comparison of the output of the threshold function of ImageJ and of the Javascript implementation.

The benchmark of our two functions and the ImageJ functions have been realized with a warmup phase of 100 iterations. Then the average time for each image size has been calculated on 1000 iterations per image. The result is displayed in milliseconds.

![Image3](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/ResultsBenchmarkThresholdDefault.png "Comparison ImageJ Function Default Threshold")


Figure 3: Results of the Benchmark. Time of execution of threshold default in milliseconds of our Javascript implementation (ThresholdDefaultIJ), our implementation using functional programming (ThresholdDefault) and the ImageJ one.


We can notice that the ImageJ function is way faster than the Javascript implementations. It can be explained by the fact that ImageJ is a pre-compiled language.

Also, the curve corresponding to the execution time of the ImageJ function does not seems to increase. We can suppose that the image sizes do not increase enough to see a change. Another thing is that the other functions increase too much to see correctly the changes in the ImageJ curve, even if it increases a little bit.
We can also notice that, even if the functional version is a little bit faster, the two implementations done are quite similar and increased a lot when the image size increases.

## Conclusion
The functions have been correctly translated from Java to Javascript and can be used in the time project.
It can still be improved by finding antoher way to write the while and do/while loops.
The proposed implementation in Javascript is slower than the ImageJ function in Java but can be used to do a web interface of ImageJ.

## References
[^SEG2007]: Segmentation Techniques for Target Recognition, G.N.SRINIVASAN, Dr. SHOBHA G, INTERNATIONAL JOURNAL OF COMPUTERS AND COMMUNICATIONS Issue 3, Volume 1, 2007.

[^HET2013]: Hetal J. Vala, Prof. Astha Baxi, "A Review on Otsu Image Segmentation Algorithm", International Journal of Advanced Research in Computer Engineering & Technology (IJARCET), Volume 2, Issue 2, February 2013

[^RID1978]: Ridler, TW&Calvard, S (1978), "Picture thresholding using an iterative selection method", IEEE Transactions on Systems, Man and Cybernetics 8: 630-632.

[^JHU1989]:  J. Hughes, "Why Functional Programming Matters", The Computer Journal, Volume 32, Issue 2, 1 January 1989, Pages 98–107,  01 January 1989

[times] : https://github.com/crazybiocomputing/times "Github crazybiocomputing"

[ij] : https://imagej.net/Welcome "Website of ImageJ"
