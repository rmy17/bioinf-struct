function threshold(data, threshold){
  if (Array.isArray(threshold)) {
    let newData = data.map(a => threshold[1][0]);
    for(let y=0; y < threshold[0].length; y++){
      for (let x=0; x<data.length;x++) (data[x] > threshold[0][y]) && (newData[x] = threshold[1][y+1])
    }
    return newData;
  }
  else {
  return data.map(a => (a>threshold) ? 255 : 0);
  }
}
