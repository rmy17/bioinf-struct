/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Julien Benetti
 */

'use script';

/**
 * kmeans
 *
 * @author Julien Benetti
 */


const kmeans = (raster,graphContext, copy_mode = true) => {
  let id='kmeans';

  let c1_vs = `#version 300 es

  in vec2 a_vertex;
  in vec2 a_texCoord;

  uniform vec2 u_resolution;

  out vec2 v_texCoord;

  void main() {
    v_texCoord = a_texCoord;
    vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
    gl_Position = vec4( clipSpace * vec2(1,-1), 0.0, 1.0);
  }`;

  let c1_fs = `#version 300 es
  precision mediump float;

  in vec2 v_texCoord;
  uniform sampler2D u_image;
  uniform float centroids;
  out vec4 outColor;

  void main() {
    outColor = (texture(u_image, v_texCoord));
  }`;



  // Step #1: Create - compile + link - shader program
  let c1_shader = gpu.createProgram(graphContext,c1_vs,c1_fs);

  console.log('programs done...');

  // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
  let gproc = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster,0)
    .packWith(c1_shader) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('centroids', new Float32Array([50, 150]))
    .uniform('u_image',0)
    .run();

  return raster;
}

// Create an Image containing boats (from ImageJ))
let img = new T.Image('uint8',360,288);
img.setPixels(new Uint8Array(boats_pixels));

let histoRaster = cpu.histogram(256)(img.getRaster());
let histo = histoRaster.statistics.histogram;

let histoImg = new T.Image('uint8', 16,16);
histoImg.setPixels(new Uint8Array(histo));

console.log('logi',histoImg);
// Get a graphics context from canvas
let gpuEnv = gpu.getGraphicsContext();
// Run invert
kmeans(histoImg.getRaster(),gpuEnv);




// essayer une boucle for pour les shaders avec `+i+`
// recopier peter raster 8 bits, 16bits : maxbin = 256 ou 65556
