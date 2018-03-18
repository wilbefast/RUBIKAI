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
  
  var _current_player = "player";
  var _other_player = {
    player : "enemy",
    enemy : "player"
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
    if(found_friend) {
      for(var i = 0; i < enemies.length; i++) {
        enemies[i].set_type(_current_player);
      }
    }
  }

  minimax.place_piece = function*(tile) {
    yield * mutex.claim();

    if(!tile.is_type("free")) {
      console.warn("invalid move", tile.col, tile.row);
      yield * mutex.release();
      return;
    }

    // place the piece
    tile.set_type(_current_player);

    // try to flip enemy pieces
    _try_flip_line(tile,  0,  1);
    _try_flip_line(tile,  0, -1);
    _try_flip_line(tile,  1,  0);
    _try_flip_line(tile, -1,  0);
    _try_flip_line(tile,  1,  1);
    _try_flip_line(tile, -1,  1);
    _try_flip_line(tile,  1, -1);
    _try_flip_line(tile, -1, -1);

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