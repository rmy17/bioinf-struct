# Implementation of threshold moments

Kourmanalieva Antoine 

## Introduction 

The image thresholding is mainly used in image analysis and is the most simple way for image segmentation.
It replaces one by one the pixels of an image using a fixed threshold value. Thus, if a pixel with a value greater than the threshold , it will take the value 255 (white), and if its value is lower (for example 100), it will take the value 0 (black).
It is called bilevel thresholding.
The Moments Thresholding method has been established by WEN-HSIANG TSAI [^TSA1985]. The implementation has been done using the Java code of ImageJ of the function moments() in the file AutoThresholder.java. This work has been performed in the context of the TIME project which stands for Tiny Image Processing in ECMAScript. Material and methods will describe the moment() function of ImageJ and the Benchmark procedure. The result part will be about the comparison of the proposed implementation with the ImageJ implementation.

## Materiels and methods

Tsai's method attempts to preserve the moments of the original image in the thresholded result. 
A new approach to automatic threshold selection using the moment-preserving principle. The threshold values are computed to preserve the moments of an input picture in the output picture. Experimental results show that the approach can be employed to threshold a given picture into meaningful gray-level classes. The approach is described for global thresholding, but can be used for local thresholding.

ImageJ is a free Java-based image processing program developed at the National Institutes of Health. ImageJ was designed with an open architecture that provides extensibility via Java plugins and recordable macros. Custom acquisition, analysis and processing plugins can be developed using ImageJ's built-in editor and a Java compiler. 

We will use boats image available on the time project and the ImageJ image samples in order to perform the Moments threshold.

![enter image description here](https://image.noelshack.com/fichiers/2018/08/6/1519487747-boats.png)

Figure 1 : boats sample image used for the test.

Two implementations will be used, functionnal and non functionnal javascript code. We will compare the time of processing by using benchmark on different sizes of image. We will also compare two Web Browsers : Firefox(version 57.0.4 (64bits)) and Chrome (version 64.0.3282.119 (64bits)). 
This benchmark will have a warm-up phase corresponding to 100 iterations of the function, followed by the application of the threshold on the different image sizes that are (in pixels): 360 * 288, 720 * 576, 1480 * 1152, 2960 * 2304, 3600 * 2880, 7200 * 5760. There will be 1000 executions of the Moment script by image size, we will record the time before and after the execution of the function. And we will calculate at the end of every 1000 iterations made on each image size, the average obtained from the execution time. It uses the performance.now() which mesure time in milliseconds.

## Results and discussion
 
We first use the moment function of the J image Auto_threshold.java file in order to retranscribe it as javascript for the API time. Then we transcribed this code to the functional style. Some loops could not be functional because it crashed the script. Only two in four loops have been switched to functional.
The Moment function uses an input histogram obtained by a function in API time.

At the end of the moment function, we returned an image with the applied treshold.

Here we have the comparison of image J moment function and the javascript moment function : 

![enter image description here](https://lh3.googleusercontent.com/7ys8Q3oUa2EHpLxKvvKy1pyNsd2cQY9-GTWFpOnwyfyFxzqsH6_d0NNAI58iO-NBmH8XG7vV67zNnHoIUU9L=w1910-h842)

Figure 2 : Comparision of Moment threshold obtained in Image J (left) and Javascript (right).


Here we have the benchmark results : 

![enter image description here](https://image.noelshack.com/fichiers/2018/08/6/1519487843-chartgo.png)

Figure 3 : Benchmark of function Moment with Firefox, Chrome and Image J.

We can see that the Moment function is faster on the different image sizes, and that this can be explained by the fact that java, which is the language used by imageJ, is precompiled.
We can also find that the function passed in functional is slightly faster than the non-functional one, one could improve these results by putting the remaining loops in functional.

There is also a gain in performance using Firefox for the application of the threshold moment.

## Conclusion

To conclude, Javascript function and Image J function give identical results, we obtained the same value of thresholding. 
Javascript web browser version of moment function is more slower than the imageJ version. 

The interesting fact is that the threshold function can be imported to the web interface TIME. This allows the online image analysis application to provide easy access to imaging tools for a wide audience.


## References


[^TSA1985]: Tsai, W (1985), "Moment-preserving thresholding: a new approach", Computer Vision, Graphics, and Image Processing 29: 377-393


