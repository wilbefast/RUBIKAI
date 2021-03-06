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

"use strict";

// ----------------------------------------------------------------------------
// CURSOR MANAGER
// ----------------------------------------------------------------------------

var cursor = function() {
  var cursor = {
    x : 0,
    y : 0,
    allow_input : true
  }
  
  cursor.move_to = function(x, y) {
    cursor.x = x;
    cursor.y = y;
    
    if(!cursor.allow_input) {
      return;
    }
    
    if(grid) {
      // hover over tiles
      var new_tile = grid.pixel_to_tile(cursor.x, cursor.y);
    
      if(new_tile != cursor.tile) {
        cursor.tile = new_tile;
        if(cursor.DEBUG) {
          console.log("hovering", new_tile.col, new_tile.row);
        }
      }
    }
  }
  
  cursor.left_click = function() {
    if(cursor.tile) {
      console.log("left click on", cursor.tile.col, cursor.tile.row);
    }

    if(!cursor.allow_input) {
      return;
    }

    if(cursor.tile && mode) {
      mode.left_click(cursor.tile)
    }
  }
  
  cursor.right_click = function(shiftHeld) {
    if(cursor.tile) {
      console.log("right click on", cursor.tile.col, cursor.tile.row);
    }

    if(!cursor.allow_input) {
      return;
    }

    if(cursor.tile && mode) {
      mode.right_click(cursor.tile)
    }
  }

  cursor.draw = function() {
    if(cursor.DEBUG) {
      ctx.fillStyle = "white";
      ctx.fillRect(cursor.x - 4, cursor.y - 4, 8, 8)    
    }
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return cursor;
}();
