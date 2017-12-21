# Implementation of different thresholding algorithms

Julien Bentti, Alexis Hubert, Mercia N, Rémy Viannais

## Introduction 

Image segmentation segments a digital image based on a certain characteristic of the pixels is a well-known technique. The goal is to turn a grayscale image into a binary image, classifying each pixel into one of two categories, such as "dark" or "white". The most basic threshold technique is to choose a threshold value and compare each pixel to that value. Starting of this principle, many of thresholding methods have been developed. Among them, there are two main categories :  global thresholding, where a single threshold is used throughout the image to be divided into two classes and local thresholding, where the threshold values are determined locally, pixel by pixel or region by region. Three of four algorithm that will be presented Otsu, K-means and Entropie are part of the global thresholding category and are histogram based-methods. While the fourth algorithm, adaptive threshold is part of the local thresholding category and is based on the used of a kernel that runs through the image.

## Materiel and methods

### K-means 

k-means clustering is a method of vector quantization, it is one of the most popular method for cluster analysis. k-means clustering aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean, serving as a prototype of the cluster. k is set by the observer. 

The method has been adapted to automatic thresholding : each cluster will represent one side of a threshold. Choosing 2 clusters (k=2) will result in a bilevel thresholding. Choosing 3 or more will result in a multilevel thresholding. The mean of each cluster is usually called a "centroid".

Programm summary:
<ol>
<li>Initialization of k-numbers of random centroids.</li>
<li>Create k-numbers of cluster by labeling each pixel of the image with its closest centroid.</li>
<li>Compute the mean of each cluster to create brand new k-numbers of centroids.</li>
<li>Label each pixel with its closest new centroid and confront them to the old labels :
    If the old and new labels are exactly the same, stop the loop.
    Else, new labels supersede old labels then repeat steps 3 and 4.
    </li>
<li>Each pixel take the value of its closest centroid. If k=2, each pixel can become black or white.</li>
</ol>

### Adaptive threshold

Adaptive thresholding is the common solution that takes order to account for variations in illumination. The main difference with the other techniques is that a different threshold value is computed for each pixel in the image. This makes this technique more robust to variations in image illumination. 

The algorithm which creates a binary image uses the integral image tool to perform the calculations. it allow to compute the sum over multiple overlapping rectangular windows and achieve a constant number of operations per rectangle with only a linear amount of preprocessing. The algorithm contains several steps : 
<ul>
<li>Computation of the integral image.</li>
To compute the integral image, the sum of all f(x,y) terms to the left and above the pixels(x,y) is store at each location ,I(x,y) using the following equation 1 : 


![Equation of integral image](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equation%201.png)

In practice, a pixel of the integral image I(x,y) is calculated from the sum of the pixels of the image above f(x, yi) added to the left pixel of the previously calculated integral image such that I (x-1,y). 
At the same time the thresholding step at pixel is compute.

<li>Computation kernel coordinates.</li>
<li>Computation the area of kernel.</li>
<li>Computation the sum of the pixels visited by the kernel.</li>

the sum of the the pixel visited by the kernel is compute using the following equation :


![Equation of the sum integral image pixels](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equationsum.png)

## References

[^BRA2007]: Bradley D, Roth G. Adaptive thresholding using integral image. Journal of Graphics Tools. Volume 12, Issue 2.  pp. 13-21. 2007. NRC 48816.
