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
// BEHAVIOUR TREE DEMO
// ----------------------------------------------------------------------------

var mode_bt = function() {
  var mode_bt = {
  }

  mode_bt.init = function() {
    
    // clean up
    mutex.force_release();
    objects.clear();

    // set random seed, for easier debugging
    Math.seedrandom('Two household, both alike in dignity.');

    // create a nice big grid
    grid = new Grid({
      n_cols : 80,
      n_rows : 40,
      tile_class : Tile,
      tile_draw_w : 16,
      tile_draw_h : 16
    });

    // create a maze
    babysitter.add(astar.generate_maze, {
      verbose : true
    });

    // set up AI caveman
    babysitter.add(function*() {

      yield * mutex.claim();

      // create the caveman's house
      var caveman_home_tile = grid.get_random_tile(function(tile) {
        return tile.is_type("free") && tile.all_neighbours("8", function(n) {
          return n.is_type("free");
        });
      });
      useful.assert(caveman_home_tile, "there must be a tile for the player to spawn on");
      caveman_home_tile.set_type("caveman_home");
      yield * babysitter.waitForSeconds(0.5);

      // create the caveman
      var caveman_tile = caveman_home_tile.map_neighbours("4", function(n) {
        return n;
      });
      var caveman = new Caveman({
        tile : caveman_tile
      })
      yield * babysitter.waitForSeconds(0.5);
      
      // create berries
      for(var i = 0; i < 0.1*grid.tiles.length; i++) {
        var berry_tile = grid.get_random_tile(function(tile) {
          return !tile.contents && tile.is_type("free");
        });
        useful.assert(berry_tile, "it should be possible to find valid tiles to receive berries");
        new Berry({
          tile : berry_tile
        });

        if(i % 100 === 0) {
          yield * babysitter.waitForNextFrame();             
        }
      }

      // create the bear
      var bear_tile = grid.get_random_tile(function(tile) {
        return !tile.contents && tile.is_type("free") && tile.all_neighbours("8", function(n) {
          return (!n.contents || n.contents.is_berry) && n.is_type("free");
        });
      });
      var bear = new Bear({
        tile : bear_tile
      })
      yield * babysitter.waitForSeconds(0.25);      
      bear_tile.map_neighbours("8", function(t) {
        // clear berries from around the bear
        if(t.contents && t.contents.is_berry) {
          t.contents.purge = true;
        }
      });
      yield * babysitter.waitForSeconds(0.25);      
      
      // create the rabbit
      var rabbit_tile = grid.get_random_tile(function(tile) {
        return !tile.contents && tile.is_type("free") && tile.all_neighbours("8", function(n) {
          return (!n.contents || n.contents.is_berry) && n.is_type("free");
        });
      });
      var rabbit = new Rabbit({
        tile : rabbit_tile
      })
      yield * babysitter.waitForSeconds(0.25);  
      rabbit_tile.map_neighbours("8", function(t) {
        // clear berries from around the rabbit
        if(t.contents && t.contents.is_berry) {
          t.contents.purge = true;
        }
      });
      yield * babysitter.waitForSeconds(0.25);     

      // create behaviour tree
      var behaviour_tree = new BehaviourTree({
      });
        var main_selector = new SelectorNode({
          name : "main_selector",
          parent : behaviour_tree
        });
          var carry_check = new ConditionalNode({
            name : "carry_check",
            parent : main_selector,
            predicate : function() { 
              return caveman.has_berry;
            }
          });
            var eat_sequence = new SequenceNode({
              name : "eat_sequence",
              parent : carry_check
            });
              var go_home = new ActionNode_GotoNearest({
                name : "go_home",
                parent : eat_sequence,
                such_that : function(tile) {
                  return tile.any_neighbours("4", function(n) {
                    return n.is_type("caveman_home");
                  });
                }
              });
              var eat_food = new BehaviourNode({
                name : "eat_food",
                parent : eat_sequence,
                update : function(dt) {
                  if(!caveman.has_berry) {
                    return BehaviourTree.FAILURE;                    
                  }
                  else {
                    caveman.has_berry = false;
                    console.log("ate berry")
                    return BehaviourTree.SUCCESS;
                  }
                }
              });
          var berry_check = new ConditionalNode({
            name : "berry_check",
            parent : main_selector,
            predicate : function() {
              return caveman.tile.any_neighbours("4", function(n) {
                return n.contents && n.contents.is_berry;
              });
            }
          });
            var harvest_berry = new BehaviourNode({
              name : "harvest_berry",
              parent : berry_check,
              update : function(dt) {
                console.log("harvesting berry")
                caveman.tile.map_neighbours("4", function(n) {
                  if(n.contents && n.contents.is_berry) {
                    n.contents.purge = true;
                    caveman.has_berry = true;
                  }
                });
                if(caveman.has_berry) {
                  console.log("harvested berry");
				          caveman.path = null;
                  return BehaviourTree.SUCCESS;
                }
                else {
                  return BehaviourTree.FAILURE;
                }
              }
            });
          var find_berry = new ActionNode_GotoNearest({
            name : "find_berry",
            parent : main_selector,
            such_that : function(tile) {
              return tile.any_neighbours("4", function(n) {
                return n.contents && n.contents.is_berry;
              });
            }
          });

      // keep updating until there are no berries left
      var lastFrameTime = Date.now();
      while(!caveman.has_berry || objects.update_list.length > 1) {
        // calculate dt
        var thisFrameTime = Date.now();
        var deltaTime = thisFrameTime - lastFrameTime;
        lastFrameTime = thisFrameTime; 
        var dt = deltaTime / 1000;

        // tick behaviour tree
        behaviour_tree.update(dt, caveman);

        // update objects
        objects.update(dt);

        // wait for the next frame
        yield * babysitter.waitForNextFrame();
      }

      // done      
      console.log("caveman has eaten all the berries");
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