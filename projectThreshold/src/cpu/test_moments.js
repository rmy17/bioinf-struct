/*
 * Compute Threshold with CPU
 * 
 * @author Jean-Christophe Taveau
 */
 
/*

  /////////////////////////////////////
  //
  // Moments
  //
  /////////////////////////////////////
  
   
  /*
   Test 2 Boats
  */
 
  
  let img2 = new T.Image('uint8',360,288);
  img2.setPixels(new Uint8Array(boats_pixels));
  let raster2 = img2.getRaster();
  
  let binary = _thresholdMoment(raster2);
  console.log();
  console.log(binary.statistics.histogram[255]);
  
  t0 = performance.now();
  let workflow2 = cpu.pipe(_thresholdMoment, cpu.view);
  t1 = performance.now();
  let view2 = workflow2(raster2);
  
  let win2 = new T.Window('Moment - Boats');
  // Create the window content from the view
  win2.addView(view2);
  // Add the window to the DOM and display it
  win2.addToDOM('workspace');
  

  

  
  