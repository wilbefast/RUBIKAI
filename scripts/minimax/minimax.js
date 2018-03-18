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
  // REVERSI GAME RULES
  // ------------------------------------------------------------------------------------------
  
  var _current_player = "red_player";
  var _other_player = {
    red_player : "blue_player",
    blue_player : "red_player"
  }

  var _try_flip_line = function(start_tile, dcol, drow) {
    var enemy = _other_player[_current_player];
    var enemies = [];

    // grab all the enemies between the start tile and the first friendly tile we ecounter
    var col = start_tile.col + dcol;
    var row = start_tile.row + drow;
    var found_friend = false;
    while(!found_friend && grid.is_valid_grid(col, row)) {
      var tile = grid.grid_to_tile(col, row);
      if(tile.is_type(enemy)) {
        enemies.push(tile); 
        col += dcol;
        row += drow;
      }
      else {
        if(tile.is_type(_current_player)) {          
          found_friend = true;
        }

        break;
      }
    }

    // only flip the encountered enemy tiles if we found a friend
    if(found_friend && enemies.length > 0) {
      for(var i = 0; i < enemies.length; i++) {
        enemies[i].set_type(_current_player);
      }

      // success!
      return true;
    }
    else {
      // couldn't flip anything
      return false;
    }
  }

  var _try_flip_any_line = function(tile) {
    var success = false;
    success =_try_flip_line(tile,  0,  1) || success;
    success =_try_flip_line(tile,  0, -1) || success;
    success =_try_flip_line(tile,  1,  0) || success;
    success =_try_flip_line(tile, -1,  0) || success;
    success =_try_flip_line(tile,  1,  1) || success;
    success =_try_flip_line(tile, -1,  1) || success;
    success =_try_flip_line(tile,  1, -1) || success;
    success =_try_flip_line(tile, -1, -1) || success;

    return success;
  }

  minimax.place_piece = function*(tile) {
    yield * mutex.claim();

    // check that this is a legal move
    if(!tile.is_type("free") || !_try_flip_any_line(tile)) {
      console.warn("invalid move", tile.col, tile.row);
      yield * mutex.release();
      return;
    }

    // place the piece
    tile.set_type(_current_player);

    // check for end of game
    if(!grid.map(function(tile) {
      return tile.is_type("free")
    })) {
      var blue_score = grid.count(function(tile) {
        return tile.is_type("blue_player");
      })
      var red_score = grid.count(function(tile) {
        return tile.is_type("red_player")
      })

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

    // next player's turn
    _current_player = _other_player[_current_player];

    // all done
    yield * mutex.release(); 
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return minimax;
}();