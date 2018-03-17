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

"use strict";

// ----------------------------------------------------------------------------
// MAIN LOOP FOR MAZE GENERATION AND A* DEMO
// ----------------------------------------------------------------------------

var mode_astar = function() {
  var mode_astar = {
  }

  mode_astar.init = function() {

    // set random seed, for easier debugging
    Math.seedrandom('To be or not to be, that is the question.');

    // create a nice big grid
    grid = new Grid({
      n_cols : 80,
      n_rows : 40,
      tile_class : Tile
    });

    // create a maze
    babysitter.add(ai.generate_maze);

    // spawn the player
    babysitter.add(ai.spawn_player);
  }

  mode_astar.left_click = function(tile) {
    // calculate path for player
    if(!ai.is_busy() && tile.is_type("free")) {
      babysitter.add(ai.move_to, tile);
    }
  }

  mode_astar.right_click = function(tile) {
    // right click is not bound to anything
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_astar;
}();
