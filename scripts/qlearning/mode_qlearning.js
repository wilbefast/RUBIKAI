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
// BOARD GAME AND MINIMAX DEMO
// ----------------------------------------------------------------------------

var mode_qlearning = function() {

  var _agent_tile;
  var _agent_draw_x;
  var _agent_draw_y;

  var mode_qlearning = {
  }

  mode_qlearning.init = function() {

    // clean up
    mutex.force_release();    
    objects.clear();

    // set tile types
    Tile.prototype.tile_types = {
      free : {
        name : "free",
        colour : "white"      
      },
      hole : {
        name : "hole",
        colour : "cyan"
      },
      start : {
        name : "start",
        colour : "yellow"
      },
      goal : {
        name : "goal",
        colour : "lime"
      }
    }

    // set random seed, for easier debugging
    Math.seedrandom('They would be able to converse with each other to sharpen their wits.');

    // create a small grid for the 'frozen lake'
    grid = new Grid({
      n_cols : 4,
      n_rows : 4,
      tile_class : Tile,
      tile_draw_w : 128,
      tile_draw_h : 128
    });
    _agent_tile = grid.grid_to_tile(0, 0);
    _agent_tile.set_type("start");
    _agent_draw_x = _agent_tile.draw_x + _agent_tile.draw_w*0.5;
    _agent_draw_y = _agent_tile.draw_y + _agent_tile.draw_h*0.5;
    grid.grid_to_tile(1, 1).set_type("hole");
    grid.grid_to_tile(3, 1).set_type("hole");
    grid.grid_to_tile(3, 2).set_type("hole");
    grid.grid_to_tile(0, 3).set_type("hole");
    grid.grid_to_tile(3, 3).set_type("goal");

    // learn to find your way
    /*
    babysitter.add(qlearning.learn, {
      verbose : true
    });
    */
  }

  mode_qlearning.left_click = function(tile) {
    // left click is not bound to anything
  }

  mode_qlearning.right_click = function(tile) {
    // right click is not bound to anything
  }

  mode_qlearning.draw = function() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(_agent_draw_x, _agent_draw_y, 32, 0, 2*Math.PI);
    ctx.fill();
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_qlearning;
}();
