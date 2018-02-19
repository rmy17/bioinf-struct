var imgs =[];
imgs.push(("C:\\Users\\Me\\Documents\\bio_struct\\times-master (1)\\times-master\\img1.tif"));
imgs.push(("C:\\Users\\Me\\Documents\\bio_struct\\times-master (1)\\times-master\\img2.tif"));
imgs.push(("C:\\Users\\Me\\Documents\\bio_struct\\times-master (1)\\times-master\\img3.tif"));
imgs.push(("C:\\Users\\Me\\Documents\\bio_struct\\times-master (1)\\times-master\\img4.tif"));
imgs.push(("C:\\Users\\Me\\Documents\\bio_struct\\times-master (1)\\times-master\\img5.tif"));

//WARMUP
for(var i = 0; i<100; i++){
    var temp = IJ.open(imgs[0]);
    IJ.run("Threshold...");
    IJ.run("Close All", "");
  }
IJ.log("benchmark");
//
// //BENCHMARK
var resBench=[];
for (j=0; j<imgs.length; j++){  //pour chaque img
  IJ.log(j);
  var time = 0.0;
  for(var i = 0; i < 1000; i++){
    var temp = IJ.open(imgs[j]);
    var startTime = System.currentTimeMillis();//nanoTime();
    IJ.run("Threshold...");
    var endTime = System.currentTimeMillis();
    IJ.run("Close All", "");
    time += (endTime - startTime);
  }

  resBench[j] = time/1000;
  IJ.log(resBench[j]);

}
IJ.log(resBench);
