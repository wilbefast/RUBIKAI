/*
(C) Copyright 2018 William Dyce

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

var mode_minimax = function() {
  var mode_minimax = {
  }

  mode_minimax.init = function() {

    // set random seed, for easier debugging
    Math.seedrandom('Once more into the breach dear friends.');

    // create a nice big grid
    grid = new Grid({
      n_cols : 8,
      n_rows : 8,
      tile_class : Tile,
      tile_draw_w : 70,
      tile_draw_h : 70
    });

    // play some reversi
    babysitter.add(minimax.play, {
      verbose : true,
      matches : 10,
      red_player : "minimax",
      blue_player : "minimax_ab"
    });
  }

  mode_minimax.left_click = function(tile) {
    // place piece
    babysitter.add(minimax.place_piece, tile);
  }

  mode_minimax.right_click = function(tile) {
    // right click is not bound to anything
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_minimax;
}();
