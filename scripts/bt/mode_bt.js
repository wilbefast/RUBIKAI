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
// BEHAVIOUR TREE DEMO
// ----------------------------------------------------------------------------

var mode_bt = function() {

  var _make_bear = function() {
    var bear_tile = grid.get_random_tile(function(tile) {
      return !tile.contents && tile.is_type("free") && tile.all_neighbours("8", function(n) {
        return (!n.contents || n.contents.is_berry) && n.is_type("free");
      });
    });
    var bear = new Bear({
      tile : bear_tile
    });
    return bear;
  }

  var _make_rabbit = function() {
    var rabbit_tile = grid.get_random_tile(function(tile) {
      return !tile.contents && tile.is_type("free") && tile.all_neighbours("8", function(n) {
        return (!n.contents || n.contents.is_berry) && n.is_type("free");
      });
    });
    var rabbit = new Rabbit({
      tile : rabbit_tile
    });
    return rabbit;
  }

  var mode_bt = {
  }

  mode_bt.init = function() {
    
    // clean up
    mutex.force_release();
    objects.clear();
    delete cy.chart;

    // show cytoscape    
    cy.style.display = "initial";

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
      },
      path : {
        name : "path",
        colour : "tan"
      },
      caveman_home : {
        name : "caveman_home",
        is_pathable : false,
        colour : "brown"
      }
    }    

    // set random seed, for easier debugging
    Math.seedrandom('Two household, both alike in dignity.');

    // create a nice big grid
    const size = 40;
    grid = new Grid({
      n_cols : size,
      n_rows : size,
      tile_class : Tile,
      tile_draw_w : 512 / size,
      tile_draw_h : 512 / size,
      off_x : ctx.canvas.width*0.25
    });

    // create a maze
    babysitter.add(maze.generate, {
      verbose : false,
      room_count : Math.floor(7 + Math.random()*3)
      
    });

    // set up AI caveman
    babysitter.add(function*() {

      yield * mutex.claim();

      // create the caveman's house
      var caveman_home_tile = grid.get_random_tile(function(tile) {
        return tile.is_type("free") && !tile.is_edge();
      });
      useful.assert(caveman_home_tile, "there must be a tile for the player to spawn on");
      caveman_home_tile.set_type("caveman_home");
      caveman_home_tile.map_neighbours("8", function(n) {
        n.set_type("free");
      });

      // create the cavemen
      var cavemen_to_spawn = 1;
      var cavemen = [];
      var caveman_tile = caveman_home_tile.map_neighbours("4", function(n) {
        if(cavemen_to_spawn-- > 0) {
          cavemen.push(new Caveman({
            tile : n
          }));
          n.map_neighbours("8", function(nn) {
            if(!nn.is_type("caveman_home")) {
              nn.set_type("free");
            }
          });
        }
      });
      
      // create berries
      for(var i = 0; i < 0.1*grid.tiles.length; i++) {
        var berry_tile = grid.get_random_tile(function(tile) {
          return !tile.contents && tile.is_type("free") && !tile.any_neighbours("8", function(n) {
            return n.contents && n.contents.is_caveman;
          });
        });
        useful.assert(berry_tile, "it should be possible to find valid tiles to receive berries");
        new Berry({
          tile : berry_tile
        });
      }

      // create the bear
      //_make_bear();
      
      // create the rabbit
      //_make_rabbit();

      // keep updating until there are no berries left
      var lastFrameTime = Date.now();
      var no_caveman_has_berry = true;
      for(var i = 0; i < cavemen.length; i++) {
        if(cavemen[i].has_berry) {
          no_caveman_has_berry = false;
          i = cavemen.length;
        }
      }

      while(no_caveman_has_berry || objects.update_list.length > 1) {
        // calculate dt
        var thisFrameTime = Date.now();
        var deltaTime = thisFrameTime - lastFrameTime;
        lastFrameTime = thisFrameTime; 
        var dt = deltaTime / 1000;

        // update objects
        objects.update(dt);

        // wait for the next frame
        yield * babysitter.waitForNextFrame();
      }

      // done      
      console.log("the cavemen has eaten all the berries");
      yield * mutex.release();
    });
  }

  mode_bt.left_click = function(tile) {
    // left click is not bound to anything
  }

  mode_bt.right_click = function(tile) {
    // right click is not bound to anything
  }


  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_bt;
}();