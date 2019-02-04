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

  var mode_qlearning = {
  }

  var _q_debug_grid;

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

    // create grid for rendering the agent's "brain"
    _q_debug_grid = new Grid({
      n_cols : 4,
      n_rows : 4,
      tile_class : QTile,
      tile_draw_w : 128,
      tile_draw_h : 128,
      off_x : -ctx.canvas.width*0.25
    });

    var _qlog = function(state, action, value) {
      var row = Math.floor(state / _q_debug_grid.n_cols);
      var col = state % _q_debug_grid.n_cols;
      var tile = _q_debug_grid.grid_to_tile(col, row);
      tile.set_action_value(action, value);
    }

    // learn to walk
    babysitter.add(qlearning.play, {
      game : frozenlake,
      verbose : true,
      episodes_per_sample : 50,
      qlog : _qlog,
      learning_ratio : 0.8,
      discount_factor : 0.95,
      n_episodes : 2000
    });
  }

  mode_qlearning.left_click = function(tile) {
    // left click is not bound to anything
  }

  mode_qlearning.right_click = function(tile) {
    // right click is not bound to anything
  }

  mode_qlearning.draw = function() {
    _q_debug_grid.draw();
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_qlearning;
}();
