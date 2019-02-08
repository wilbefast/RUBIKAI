/*
(C) Copyright 2019 William Dyce

All rights reserved. This program and the accompanying materials
are made available under the terms of the GNU Lesser General Public License
(LGPL) version 2.1 which accompanies this distribution, and is available at
http://www.gnu.org/licenses/lgpl-2.1.html

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Lesser General Public License for more details.
*/

"use strict";

// ----------------------------------------------------------------------------
// ZOMBIE RUN GAME
// ----------------------------------------------------------------------------

var zombierun = function() {

  var zombierun = {
  }

  // ------------------------------------------------------------------------------------------
  // PRIVATE CONSTANTS
  // ------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------
  // PRIVATE VARIABLES
  // ------------------------------------------------------------------------------------------

  var draw_x = 0;
  var draw_y = 0;
  var draw_w = 512;
  var draw_h = 512;

  var human_x = 0.5;
  var human_y = 0.5;
  var human_dx = 0;
  var human_dy = 0;
  var human_acceleration = 0.01;
  var human_maxspeed = 0.3;
  var human_friction = 1.01;

  var human_ctrl_x = 0;
  var human_ctrl_y = 0;

  var zombie_x = 0;
  var zombie_y = 0;
  var zombie_dx = 0;
  var zombie_dy = 0;
  var zombie_acceleration = 0.01;
  var zombie_maxspeed = 0.3;
  var zombie_friction = 1.01;  
 
  // ------------------------------------------------------------------------------------------
  // PRIVATE FUNCTIONS
  // ------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------
  // PUBLIC FUNCTION
  // ------------------------------------------------------------------------------------------
  
  zombierun.init = function(args) {
    // unpack args
    draw_x = (ctx.canvas.width - draw_w)*0.5 + (args.off_x || 0);
    draw_y = (ctx.canvas.height - draw_h)*0.5 + (args.off_y || 0);
    if(args.draw_w) {
      draw_w = args.draw_w;
    }
    if(args.draw_h) {
      draw_h = args.draw_h;
    }  

    // reset
    zombierun.reset();
  }

  zombierun.reset = function() {
    // reset speed and position of zombie and human
    human_dx = human_dy = zombie_dx = zombie_dy = 0;
    human_x = human_y = 0.5;
    var zombie_angle = Math.random()*Math.PI;
    zombie_x = 0.5 * (1 + Math.cos(zombie_angle));
    zombie_y = 0.5 * (1 + Math.sin(zombie_angle));

    // reset control input
    human_ctrl_x = human_ctrl_y = 0;
  }

  zombierun.control = function(x, y) {
    human_ctrl_x = x;
    human_ctrl_y = y;
  }

  zombierun.update = function() {
    // update human physics
    human_x += human_dx;
    human_y += human_dy;
    if(human_x > 1) {
      human_x = 1;
      human_dx *= -0.5;
    }
    if(human_y > 1) {
      human_y = 1;
      human_dy *= -0.5;
    }
    if(human_x < 0) {
      human_x = 0;
      human_dx *= -0.5;
    }
    if(human_y < 0) {
      human_y = 0;
      human_dy *= -0.5;
    }
    human_dx /= human_friction;
    human_dy /= human_friction;
    var human_vector = vector.normalise(human_dx, human_dy);
    if(human_vector.originalLength > human_maxspeed) {
      var brakes = human_maxspeed / human_vector.originalLength;
      human_dx *= brakes;
      human_dy *= brakes;
    }

    // make human move based on input
    human_x += human_ctrl_x*human_acceleration;
    human_y += human_ctrl_y*human_acceleration;

    // update zombie physics
    zombie_x += zombie_dx;
    zombie_y += zombie_dy;
    if(zombie_x > 1) {
      zombie_x = 1;
      zombie_dx *= -0.5;
    }
    if(zombie_y > 1) {
      zombie_y = 1;
      zombie_dy *= -0.5;
    }
    if(zombie_x < 0) {
      zombie_x = 0;
      zombie_dx *= -0.5;
    }
    if(zombie_y < 0) {
      zombie_y = 0;
      zombie_dy *= -0.5;
    }
    zombie_dx /= zombie_friction;
    zombie_dy /= zombie_friction;
    var zombie_vector = vector.normalise(zombie_dx, zombie_dy);
    if(zombie_vector.originalLength > zombie_maxspeed) {
      var brakes = zombie_maxspeed / zombie_vector.originalLength;
      zombie_dx *= brakes;
      zombie_dy *= brakes;
    }

    // make zombie chase human
    var chase = vector.normalise(human_x - zombie_x, human_y - zombie_y);
    if(chase.originalLength < zombie_acceleration) {
      // nom nom nom nom nom
      zombierun.reset();
    }
    else {
      zombie_x += chase.x*zombie_acceleration;
      zombie_y += chase.y*zombie_acceleration;
    }
  }

  zombierun.draw = function() {
    // draw background
    ctx.fillStyle = "white";            
    ctx.fillRect(draw_x, draw_y, draw_w, draw_h);

    // draw human
    ctx.fillStyle = "orange";            
    ctx.fillRect(draw_x + human_x*draw_w - 8, draw_y + human_y*draw_h - 8, 16, 16);

    // draw zombie
    ctx.fillStyle = "green";            
    ctx.fillRect(draw_x + zombie_x*draw_w - 8, draw_y + zombie_y*draw_h - 8, 16, 16);
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return zombierun;
}();