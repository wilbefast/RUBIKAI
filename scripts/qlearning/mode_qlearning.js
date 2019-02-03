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

    // learn to walk
    babysitter.add(qlearning.play, {
      game : frozenlake,
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

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_qlearning;
}();
