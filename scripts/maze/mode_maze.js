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
// MAZE GENERATION DEMO
// ----------------------------------------------------------------------------

var mode_maze = function() {
  var mode_maze = {
  }

  mode_maze.init = function() {
        
    // clean up
    mutex.force_release();    
    objects.clear();
    delete cy.chart;    

    // hide cytoscape
    cy.style.display = "none";

    // set tile types
    Tile.prototype.tile_types = {
      wall : {
        name : "wall",
        is_pathable : false,
        colour : "#003f34"
      },
      free : {
        name : "free",
        colour : "white"      
      },
      open : {
        name : "open",
        colour : "lime"    
      },
      closed : {
        name : "closed",
        colour : "yellow"    
      }
    }   

    // set random seed, for easier debugging
    Math.seedrandom("Links rechts gradeaus, do bist I'm Labyrinth");

    // create a nice big grid
    grid = new Grid({
      n_cols : 40,
      n_rows : 40,
      tile_class : Tile,
      tile_draw_w : 16,
      tile_draw_h : 16
    });

    // create a maze
    babysitter.add(maze.generate, {
      manual_step : true,
      // verbose : true,
      // verbose_skip : 1
    });
  }

  mode_maze.left_click = function(tile) {
    // restart maze from clicked tile
    babysitter.add(maze.generate, {
      start_tile : tile,
      verbose : true,
      verbose_skip : 1
    });
  }

  mode_maze.right_click = function(tile) {
    // right click is not bound to anything
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_maze;
}();
