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
    
    // hover over tiles
    var new_tile = grid.pixel_to_tile(cursor.x, cursor.y);
  
    if(new_tile != cursor.tile) {
      cursor.tile = new_tile;
    }
  }
  
  cursor.left_click = function() {
    if(!cursor.allow_input) {
      return;
    }
  }
  
  cursor.right_click = function(shiftHeld) {
    if(!cursor.allow_input) {
      return;
    }
  }

  cursor.draw = function() {
    ctx.fillRect(cursor.x - 4, cursor.y - 4, 8, 8)    
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return cursor;
}();
