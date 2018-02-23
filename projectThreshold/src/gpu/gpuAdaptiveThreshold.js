/**
 * <Description>
 *
 * @param {number} kernelsize - Convolution filer size
 * @author Rémy Viannais
 */

const gpuAdaptiveThreshold = (Threshold) => (raster, graphContext, copy_mode = true) =>
{

  let id='adaptiveThreshold';

  let src_vs = `#version 300 es

  in vec2 a_vertex;
  in vec2 a_texCoord;

  uniform vec2 u_resolution;

  out vec2 v_texCoord;

  void main() {
    v_texCoord = a_texCoord;
    vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
    gl_Position = vec4( clipSpace * vec2(1,-1), 0.0, 1.0);
  }`;

  let samplerType = (raster.type === 'uint16') ? 'usampler2D' : 'sampler2D';

  let textureColor;
  switch (raster.type) {
    case 'uint8':textureColor = `texture(u_image,v_texCoord)`;break;
    case 'rgba' :textureColor = `texture(u_image,v_texCoord)`;break;
    case 'uint16':textureColor = `float(texture(u_image,v_texCoord))/maxUint16`; break;
    case 'float32':textureColor = `float(texture(u_image,v_texCoord))`;break;
  }

  const getFragmentSource = (samplerType,textureColor) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;

    in vec2 v_texCoord;
    uniform float threshold;
    const vec3 W = vec3(0.299,0.587,0.114);
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    out vec4 outColor;

    void main() {
      vec4 textureColor = vec4(${textureColor});
      float luminance = dot(textureColor.rgb, W);
      outColor = (luminance > threshold) ? vec4(1.0,1.0,1.0,1) : vec4(0.0,0.0,0.0,1.0);
    }`;
  }


  // Step #1: Create - compile + link - shader program
  // Set up fragment shader source depending of raster type (uint8, uint16, float32,rgba)


  let the_shader = gpu.createProgram(graphContext,src_vs,getFragmentSource(samplerType,textureColor));

  console.log('programs done...');

  // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
  let gproc = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster,0)
    .packWith(the_shader) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('threshold',Threshold)
    .run();

  return raster;
}
