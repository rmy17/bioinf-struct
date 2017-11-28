/**
* Test
*/

let histo = Array(255).fill(0);
for (let x=0; x<boats_pixels.length;x++) histo[boats_pixels[x]] += 1;
let thresh = kmeans(histo, 6);
console.log("thresh", thresh);
let arr = threshold(boats_pixels, thresh);
console.log(arr);

let img1 = new T.Image('boats','uint8',360,288);
img1.setPixels(boats_pixels);
let win1 = new T.Window('boats',360,288);
let view1 = T.view()(img1.getRaster());
view1.render(win1);
document.getElementById('workspace').appendChild(win1.HTMLelement);

let img0 = new T.Image('boats','uint8',360,288);
img0.setPixels(arr);
let win0 = new T.Window('boats',360,288);
T.renderUint8(win0)(img0.getRaster());
document.getElementById('workspace').appendChild(win0.HTMLelement);
