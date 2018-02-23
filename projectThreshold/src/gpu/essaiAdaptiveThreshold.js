let essai = [4,1,2,2,
             0,4,1,3,
             3,1,0,4,
             2,1,3,2];
let img = new T.Image('uint8',4,4);
img.setPixels(new Uint8Array(essai));

// Get a graphics context from canvas
let gpuEnv = gpu.getGraphicsContext();

const adaptiveThreshold = (Threshold, kernelsize) => (raster, graphContext, copy_mode = true) =>{

  let src_vs = `#version 300 es

    in vec2 a_vertex;
    in vec2 a_texCoord;

    uniform vec2 u_resolution;

    out vec2 v_texCoord;

    void main() {
      v_texCoord = a_texCoord;
      vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1,-1), 0.0, 1.0);
    }
  `;


  // Fragment Shader
  let src_fs_intImgH = `#version 300 es

      precision mediump float;

      in vec2 v_texCoord;
      uniform sampler2D u_image;
      uniform sampler2D intImg;

      void main(){
        vec4 pixelColor = texture(u_image,v_texCoord);
        vec4 prec = texture(u_image,v_texCoord.x-vec2(1.0));
        intImg = pixelColor + prec;
      }`;

  let shader_intImgH = gpu.createProgram(graphContext,src_vs,src_fs_intImgH);

  	var startTime1,endTime1,time1;

   	startTime1 = Date.now();

     let gproc_IntImgH = gpu.createGPU(graphContext,raster.width,raster.height)
    	.redirectTo('fbo01','float32',0)
      .size(raster.width,raster.height)
      .geometry(gpu.rectangle(raster.width,raster.height))
      .texture(raster)
      .packWith(shader_intImgH) // VAO
      .clearCanvas([0.0,1.0,1.0,1.0])
      .preprocess()
      .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
      .uniform('u_image', 0)
      .uniform('intImg',1)
      .run();

console.log("cul1",intImg);

let src_fs_intImgV = `#version 300 es
    precision mediump float;

    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform sampler2D intImg;

    out vec4 outColor;

    void main(){
      vec4 pixelColor = texture(u_image,v_texCoord);
      vec4 prec = texture(u_image, v_texCoord.y-1);
      intImg = pixelColor + prec;
    }`;

let shader_intImgV = gpu.createProgram(graphContext,src_vs,src_fs_intImgV)

  var startTime2,endTime2,time2;

  startTime2 = Date.now();

let gproc_IntImgV = gpu.createGPU(graphContext,raster.width,raster.height)
  .size(raster.width,raster.height)
  .redirectTo('fbo1','float32',0)
  .geometry(gpu.rectangle(raster.width,raster.height))
  .texture(gproc_IntImgH.framebuffers['fbo01'])
  .redirectTo('fbo02','float32',0)
  .packWith(shader_intImgV)
  .clearCanvas([0.0,1.0,1.0,1.0])
  .preprocess()
  .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
  .uniform('u_image', 0)
  .uniform('intImg',2)
  .run();

let src_fs_adaptiveThr = `#version 300 es
    in vec2 v_texCoord;
    uniform sample2D u_image;
    uniform sampler2D intImg;

    out vec4 outColor;

    void main(){
      vec4 sum = vec4(0.0);

      vec4 count = vec4(texture(intImg,v_texCoord.x+s)-texture(intImg,v_texCoord-s))*(texture(intImg,v_texCoord.y+s)-texture(intImg,v_texCoord.y-s));
      sum = vec4(texture(intImg,vec2(v_texCoord.x+s,v_texCoord.y+s))) - (texture(intImg,vec2(v_texCoord.x+s,v_texCoord.y-s))) - (texture(intImg,vec2(v_texCoord.x-s,v_texCoord.y+s))) + (texture(intImg,vec2(v_texCoord.x-s,v_texCoord.y-s))));
      outColor = vec4(texture(u_image,v_texCoord).rgba)*count;
      outColor = (outColor.r < sum*((100-t)/100)) ? vec4(1.0,1.0,1.0,1) : vec4(0.0,0.0,0.0,1.0);

    }`;

let shader_adaptiveThr = gpu.createProgram(graphContext,src_vs,src_fs_adaptiveThr);


let gproc_hysteresis = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .texture(gproc_IntImgV.framebuffers['fbo02'])
    .packWith(shader_adaptiveThr) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('intImg',2)
    .uniform('s',kernelsize)
    .uniform('t',Threshold)
    .run();


    return raster;
}

adaptiveThreshold(10,40)(img.getRaster(),gpuEnv);
