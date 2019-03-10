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
// GENETIC ALGORITHM FOR "ZOMBIE RUN" GAME
// ----------------------------------------------------------------------------

var mode_genetic = function() {

  var mode_genetic = {
  }

  mode_genetic.init = function() {

    // clean up
    mutex.force_release();    
    objects.clear();

    // set random seed, for easier debugging
    Math.seedrandom('So if the infection wipes us all out- that is a return to normality.');

    // TODO: the grid is not currently used
    const size = 5;
    grid = new Grid({
      n_cols : size,
      n_rows : size,
      tile_class : WeightTile,
      tile_draw_w : 512 / size,
      tile_draw_h : 512 / size,
      off_x : -ctx.canvas.width*0.25
    });

    // learn to run
    zombierun.init({
      off_x : ctx.canvas.width*0.25,
      draw_w : grid.draw_w,
      draw_h : grid.draw_h
    });
    babysitter.add(genetic.play, {
      game : zombierun,
      size : size,
    });
  }

  mode_genetic.left_click = function(tile) {
    // left click is not bound to anything
  }

  mode_genetic.right_click = function(tile) {
    // right click is not bound to anything
  }

  mode_genetic.draw = function() {
    zombierun.draw();
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_genetic;
}();
