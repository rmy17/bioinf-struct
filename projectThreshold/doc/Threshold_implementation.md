# Implementation of different thresholding algorithms

Julien Bentti, Alexis Hubert, Mercia N, Rémy Viannais

## Introduction 

Image segmentation segments a digital image based on a certain characteristic of the pixels is a well-known technique. The goal is to turn a grayscale image into a binary image, classifying each pixel into one of two categories, such as "dark" or "white". The most basic threshold technique is to choose a threshold value and compare each pixel to that value. Starting of this principle, many of thresholding methods have been developed. Among them, there are two main categories :  global thresholding, where a single threshold is used throughout the image to be divided into two classes and local thresholding, where the threshold values are determined locally, pixel by pixel or region by region. Three of four algorithm that will be presented Otsu, K-means and Entropie are part of the global thresholding category and are histogram based-methods. While the fourth algorithm, adaptive threshold is part of the local thresholding category and is based on the used of a kernel that runs through the image.

## Materiel and methods

### K-means 

k-means clustering is a method of vector quantization, it is one of the most popular method for cluster analysis. k-means clustering aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean, serving as a prototype of the cluster. k is set by the observer. 

The method has been adapted to automatic thresholding : each cluster will represent one side of a threshold. Choosing 2 clusters (k=2) will result in a bilevel thresholding. Choosing 3 or more will result in a multilevel thresholding. The mean of each cluster is usually called a "centroid".

Programm summary:

1. Initialization of k-numbers of random centroids.
2. Create k-numbers of cluster by labeling each pixel of the image with its closest centroid.
3. Compute the mean of each cluster to create brand new k-numbers of centroids.
4. Label each pixel with its closest new centroid and confront them to the old labels :
    If the old and new labels are exactly the same, stop the loop.
    Else, new labels supersede old labels then repeat steps 3 and 4.
5. Each pixel take the value of its closest centroid. If k=2, each pixel can become black or white.

### Adaptive threshold

Adaptive thresholding is the common solution that takes order to account for variations in illumination. The main difference with the other techniques is that a different threshold value is computed for each pixel in the image. This makes this technique more robust to variations in image illumination. 

The algorithm which creates a binary image uses the integral image tool to perform the calculations. it allow to compute the sum over multiple overlapping rectangular windows and achieve a constant number of operations per rectangle with only a linear amount of preprocessing. The algorithm contains several steps : 

1. Computation of the integral image.

To compute the integral image, the sum of all f(x,y) terms to the left and above the pixels(x,y) is store at each location ,I(x,y) using the following equation 1 : 

 <img style="align:center" src="https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equation%201.png" alt="Equation of integral image.">
    <em>Equation of integral image.</em>
    
![Equation of integral image.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equation%201.png)

In practice, a pixel of the integral image I(x,y) is calculated from the sum of the pixels of the image above f(x, yi) added to the left pixel of the previously calculated integral image such that I (x-1,y). 
At the same time the thresholding step at pixel is compute.

2. Computation kernel coordinates.
3. Computation the area of kernel.
4. Computation the sum of the pixels visited by the kernel.

the sum of the the pixel visited by the kernel is compute using the following equation :

![Equation of the sum of all pixel present in the kernel](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equationsum.png)

5. Determination the pixel value.

To determine the pixel value of the binary image, the product of the pixel value of the input image and the area of kernel is compared to the product of the sum of the pixels of the kernel with value given by the user to modulate this sum value. If the first product is lower than the second or equal the value of the pixel will be 0 and vice versa of 255.
 
 ### Max-entropy
 
The entropy of grayscale image is statistical measure of randomness that can be used to characterize the texture of the input image. It is used to describe the business of an image, i.e. the amount of information which must be coded for by a compression algorithm. This method use the derivation of the probability distribution of gray-levels to define the entropies and then find the maximum information between the object and the background - the entropy maximum, the threshold value.
 
Programm summary:
 
1. Determine the normalized histogram, and then calculate the cumulative normalized histogram.
2. Determine the first and the last non-zero bin.
3. Calculate the entropy of the background pixels and the entropy of object pixels.
4. Add these two entropy to get the total entropy for each gray-level and find the threshold that maximizes it.
 
 ### Otsu
 
Otsu method is a non-parametric and unsupervised method of automatic threshold selection for picture segmentation. The algorithm assumes that the image contains two classes of pixels following bimodal histogram (foreground pixels and background pixels),and search for the threshold that minimizes the intra-class variance (weighted sum of variances of the two classes). The aim is to find the threshold value where the sum of foreground and background spreads is at its minimum.
 
Programm summary:
 
1. Compute histogram and probabilities of each intensity level.
2. Set up initial class probability and initial class means.
3. Step through all possible thresholds maximum intensity.
4. Compute between class variance.
5. Desired threshold corresponds to the maximum value of between class variance.
 
 ## Results
 
A benchmarking has been used to compare the methods. It uses the performance.now() method returning a DOMHighResTimeStamp, measured in milliseconds, accurate to five thousandths of a millisecond (5 microseconds). 
The results are in millisecond and represent the mean of 100 iterations of the method after 100 iteration to warming it up. It compares the method according to the size of an image (1 "lena" to 10 "lenas") and to two web browsers : Firefox (Quantum 57.0.2 64bits) and Chrome (63.0.3239.84 64bits).

### k-means

![Benchmark with Firefox and Chrome(F = Firefox, C = Chrome).](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage1.png) 

 The two implemented methods are faster on Firefox than on Chrome. The result are also less fluctuating on Firefox. 

![Comparison between two implementation with and without histogram.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage2.png) 

The second method implemented is faster than the first (10 times faster on a 512*512 pixels image to 50 times faster on a image with 10x more pixels). 


![Benchmark to compare the two K values K=2 and K=3 using Firefox.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage3.png)  

The number of loop turn is only correlated to the k-number and not to the image size. 


![Ratio of time between the execution of algorithm and the creation od raster using Firefox.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage4.png)  

The loading of the Raster in the method takes around 75% of the time of the method.

### Adaptive threshold

![Benchmark of the Adaptive threshold method with Firefox and Chrome](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/benchImgJuju.png)

The figure 5 show that the obtained results from benchmarks are very variables, it's very surprising. Indeed, we can observe that the execution times globally increases with the the image size increasing. However, we can also observes that the execution with biggest size images is sometimes faster with small pictures. Another benchmark with increasing size images is proportional did not show any variability in the results. An exponential curve is observed, which has been expected (Figure 6).

![Benchmark of the Adaptative threshold method with proportional size images and with Firefox and Chrome](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/benchAdapMe.png)

### Max Entropy

### Otsu

The result of our benchmark for our function for images uint8 shows us the expected result: the otsu() function is the fastest. the function takes longer as the image grows. We can also see that the differences between the two browsers are firefox and chrome, as we increase the size of the input image, the algorithm takes three more times the execution time.This result was expected for otsu because its algorithm  operates on histograms (which are integer or float arrays of length 256), it's quite fast unlike adaptive threshold for example.

![benchmark of the Otsu method with Firefox and Chrome](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/BenchOtsuJuju.png)
*Execution time of the function with ten increasing image sizes (uint8 images)*

## Discussion

All the functions can handle the processing of pictures up to 2048x2048 pixels and maybe higher, and two types : uint8, uint16.

### K-means

Two implementations have been designed. The first one, as proposed in the program summary, following a direct description of the k-means clustering, has to read through each pixel of the image multiples times, to label them and to compare new and old label to each other. It is getting slower the bigger the image is.

The second method has be designed to improve the speed of the program. This implementation takes advantage of the histogram of the image and only has to read through 256 values at maxima for a 8-bit image - 65535 for a 16-bit image - when computing centroids or labelling each pixel with a cluster. A initialization step has been added to compute the histogram of the image.

### Adaptive threshold

The adaptive threshold algorithm is a local thresholding method. So, there is an path throughout of the image. For this reason, this algorithm is slowness than other global thresholding algorithm which used the histogram. But the strong variabilities obtained are difficult to explain. This may come from the kernel calculation method even if we get a correct curve with proportional size images.

## References

[^BRA2007]: Bradley D, Roth G. Adaptive thresholding using integral image. Journal of Graphics Tools. Volume 12, Issue 2.  pp. 13-21. 2007. NRC 48816.
