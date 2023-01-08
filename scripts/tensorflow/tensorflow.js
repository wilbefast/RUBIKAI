/*
(C) Copyright 2023 William Dyce

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
// BOARD GAME AND TENSORFLOW IMPLEMENTATION
// ----------------------------------------------------------------------------

"use strict";

var tensorflow = function() {
  
  var tensorflow = {
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
  // GAME RULES
  // ------------------------------------------------------------------------------------------
  
  var _init = function() {
    // clean up
    _current_player = "red_player";
    grid.map(function(tile) {
      tile.set_type("free");
    });
  }

  var _is_game_over = function(local_grid) {
    useful.assert(local_grid, "a grid must be specified");
    var score = _get_score(local_grid, _current_player);
    if (score != 0.5) {
      return true;
    }
    else if (_get_options(local_grid, _current_player).length == 0) {
      return true;
    }
    else {
      return false;
    }
  }
  
  var _get_score = function(local_grid, player) {
    useful.assert(player, "a player must be specified");
    useful.assert(local_grid, "a grid must be specified");
    // check for victory
    if (_is_winner(local_grid, player)) {
      return 1;
    }
    else if (_is_winner(local_grid, _other_player[player])) {
      return 0;
    }
    else {
      return 0.5;
    }
  }

  var _is_winner = function(local_grid, player) {
    var f = function(tile) { 
      return tile.is_type(player)
    }
    if (local_grid.all_in_any_col(f) 
    || local_grid.all_in_any_row(f)
    || local_grid.all_in_SE_diag(f)
    || local_grid.all_in_NE_diag(f)) {
      return true;
    }
    return false;
  }

  var _is_valid_option = function(tile, player) {
    useful.assert(tile, "a tile must be specified");
    useful.assert(player, "a player must be specified");
    return tile.is_type("free");
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
    if (!_is_valid_option(tile, player)) {
      return false;
    }
    else {
      // mark the tile
      tile.set_type(player);
      return true;
    }
  }

  tensorflow.place_piece = function*(tile) {
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
  // NEURAL NET EVALUATION
  // ------------------------------------------------------------------------------------------


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
    }
  }

  // ------------------------------------------------------------------------------------------
  // PUBLIC FUNCTIONS
  // ------------------------------------------------------------------------------------------

  tensorflow.play = function*(args) {
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
  
  return tensorflow;
}();