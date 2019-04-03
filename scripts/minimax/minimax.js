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
  
  var _init = function() {
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
      options[i].set_type("option");
    }
  }

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
      return tile.is_type("option") 
    });
  }

  var _get_score = function(local_grid, player) {
    useful.assert(player, "a player must be specified");
    useful.assert(local_grid, "a grid must be specified");
    return local_grid.count(function(tile) {
      return tile.is_type(player);
    })
  }

  var _is_winner = function(local_grid, player) {
    return _get_score(local_grid, player) > _get_score(local_grid, _other_player[player]);
  }

  var _is_valid_option = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");
    return (tile.is_type("free") || tile.is_type("option")) && _can_flip_any_line(tile, player);
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
    if(!tile.is_type("option")) {
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
        t.set_type("option");
      }
      else if(t.is_type("option")) {
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

    var value = 0;
    for(var col = 0; col < local_grid.n_cols; col++) {
      for(var row = 0; row < local_grid.n_rows; row++) {
        var tile = local_grid.grid_to_tile(col, row);
        if(tile.is_type(player)) {

          if(tile.is_corner()) {
            value = useful.boost(value, 0.5);
          }
          else if(tile.any_neighbours("8", function(t) {
            return t.is_corner()
          })) {
            value = useful.boost(value, -0.3);
          }
          else if (tile.is_edge()) {
            value = useful.boost(value, 0.3);
          }
          else {
            value = useful.boost(value, 0.1);
          }
        }
        else if(tile.is_type(_other_player[player])) {
          if(tile.is_corner()) {
            value = useful.boost(value, -0.5);
          }
          else if(tile.any_neighbours("8", function(t) {
            return t.is_corner();
          })) {
            value = useful.boost(value, 0.3);            
          }
          else if (tile.is_edge()) {
            value = useful.boost(value, -0.3);
          }
          else {
            value = useful.boost(value, -0.1);
          }
        }
      }
    }

    useful.assert(value >= 0 && value <= 1, "utility values should be between 0 and 1"); 
    return value;
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

  // Note the complexity is O(b^d) where d is the depth and b is branching factor!  
  var _max_depth = 3;

  var _evaluate_option_minimax; // forward declaration, just like old times ;)

  var _evaluate_options_minimax_min = function(options, player, depth) {
    useful.assert(options, "a set of options must be specified");    
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    // Here we're asking the question: "what's the worst that could happen?"
    var worst_value = Infinity;
    for(var i = 0; i < options.length; i++) {
      var value = _evaluate_option_minimax(options[i], player, depth + 1);
      if(value < worst_value) {
        worst_value = value;
      }
    }

    useful.assert(worst_value >= 0 && worst_value <= 1, "utility values should be between 0 and 1");
    return worst_value;
  }

  var _evaluate_options_minimax_max = function(options, player, depth) {
    useful.assert(options, "a set of options must be specified");    
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    // Here we're asking the question: "what's the best that could happen?"
    var best_value = -Infinity;
    for(var i = 0; i < options.length; i++) {
      var value = _evaluate_option_minimax(options[i], player, depth + 1);
      if(value > best_value) {
        best_value = value;
      }
    }

    useful.assert(best_value >= 0 && best_value <= 1, "utility values should be between 0 and 1");    
    return best_value;
  }

  var _evaluate_grid_minimax = function(local_grid, player, depth) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    if(depth >= _max_depth) {
      // for performance reasons we need to default to a heuristic evaluation when we go too deep
      // this is why it took us so long to make machines that could win at Go
      return _evaluate_grid_heuristic(local_grid, _current_player);
    }
    else if(_is_game_over(local_grid)) {
      // true leaf nodes are the only nodes we can evaluate truthfully,
      // meaning that we could "solve" the game if our max depth was infinite
      if(_is_winner(local_grid, _current_player)) {
        return 1;
      }
      else if (_is_winner(local_grid, _other_player[_current_player])) {
        return 0;
      }
      else {
        return 0.5;
      }
    }
    else {
      // otherwise the value of the board is either the value of the best option for us, 
      // if it's our turn, or the worst option for us, if it's our adversary's turn
      var next_player = _other_player[player];
      var options = _get_options(local_grid, next_player);
      useful.assert(options.length > 0, "game is not over so there should be at least 1 option");
      if(next_player === _current_player) {
        return _evaluate_options_minimax_max(options, next_player, depth);
      }
      else {
        return _evaluate_options_minimax_min(options, next_player, depth);
      }
    }
  }

  _evaluate_option_minimax = function(tile, player, depth) {
    useful.assert(tile, "a tile must be specified");    
    useful.assert(player, "a player must be specified");
    if(depth === undefined) {
      depth = 0;
    }

    var local_grid = tile.grid.clone();
    var local_tile = local_grid.grid_to_tile(tile.col, tile.row);
    useful.assert(_try_apply_option(local_tile, player), "option must be valid");

    return _evaluate_grid_minimax(local_grid, player, depth);
  }

  // ------------------------------------------------------------------------------------------
  // MINIMAX ALGORITHM WITH ALPHA-BETA PRUNING
  // ------------------------------------------------------------------------------------------

  // The complexity here is only O(b^(d/2)) where d is the depth and b is branching factor
  // so we can double the search depth with regard to minimax
  var _max_depth_ab = 4;

  var _evaluate_option_minimax_ab; // forward declaration, just like old times ;)

  var _evaluate_options_minimax_min_ab = function(options, player, depth, alpha, beta) {
    useful.assert(options, "a set of options must be specified");    
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    // Here we're asking the question: "what's the worst that could happen?"
    for(var i = 0; i < options.length; i++) {
      var beta_prime = _evaluate_option_minimax_ab(options[i], player, depth + 1, alpha, beta);
      beta = Math.min(beta, beta_prime)
      if(beta < alpha) {
        break;
      }
    }

    useful.assert(beta >= 0 && beta <= 1, "utility values should be between 0 and 1");
    return beta;
  }

  var _evaluate_options_minimax_max_ab = function(options, player, depth, alpha, beta) {
    useful.assert(options, "a set of options must be specified");    
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    // Here we're asking the question: "what's the best that could happen?"
    var best_value = -Infinity;
    for(var i = 0; i < options.length; i++) {
      var alpha_prime = _evaluate_option_minimax_ab(options[i], player, depth + 1, alpha, beta);
      alpha = Math.max(alpha, alpha_prime);
      if(alpha >= beta) {
        break;
      }
    }

    useful.assert(alpha >= 0 && alpha <= 1, "utility values should be between 0 and 1");    
    return alpha;
  }

  var _evaluate_grid_minimax_ab = function(local_grid, player, depth, alpha, beta) {
    useful.assert(local_grid, "a grid must be specified");
    useful.assert(player, "a player must be specified");
    useful.assert(depth !== undefined, "a depth must be specified");

    if(depth >= _max_depth_ab) {
      // for performance reasons we need to default to a heuristic evaluation when we go too deep
      // this is why it took us so long to make machines that could win at Go
      return _evaluate_grid_heuristic(local_grid, _current_player);
    }
    else if(_is_game_over(local_grid)) {
      // true leaf nodes are the only nodes we can evaluate truthfully,
      // meaning that we could "solve" the game if our max depth was infinite
      if(_is_winner(local_grid, _current_player)) {
        return 1;
      }
      else if (_is_winner(local_grid, _other_player[_current_player])) {
        return 0;
      }
      else {
        return 0.5;
      }
    }
    else {
      // otherwise the value of the board is either the value of the best option for us, 
      // if it's our turn, or the worst option for us, if it's our adversary's turn
      var next_player = _other_player[player];
      var options = _get_options(local_grid, next_player);
      useful.assert(options.length > 0, "game is not over so there should be at least 1 option");
      if(next_player === _current_player) {
        return _evaluate_options_minimax_max_ab(options, next_player, depth, alpha, beta);
      }
      else {
        return _evaluate_options_minimax_min_ab(options, next_player, depth, alpha, beta);
      }
    }
  }

  _evaluate_option_minimax_ab = function(tile, player, depth, alpha, beta) {
    useful.assert(tile, "a tile must be specified");    
    useful.assert(player, "a player must be specified");
    if(depth === undefined) {
      depth = 0;
    }
    if(alpha === undefined) {
      alpha = 0;
    }
    if(beta === undefined) {
      beta = 1;
    }

    var local_grid = tile.grid.clone();
    var local_tile = local_grid.grid_to_tile(tile.col, tile.row);
    useful.assert(_try_apply_option(local_tile, player), "option must be valid");

    return _evaluate_grid_minimax_ab(local_grid, player, depth, alpha, beta);
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
    },
    minimax_ab : {
      name : "minimax_ab",
      is_ai : true,
      evaluate_option : _evaluate_option_minimax_ab
    }
  }

  // ------------------------------------------------------------------------------------------
  // PUBLIC FUNCTIONS
  // ------------------------------------------------------------------------------------------

  minimax.play = function*(args) {
    // check parameters
    var controllers = {}
    controllers.blue_player = _controllers[args.blue_player];
    useful.assert(controllers.blue_player, "there must be valid parameters for the blue player");
    controllers.red_player = _controllers[args.red_player];
    useful.assert(controllers.red_player, "there must be valid parameters for the red player");

    useful.assert(args.matches === undefined || (!isNaN(parseFloat(args.matches)) && isFinite(args.matches)), "matches must be a whole number");
    var matches = args.matches || 1;
    var victories = {
      red_player : 0,
      blue_player : 0
    }

    var start_time = new Date().getTime();
    console.log("blue is controlled by", controllers.blue_player.name);
    console.log("red is controlled by", controllers.red_player.name);

    yield * babysitter.waitForNextFrame();                               
    for(var match_i = 0; match_i < matches; match_i++) {
      console.log("match", match_i, "of", matches)

      // set up the board
      _init();

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
          if(args.DEBUG) {
            console.log(current_player_controller.name, "thinking for player", _current_player);
          }
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
        
          // apply the option
          if(args.DEBUG) {
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

      // report the winner, even if not in verbose mode
      if(winner) {
        console.log(controllers[winner].name, "beat", controllers[loser].name, winner_score, "to", loser_score);
        victories[winner]++;
      }
      else {
        console.log("draw", red_score, "to", blue_score)
      }
      yield * babysitter.waitForNextFrame();                         
    }

    // results
    var end_time = new Date().getTime();
    var delta_time = end_time - start_time;
    console.log(controllers.red_player.name, "won", Math.floor(victories.red_player/matches*100) + "%", "of the time");
    console.log(controllers.blue_player.name, "won", Math.floor(victories.blue_player/matches*100) + "%", "of the time");
    console.log("average time per game:", delta_time/matches);
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return minimax;
}();