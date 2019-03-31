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
// A* IMPLEMENTATION
// ----------------------------------------------------------------------------

"use strict";

var astar = function() {
  
  var astar = {
  }

  var _player_tile = null;

  // ------------------------------------------------------------------------------------------
  // PLAYER
  // ------------------------------------------------------------------------------------------
  
  astar.spawn_player = function*() {
    // lock mutex
    yield * mutex.claim();

    // player has to spawn somewhere free, surrounded on all sides by free tiles
    var player_tile = grid.get_random_tile(function(tile) {
      return tile.is_type("free") && tile.all_neighbours("8", function(n) {
        return n.is_type("free");
      });
    });
    useful.assert(player_tile, "there must be a tile for the player to spawn on");
    player_tile.set_type("player");

    // remember the player position
    _player_tile = player_tile;

    // all done
    yield * mutex.release();
  }

  // ------------------------------------------------------------------------------------------
  // A STAR
  // ------------------------------------------------------------------------------------------
 
  astar.get_path_to_any = function(source_tile, such_that) {
    if(!source_tile.is_type("free")) {
      console.log("invalid source", source_tile.col, source_tile.row);
      return;
    }

    // in order to move, we'll need a path to follow
    var path = [];

    // to calculate the path we'll need to store some per-tile values, like their cost
    // but for this implementation I'm storing them inside the tile objects for simplicity
    // a cleaner implementation would encapsulate the tiles within a "path state" object
    source_tile.current_cost = 0;
    var open = [ source_tile ];
    source_tile.set_type("open");

    while(open.length > 0) {
      var tile = open.shift();

      // have we found a berry ?
      if(such_that(tile)) {
        // read back the path
        while(tile && tile !== source_tile) {
          path.unshift(tile);
          tile = tile.previous;
        }

        // time to stop
        open.length = 0;
      }
      else {
        tile.map_neighbours("4", function(n) {
          if(!n.is_pathable()) {
            // impassible tile
            return;
          }
          else {
            var change_previous = false;

            if(n.is_type("free")) {
              // new tile that has not yet been examined
              change_previous = true;
              n.set_type("open");
              open.push(n);
            }
            else if(n.is_type("open")) {
              // tile that was previously examined, but this path might be better
              change_previous = n.current_cost > tile.current_cost + 1; 
            }

            if(change_previous) {
              n.previous = tile;
              n.current_cost = tile.current_cost + 1;
            }
          }
        });

        // make sure we don't explore things twice
        tile.set_type("closed");
      }
    }

    // clean up
    grid.map(function(tile) {
      if(tile.is_pathable()) {
        delete tile.previous
        delete tile.current_cost
        delete tile.estimated_total_cost
        delete tile.estimated_remaining_cost
        if(!tile.is_type("path")) {
          tile.set_type("free");
        }
      }
    });  

    return path;
  }

  astar.get_path_from_to = function(source_tile, destination_tile) {
    if(!source_tile.is_type("free")) {
      console.log("invalid source", source_tile.col, source_tile.row);
      return;
    }
    if(!destination_tile.is_type("free")) {
      console.log("invalid destination", destination_tile.col, destination_tile.row);
      return;
    }

    // in order to move, we'll need a path to follow
    var path = [];

    // to calculate the path we'll need to store some per-tile values, like their cost
    // but for this implementation I'm storing them inside the tile objects for simplicity
    // a cleaner implementation would encapsulate the tiles within a "path state" object
    source_tile.current_cost = 0;
    source_tile.estimated_total_cost = source_tile.distance_to(destination_tile); 
    var open = [ source_tile ];
    source_tile.set_type("open");

    while(open.length > 0) {
      var tile = open.shift();

      // have we reached our destination ?
      if(tile === destination_tile) {
        // read back the path
        while(tile && tile !== source_tile) {
          path.unshift(tile);
          tile = tile.previous;
        }

        // time to stop
        open.length = 0;
      }
      else {
        tile.map_neighbours("4", function(n) {
          if(!n.is_pathable()) {
            // impassible tile
            return;
          }
          else {
            var estimated_remaining_cost = n.estimated_remaining_cost || n.distance_to(destination_tile);
            var new_estimated_total_cost = tile.current_cost + 1 + n.distance_to(destination_tile);
            
            var change_previous = false;

            if(n.is_type("free")) {
              // new tile that has not yet been examined
              change_previous = true;
              n.set_type("open");
              open.push(n);
            }
            else if(n.is_type("open")) {
              // tile that was previously examined, but this path might be better
              change_previous = (new_estimated_total_cost < n.estimated_total_cost); 
            }

            if(change_previous) {
              n.previous = tile;
              n.current_cost = tile.current_cost + 1;
              n.estimated_remaining_cost = estimated_remaining_cost;
              n.estimated_total_cost = new_estimated_total_cost; 
            }
          }
        });

        // make sure we don't explore things twice
        tile.set_type("closed");
      }

      // this sorting is the key: we explore the most promising frontiers first
      open.sort(function(a, b) {
        return (a.estimated_total_cost - b.estimated_total_cost);
      });
    }

    // clean up
    grid.map(function(tile) {
      if(tile.is_pathable()) {
        delete tile.previous
        delete tile.current_cost
        delete tile.estimated_total_cost
        delete tile.estimated_remaining_cost
        if(!tile.is_type("path")) {
          tile.set_type("free");
        }
      }
    });    

    return path;
  }

  astar.move_to = function*(args) {
    var destination_tile = args.destination;
    useful.assert(destination_tile, "a destination must be specified");

    yield * mutex.claim();

    if(!destination_tile.is_type("free")) {
      console.log("invalid destination", destination_tile.col, destination_tile.row);
      yield * mutex.release();
      return;
    }

    // in order to move, we'll need a path to follow
    var path = [];

    // to calculate the path we'll need to store some per-tile values, like their cost
    // but for this implementation I'm storing them inside the tile objects for simplicity
    // a cleaner implementation would encapsulate the tiles within a "path state" object
    _player_tile.current_cost = 0;
    _player_tile.estimated_total_cost = _player_tile.distance_to(destination_tile); 
    var open = [ _player_tile ];
    _player_tile.set_type("open");

    while(open.length > 0) {
      var tile = open.shift();

      // have we reached our destination ?
      if(tile === destination_tile) {
        // read back the path
        while(tile) {
          tile.set_type("path");
          path.unshift(tile);
          tile = tile.previous;
          if(args.verbose) {
            yield * babysitter.waitForNextFrame();           
          }
        }

        // time to stop
        open.length = 0;
      }
      else {
        tile.map_neighbours("4", function(n) {
          if(n.is_type("wall")) {
            // impassible tile
            return;
          }
          else {
            var estimated_remaining_cost = n.estimated_remaining_cost || n.distance_to(destination_tile);
            var new_estimated_total_cost = tile.current_cost + 1 + n.distance_to(destination_tile);
            
            var change_previous = false;

            if(n.is_type("free")) {
              // new tile that has not yet been examined
              change_previous = true;
              n.set_type("open");
              open.push(n);
            }
            else if(n.is_type("open")) {
              // tile that was previously examined, but this path might be better
              change_previous = (new_estimated_total_cost < n.estimated_total_cost); 
            }

            if(change_previous) {
              n.previous = tile;
              n.current_cost = tile.current_cost + 1;
              n.estimated_remaining_cost = estimated_remaining_cost;
              n.estimated_total_cost = new_estimated_total_cost; 
            }
          }
        });

        // make sure we don't explore things twice
        tile.set_type("closed");
      }

      // this sorting is the key: we explore the most promising frontiers first
      open.sort(function(a, b) {
        return (a.estimated_remaining_cost - b.estimated_remaining_cost);
      });

      // skip a frame so the we can see the path being calculated in real time
      if(args.verbose) {   
        yield * babysitter.waitForNextFrame();           
      }
    }

    // clean up
    grid.map(function(tile) {
      if(!tile.is_type("wall")) {
        delete tile.previous
        delete tile.current_cost
        delete tile.estimated_total_cost
        delete tile.estimated_remaining_cost
        if(!tile.is_type("path")) {
          tile.set_type("free");
        }
      }
    });
    _player_tile.set_type("player");

    // follow path
    while(path.length > 0) {
      _player_tile.set_type("free");
      _player_tile = path.shift();
      _player_tile.set_type("player");
      yield * babysitter.waitForSeconds(0.05);      
    }

    // all done
    yield * mutex.release(); 
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return astar;
}();