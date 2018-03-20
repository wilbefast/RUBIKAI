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

    // create bot
    babysitter.add(function*() {

      yield * mutex.claim();

      // create the caveman's house
      var caveman_tile = grid.get_random_tile(function(tile) {
        return tile.is_type("free") && tile.all_neighbours("8", function(n) {
          return n.is_type("free");
        });
      });
      useful.assert(caveman_tile, "there must be a tile for the player to spawn on");
      caveman_tile.set_type("caveman_home");
      yield * babysitter.waitForSeconds(0.5);

      // create the caveman
      caveman_tile = caveman_tile.map_neighbours("4", function(n) {
        return n;
      });
      var bot = new Caveman({
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
        })
      }

      // create behaviour tree
      var root = new BehaviourTree({
      });
        var main_selector = new SelectorNode({
          parent : root
        });
          var carry_check = new BehaviourNode({
            parent : main_selector,
            update : function(dt) {

            }
          });
            var eat_sequence = new SequenceNode({
              parent : carry_check
            });
              var go_home = new BehaviourNode({
                parent : eat_sequence,
                update : function(dt) {

                }
              });
              var eat_food = new BehaviourNode({
                parent : eat_sequence,
                update : function(dt) {

                }
              });
          var berry_check = new BehaviourNode({
            parent : main_selector,
            update : function(dt) {

            }
          });
            var get_berries = new BehaviourNode({
              parent : eat_sequence,
              update : function(dt) {
              
              }
            });
          var roam = new BehaviourNode({
            parent : main_selector,
            update : function(dt) {

            }
          });

      // done
      yield * mutex.release();
    });
  }

  mode_bt.update = function(dt) {

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
