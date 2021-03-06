/*
(C) Copyright 2017 William Dyce

All rights reserved. This program and the accompanying materials
are made available under the terms of the GNU Lesser General Public License
(LGPL) version 2.1 which accompanies this distribution, and is available at
http://www.gnu.org/licenses/lgpl-2.1.html

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Lesser General Public License for more details.
*/

// ----------------------------------------------------------------------------
// SCRIPTING ENTRANCE POINT
// ----------------------------------------------------------------------------

"use strict";

// global variables: we'd want to do this more cleanly if this were a 'real' project
var ctx;
var cy; 
var grid;
var mode;

var set_mode = function() {
  console.warn("Not ready to set mode yet");
}

var main = function() {

  // ----------------------------------------------------------------------------
  // GET CONTEXT
  // ----------------------------------------------------------------------------

  ctx = document.getElementById("source_canvas").getContext("2d");
  ctx.off_x = 0;
  ctx.off_y = 0;

  var dest_ctx = document.getElementById("destination_canvas").getContext("2d");
  dest_ctx.off_x = 0;
  dest_ctx.off_y = 0;

  // ----------------------------------------------------------------------------
  // GET CYTOSCAPE
  // ----------------------------------------------------------------------------

  cy = document.getElementById("cytoscape");

  // ----------------------------------------------------------------------------
  // MODE
  // ----------------------------------------------------------------------------

  set_mode = function(mode_name) {
    mode = window[mode_name];
    if(mode) {
      mode.init();
      localStorage.setItem("last_mode", mode_name);
    }
    else {
      console.warn("Invalid mode name", mode_name);
    }
  }

  set_mode(localStorage.getItem("last_mode") || "mode_maze");

  // ----------------------------------------------------------------------------
  // LINK UP MOUSE INPUT
  // ----------------------------------------------------------------------------

  dest_ctx.canvas.addEventListener('mousemove', function(event) {
    var rect = ctx.canvas.getBoundingClientRect();
    cursor.move_to(
      (event.clientX - rect.left - dest_ctx.off_x)/dest_ctx.global_scale - ctx.off_x, 
      (event.clientY - rect.top - dest_ctx.off_y)/dest_ctx.global_scale - ctx.off_y);      
  }, false);

  dest_ctx.canvas.addEventListener('click', function(event) {
    if(event.button == 0)
      cursor.left_click();
  }, false);

  dest_ctx.canvas.addEventListener('contextmenu', function(event) {
    cursor.right_click();
    event.preventDefault();
  }, false);

  window.addEventListener('keydown', function(event) {
    var up, down, left, right;
    switch(event.keyCode || event.which) {
      case 13: keyboard.enter(true); break;
      case 32: keyboard.space(true); break;
      case 37: keyboard.left(true); break;
      case 38: keyboard.up(true); break;
      case 39: keyboard.right(true); break;
      case 40: keyboard.down(true); break;
      default: break;      
    }
  });

  window.addEventListener('keyup', function(event) {
    var up, down, left, right;
    switch(event.keyCode || event.which) {
      case 13: keyboard.enter(true); break;
      case 32: keyboard.space(false); break;
      case 37: keyboard.left(false); break;
      case 38: keyboard.up(false); break;
      case 39: keyboard.right(false); break;
      case 40: keyboard.down(false); break;
      default: break;
    }
  });

  var _on_resize = function(event) {
    var can = ctx.canvas;
    var dest_can = dest_ctx.canvas
    dest_can.width = window.innerWidth;
    dest_can.height = window.innerHeight;

    dest_ctx.global_scale = Math.min(dest_can.width / can.width, dest_can.height / can.height);
    dest_ctx.off_x = (dest_can.width - can.width*dest_ctx.global_scale)*0.5;
    dest_ctx.off_y = (dest_can.height - can.height*dest_ctx.global_scale)*0.5;

    if(cy.layout) {
      cy.layout.run();
    }
  };
  window.addEventListener('resize', _on_resize);
  _on_resize(); 

  // ----------------------------------------------------------------------------
  // START REQUESTING ANIMATION FRAME
  // ----------------------------------------------------------------------------

  function update(dt) {
    babysitter.update(dt);
    keyboard.update(dt);
  }

  function draw() {
    // render the game to the source canvas
    var can = ctx.canvas
    ctx.clearRect(0, 0, can.width, can.height);

    ctx.save();
      ctx.translate(ctx.off_x + 0.5, ctx.off_y + 0.5); // the 0.5 prevents blurred lines
      if(grid) {
        grid.draw();
      }
      objects.draw();
      if(mode.draw) {
        mode.draw();
      }
      cursor.draw();
    ctx.restore();

    // scale and copy to the destination canvas
    var dest_can = dest_ctx.canvas
    dest_ctx.clearRect(0, 0, dest_can.width, dest_can.height);   
    dest_ctx.save();
      dest_ctx.translate(dest_ctx.off_x, dest_ctx.off_y);
      dest_ctx.scale(dest_ctx.global_scale, dest_ctx.global_scale);   
      dest_ctx.drawImage(can, 0, 0);
    dest_ctx.restore();
  }

  var lastFrameTime = Date.now();
  function nextFrame() {
    var thisFrameTime = Date.now();
    var deltaTime = thisFrameTime - lastFrameTime;
    lastFrameTime = thisFrameTime;
    update(deltaTime / 1000);
    draw();
    requestAnimationFrame(nextFrame);
  }
  nextFrame();    
}