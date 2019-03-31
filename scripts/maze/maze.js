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

// ----------------------------------------------------------------------------
// MAZE GENERATION
// ----------------------------------------------------------------------------

"use strict";

var maze = function() {
  
  var maze = {
  }

  // ------------------------------------------------------------------------------------------
  // MAZE
  // ------------------------------------------------------------------------------------------
  
  maze.generate = function*(args) {
    // lock mutex
    yield * mutex.claim();

    // count frames
    var frame_count = 0;

    // set all tiles to "wall"
    yield * grid.map_coroutine(function*(tile) {
      tile.set_type("wall");      
    });

    // pick random starting tile
    var start_tile = args.start_tile || grid.get_random_tile(function(t) {
      return !t.is_edge();
    });
    
    // snake out from starting tile
    var open = [ start_tile ];
    start_tile.set_type("open");
    while(open.length > 0) {
      // get the next open tile, make sure it's actually open
      var tile = open.shift();
      if(tile.is_type("open")) {

        // remove the wall from this tile
        tile.set_type("free");

        // remove all the adjacent tiles from the open list
        tile.map_neighbours("8", function(n) {
          if(n.is_type("open")) {
            n.set_type("wall");
          };
        });

        // recurse from this tile
        tile.map_neighbours("4", function(neighbour) {
          // only open non-edge tiles which do not already have adjacent opened tiles
          if(!neighbour.is_edge() 
          && neighbour.all_neighbours("4", function(n) {
            return n === tile || n.is_type("wall");
          }) 
          && neighbour.all_neighbours("X", function(n) {
            return n.is_neighbour_of("4", tile) || n.is_type("wall");
          })) {
            neighbour.set_type("open");
            open.push(neighbour);
          }
        });
  
        // skip show maze creation progress every few frames if in verbose mode 
        frame_count++;
        if(args.verbose && !(frame_count%((args.verbose_skip || 0) + 1))) {
          yield * babysitter.waitForNextFrame();     
        }
      };
    }

    // make some big open spaces
    var room_count = (args.room_count || 0);
    for(var i = 0; i < room_count; i++) {
      var size = Math.floor(3*(2 + Math.random()));
      var room_middle = grid.get_random_tile();
      grid.map_rectangle(room_middle.col - size/2, room_middle.row - size/2, size, size, function(tile) {
        if(tile) {
          tile.set_type("free");
        }
      });

      if(args.verbose) {
        yield * babysitter.waitForSeconds(0.1);           
      }
    }

    // all done
    if(args.verbose) {
      yield * babysitter.waitForSeconds(0.1);           
    }           
    var count_free = grid.count(function(tile) {
      return tile.is_type("free");
    });
    console.log("Total free tiles", count_free);
    yield * mutex.release();    
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return maze;
}();