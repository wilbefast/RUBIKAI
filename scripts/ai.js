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

// ----------------------------------------------------------------------------
// COROUTINE MANAGER
// ----------------------------------------------------------------------------

"use strict";

var ai = function() {
  var ai = {
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  ai.generate_maze = function*(grid) {

    // set all tiles to "wall"
    yield * grid.map_coroutine(function*(tile) {
      tile.set_type("wall");
      //yield * babysitter.waitForNextFrame();         
    });

    // pick random starting tile
    var start_tile = grid.get_random_tile();
    
    // snake out from starting tile
    var open = [ start_tile ];
    start_tile.set_type("open");
    while(open.length > 0) {
      // get the next open tile, make sure it's actually open
      var tile = open.shift();
      if(tile.is_type("open")) {

        // remove the wall from this tile
        tile.set_type("free");

        // remove all the adjacent tile from the open list
        tile.map_neighbours("8", function(n) {
          if(n.is_type("open")) {
            n.set_type("wall");
          };
        });

        // recurse from this tile
        tile.map_neighbours("4", function(neighbour) {
          // only open tiles which do not already have adjacent opened tiles
          if(neighbour.all_neighbours("4", function(n) {
            return n.hash === tile.hash || n.is_type("wall");
          })) {
            neighbour.set_type("open");
            open.push(neighbour);
          }
        });
  
        yield * babysitter.waitForNextFrame();     
      };
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return ai;
}();