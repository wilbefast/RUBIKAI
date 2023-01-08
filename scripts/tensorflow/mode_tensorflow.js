/*
(C) Copyright 2023 William Dyce

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
// TENSORFLOW DEMO
// ----------------------------------------------------------------------------

var mode_tensorflow = function() {
  var mode_tensorflow = {
  }

  mode_tensorflow.init = function() {

    // clean up
    mutex.force_release();    
    objects.clear();
    delete cy.chart;    

    // hide cytoscape
    cy.style.display = "none";

    // set tile types
    Tile.prototype.tile_types = {
      free : {
        name : "free",
        colour : "white"      
      },
      red_player : {
        name : "red_player",
        colour : "red"    
      },
      blue_player : {
        name : "blue_player",
        colour : "blue"      
      },
      green_player : {
        name : "green_player",
        colour : "green"    
      },
    }

    // set random seed, for easier debugging
    Math.seedrandom('These tents are low.');

    // create a nice big grid
    grid = new Grid({
      n_cols : 3,
      n_rows : 3,
      tile_class : Tile,
      tile_draw_w : 128,
      tile_draw_h : 128
    });

    // play some reversi
    babysitter.add(tensorflow.play, {
      verbose : true,
      red_player : "mechanical_turk",
      blue_player : "random"
    });
  }

  mode_tensorflow.left_click = function(tile) {
    // place piece
    babysitter.add(tensorflow.place_piece, tile);
  }

  mode_tensorflow.right_click = function(tile) {
    // right click is not bound to anything
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_tensorflow;
}();
