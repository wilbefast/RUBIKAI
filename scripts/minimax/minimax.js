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
// BOARD GAME AND MINIMAX IMPLEMENTATION
// ----------------------------------------------------------------------------

"use strict";

var minimax = function() {
  
  var minimax = {
  }
  
  // ------------------------------------------------------------------------------------------
  // PRIVATE VARIABLES
  // ------------------------------------------------------------------------------------------

  var _current_player = "red_player";
  var _other_player = {
    red_player : "blue_player",
    blue_player : "red_player"
  }

  // ------------------------------------------------------------------------------------------
  // REVERSI GAME RULES
  // ------------------------------------------------------------------------------------------
  
  var _try_flip_line = function(start_tile, dcol, drow, player, is_dry_run) {
    useful.assert(start_tile, "a starting tile must be specified");
    useful.assert(player, "a player must be specified");
    useful.assert(dcol !== undefined, "a horizontal direction must be specified");
    useful.assert(drow !== undefined, "a vertical direction must be specified");
    var local_grid = start_tile.grid;
    var enemy = _other_player[player];
    var enemies = [];

    // grab all the enemies between the start tile and the first friendly tile we ecounter
    var col = start_tile.col + dcol;
    var row = start_tile.row + drow;
    var found_friend = false;
    while(!found_friend && local_grid.is_valid_grid(col, row)) {
      var tile = local_grid.grid_to_tile(col, row);
      if(tile.is_type(enemy)) {
        enemies.push(tile); 
        col += dcol;
        row += drow;
      }
      else {
        if(tile.is_type(player)) {          
          found_friend = true;
        }

        break;
      }
    }

    // only flip the encountered enemy tiles if we found a friend
    if(found_friend && enemies.length > 0) {
      // 'dry run' only performs the check: it doesn't actually modify the grid
      if(!is_dry_run) {
        for(var i = 0; i < enemies.length; i++) {
          enemies[i].set_type(player);
        }
      }

      // success!
      return true;
    }
    else {
      // couldn't flip anything
      return false;
    }
  }

  var _try_flip_any_line = function(tile, player, is_dry_run) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");
    var success = false;
    success =_try_flip_line(tile,  0,  1, player, is_dry_run) || success;
    success =_try_flip_line(tile,  0, -1, player, is_dry_run) || success;
    success =_try_flip_line(tile,  1,  0, player, is_dry_run) || success;
    success =_try_flip_line(tile, -1,  0, player, is_dry_run) || success;
    success =_try_flip_line(tile,  1,  1, player, is_dry_run) || success;
    success =_try_flip_line(tile, -1,  1, player, is_dry_run) || success;
    success =_try_flip_line(tile,  1, -1, player, is_dry_run) || success;
    success =_try_flip_line(tile, -1, -1, player, is_dry_run) || success;
    
    return success;
  }

  var _can_flip_any_line = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");
    return _try_flip_any_line(tile, player, true);
  }

  var _is_game_over = function(local_grid) {
    useful.assert(local_grid, "a grid must be specified");
    return !local_grid.map(function(tile) {
      return tile.is_type("open") 
    });
  }

  var _get_score = function(local_grid, player) {
    useful.assert(player, "a player must be specified");
    useful.assert(local_grid, "a grid must be specified");
    return local_grid.count(function(tile) {
      return tile.is_type(player);
    })
  }

  var _is_valid_option = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");
    return (tile.is_type("free") || tile.is_type("open")) && _can_flip_any_line(tile, player);
  }

  var _get_options = function(local_grid, player) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    var result = [];
    local_grid.map(function(tile) {
      if(_is_valid_option(tile, player)) {
        result.push(tile);
      }
    });

    return result;
  }

  var _try_apply_option = function(tile, player) {
    // check that this is a legal move
    if(!tile.is_type("open")) {
      return false;
    }
    
    // place the piece
    tile.set_type(player);
    _try_flip_any_line(tile, player);

    // recalculate open tiles
    var local_grid = tile.grid;
    var open_tile_count = 0;
    var next_player = _other_player[player];    
    local_grid.map(function(t) {
      if(_is_valid_option(t, next_player)) {
        t.set_type("open");
        open_tile_count++;
      }
      else if(t.is_type("open")) {
        t.set_type("free");
      }
    });

    // check for game over
    if(open_tile_count <= 0) {
      var blue_score = _get_score(local_grid, "blue_player");
      var red_score = _get_score(local_grid, "red_player");
      if(blue_score > red_score) {
        console.log("blue player wins", blue_score, "to", red_score);  
      }
      else if(red_score > blue_score) {
        console.log("red player wins", red_score, "to", blue_score);  
      }
      else {
        console.log("draw", red_score, "to", blue_score);
      }
    }

    // place a piece successfully
    return true;
  }

  minimax.place_piece = function*(tile) {
    yield * mutex.claim();

    if(_try_apply_option(tile, _current_player)) {
      _current_player = _other_player[_current_player];
    }
    else {
      console.warn("invalid option", tile.col, tile.row, "for player", _current_player);
    }

    // all done
    yield * mutex.release(); 
  }

  // ------------------------------------------------------------------------------------------
  // MINIMAX ALGORITHM
  // ------------------------------------------------------------------------------------------
  
  var _evaluate_grid_random = function(local_grid, player) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    return Math.random();    
  }

  var _evaluate_grid_heuristic = function(local_grid, player) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    return _get_score(local_grid, player);
  }

  var _evaluate_option_random = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");    
    return Math.random();
  }

  var _evaluate_option_heuristic = function(tile, player) {
    useful.assert(tile, "a tile must be specified"); 
    useful.assert(player, "a player must be specified");    
    var local_grid = tile.grid.clone();
    var local_tile = local_grid.grid_to_tile(tile.col, tile.row);
    
    useful.assert(_try_apply_option(local_tile, player), "option must be valid");
    return _evaluate_grid_heuristic(local_grid, player);
  }

  var _evaluate_option_minimax = function(tile, player) {
    useful.assert(tile, "a tile must be specified");    
    useful.assert(player, "a player must be specified");
    return 0;
  }

  // ------------------------------------------------------------------------------------------
  // PUBLIC FUNCTIONS
  // ------------------------------------------------------------------------------------------
  
  minimax.init = function*(player) {
    yield * mutex.claim();

    // clean up
    _current_player = "red_player";
    grid.map(function(tile) {
      tile.set_type("free");
    });

    // set the board
    grid.grid_to_tile(3, 3).set_type("red_player");
    grid.grid_to_tile(4, 3).set_type("blue_player");
    grid.grid_to_tile(4, 4).set_type("red_player");
    grid.grid_to_tile(3, 4).set_type("blue_player");

    // mark initial options
    var options = _get_options(grid, _current_player);
    for(var i = 0; i < options.length; i++) {
      options[i].set_type("open");
    }

    // all done
    yield * mutex.release(); 
  }

  minimax.play = function*() {

    yield * mutex.claim();

    yield * babysitter.waitForSeconds(1);                     

    // play until the game is over
    while(!_is_game_over(grid)) {
      // evaluate each option
      var best_utility = -Infinity;
      var options = _get_options(grid, _current_player);
      useful.assert(options.length > 0, "there should always be an option");      
      var best_options = [];
      for(var i = 0; i < options.length; i++) {
        var option = options[i];
        var option_utility = _evaluate_option_heuristic(option, _current_player);
        if(option_utility >= best_utility) {
          if(option_utility > best_utility) {
            // there's a new kind on the block: clear out the original set of best options
            best_utility = option_utility;
            best_options.length = 0;
          }
          
          // add this option to the set of best options
          best_options.push(option);
        }
      }

      // choose on of the best options at random
      useful.assert(best_options.length > 0, "there should always be a best option");
      var chosen_option = useful.rand_in(best_options)
    
      // apply the options
      console.log("Taking turn for player", _current_player);
      useful.assert(_try_apply_option(chosen_option, _current_player));
      _current_player = _other_player[_current_player];      

      // wait for a moment before taking the next turn
      yield * babysitter.waitForSeconds(0.1);                 
    }

    // finished
    console.log("game over")
  
    // clean up
    yield * mutex.release(); 
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return minimax;
}();