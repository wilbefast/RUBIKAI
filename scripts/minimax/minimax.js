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
    var next_player = _other_player[player];    
    local_grid.map(function(t) {
      if(_is_valid_option(t, next_player)) {
        t.set_type("open");
      }
      else if(t.is_type("open")) {
        t.set_type("free");
      }
    });

    // we have placed the piece successfully
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
  // RANDOM EVALUATION
  // ------------------------------------------------------------------------------------------

  var _evaluate_option_random = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");   
    return Math.random();
  }

  // ------------------------------------------------------------------------------------------
  // HEURISTIC EVALUATION
  // ------------------------------------------------------------------------------------------

  var _evaluate_grid_heuristic = function(local_grid, player) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    return _get_score(local_grid, player);
  }

  var _evaluate_option_heuristic = function(tile, player) {
    useful.assert(tile, "a tile must be specified"); 
    useful.assert(player, "a player must be specified");    
    var local_grid = tile.grid.clone();
    var local_tile = local_grid.grid_to_tile(tile.col, tile.row);
    
    useful.assert(_try_apply_option(local_tile, player), "option must be valid");
    return _evaluate_grid_heuristic(local_grid, player);
  }

  // ------------------------------------------------------------------------------------------
  // MINIMAX ALGORITHM
  // ------------------------------------------------------------------------------------------

  var _evaluate_grid_minimax = function(local_grid, player) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    return 0; // TODO
  }

  var _evaluate_option_minimax = function(tile, player) {
    useful.assert(tile, "a tile must be specified");    
    useful.assert(player, "a player must be specified");
    return 0; // TODO
  }

  // ------------------------------------------------------------------------------------------
  // PARAMETER MANAGEMENT
  // ------------------------------------------------------------------------------------------

  var _controllers = {
    // we could have called this one 'human' but that would be no fun, would it?
    mechanical_turk : {
      name : "mechanical_turk",
      is_ai : false
    },
    random : {
      name : "random",
      is_ai : true,
      evaluate_option : _evaluate_option_random
    },
    heuristic : {
      name : "heuristic",
      is_ai : true,
      evaluate_option : _evaluate_option_heuristic
    },
    minimax : {
      name : "minimax",
      is_ai : true,
      evaluate_option : _evaluate_option_minimax
    }
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

  minimax.play = function*(args) {
    // check parameters for blue player
    var controllers = {}
    controllers.blue_player = _controllers[args.blue_player];
    useful.assert(controllers.blue_player, "there must be valid parameters for the blue player");
    controllers.red_player = _controllers[args.red_player];
    useful.assert(controllers.red_player, "there must be valid parameters for the red player");

    // play until the game is over
    while(!_is_game_over(grid)) {
      
      // should we play for the current player?
      var current_player_controller = controllers[_current_player];
      if(!current_player_controller.is_ai) {
        // check again in 1 second
        yield * babysitter.waitForSeconds(1);                 
      }
      else {
        // prevent all interference while the AI is thinking
        yield * mutex.claim();

        // evaluate each option
        var best_utility = -Infinity;
        var options = _get_options(grid, _current_player);
        useful.assert(options.length > 0, "there should always be an option");      
        var best_options = [];
        for(var i = 0; i < options.length; i++) {
          var option = options[i];
          var option_utility = current_player_controller.evaluate_option(option, _current_player);
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
        if(args.verbose) {
          console.log(current_player_controller.name, "taking turn for player", _current_player);
        }
        useful.assert(_try_apply_option(chosen_option, _current_player));
        _current_player = _other_player[_current_player];

        // the AI has finished thinking so can release the mutex
        yield * mutex.release(); 

        // pause for a moment
        if(args.verbose) {
          yield * babysitter.waitForSeconds(0.1);                         
        }
      }  
    }

    // figure out who won and who lost
    var winner, loser, winner_score, loser_score;
    var blue_score = _get_score(grid, "blue_player");
    var red_score = _get_score(grid, "red_player");
    if(blue_score > red_score) {
      winner = "blue_player";
      loser = "red_player";
      winner_score = blue_score;
      loser_score = red_score;
    }
    else if(red_score > blue_score) {
      winner = "red_player";
      loser = "blue_player";
      winner_score = red_score;
      loser_score = blue_score;
    }

    if(winner) {
      console.log(controllers[winner].name, "beat", controllers[loser].name, winner_score, "to", loser_score);
    }
    else {
      console.log("draw", red_score, "to", blue_score)
    }

  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return minimax;
}();