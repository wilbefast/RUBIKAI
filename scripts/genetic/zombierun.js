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

  const human_max_stamina = 100;

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
  var human_acceleration = 0.0012;
  var human_maxspeed = 0.08;
  var human_friction = 1.05;
  var human_bounce = 0.9;
  var human_stamina = human_max_stamina;

  var human_ctrl_x = 0;
  var human_ctrl_y = 0;

  var zombie_x = 0;
  var zombie_y = 0;
  var zombie_dx = 0;
  var zombie_dy = 0;
  var zombie_base_acceleration = 0.001;
  var zombie_acceleration = zombie_base_acceleration;
  var zombie_acceleration_increase = 0.000001;
  var zombie_maxspeed = 0.1;
  var zombie_friction = 1.02;  
  var zombie_grab_distance = 0.03;
  var zombie_bounce = 0.07;
  var zombie_heartbeat = 0;
 
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
    human_ctrl_x = human_ctrl_y = 0;
    human_x = human_y = 0.5;
    human_stamina = human_max_stamina;
    var zombie_angle = Math.random()*Math.PI;
    zombie_x = 0.5 * (1 + Math.cos(zombie_angle));
    zombie_y = 0.5 * (1 + Math.sin(zombie_angle));
    zombie_heartbeat = Math.random();
    zombie_acceleration = zombie_base_acceleration;

    // reset control input
    human_ctrl_x = human_ctrl_y = 0;
  }

  zombierun.control = function(x, y) {
    var control_vector = vector.normalise(x, y);
    var l = control_vector.originalLength; 
    if(l > 0) {
      human_ctrl_x = x / l;
      human_ctrl_y = y / l;
    }
    else {
      human_ctrl_x = human_ctrl_y = 0;
    }
  }

  zombierun.update = function() {
    // update human physics
    human_x += human_dx;
    human_y += human_dy;
    if(human_x > 1) {
      human_x = 1;
      human_dx *= -human_bounce;
    }
    if(human_y > 1) {
      human_y = 1;
      human_dy *= -human_bounce;
    }
    if(human_x < 0) {
      human_x = 0;
      human_dx *= -human_bounce;
    }
    if(human_y < 0) {
      human_y = 0;
      human_dy *= -human_bounce;
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
    var control_l = vector.len(human_ctrl_x, human_ctrl_y);
    useful.assert(control_l <= 1.01 && control_l >= 0, "Input should be normalised");
    var acceleration = human_stamina/human_max_stamina*human_acceleration;
    human_dx += human_ctrl_x*acceleration;
    human_dy += human_ctrl_y*acceleration;

    // consume human stamina based on input
    human_stamina += 0.5 - control_l;
    human_stamina = useful.clamp(human_stamina, 0, human_max_stamina);

    // update zombie physics
    zombie_heartbeat += Math.random()*0.2;
    if(zombie_heartbeat > 1) {
      zombie_heartbeat -= 1;
    }
    zombie_x += zombie_dx;
    zombie_y += zombie_dy;
    if(zombie_x > 1) {
      zombie_x = 1;
      zombie_dx *= -zombie_bounce;
    }
    if(zombie_y > 1) {
      zombie_y = 1;
      zombie_dy *= -zombie_bounce;
    }
    if(zombie_x < 0) {
      zombie_x = 0;
      zombie_dx *= -zombie_bounce;
    }
    if(zombie_y < 0) {
      zombie_y = 0;
      zombie_dy *= -zombie_bounce;
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
    var was_human_killed = false;
    var chase = vector.normalise(human_x - zombie_x, human_y - zombie_y);
    if(chase.originalLength < zombie_grab_distance) {
      // nom nom nom nom nom
      was_human_killed = true;
      zombierun.reset();
    }
    else {
      var a = (0.5 + 0.25 * (1 + Math.cos(zombie_heartbeat * Math.PI * 2))) * zombie_acceleration;
      zombie_dx += chase.x*a;
      zombie_dy += chase.y*a;
    }

    // the zombie gets harder very gradually
    zombie_acceleration += zombie_acceleration_increase;

    // was the human killed?
    return was_human_killed;
  }

  zombierun.draw = function() {
    // draw background
    ctx.fillStyle = "white";            
    ctx.fillRect(draw_x, draw_y, draw_w, draw_h);

    // draw human
    ctx.fillStyle = "rgb(" + 255*human_stamina/human_max_stamina + ", 0, 100)";            
    ctx.fillRect(draw_x + human_x*draw_w - 8, draw_y + human_y*draw_h - 8, 16, 16);

    // draw zombie
    ctx.fillStyle = "green";            
    ctx.fillRect(draw_x + zombie_x*draw_w - 8, draw_y + zombie_y*draw_h - 8, 16, 16);
  }

  zombierun.copy_state_to = function(array) {
    useful.assert(array, "An array must be provided as input");
    array[0] = 2*human_x - 1;
    array[1] = 2*human_y - 1;
    array[2] = human_dx;
    array[3] = human_dy;
    array[4] = 2*zombie_x - 1;
    array[5] = 2*zombie_y - 1;
    array[6] = zombie_dx;
    array[7] = zombie_dy;
    array[8] = 2*human_stamina/human_max_stamina - 1;
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return zombierun;
}();