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
// TILE CLASS
// ----------------------------------------------------------------------------

var Tile = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Tile = function(args) {
    
    // check parameters
    useful.copy_entries(args, this, [ "grid", "row", "col" ]);
    
    // draw position
    this.draw_x = this.col*this.draw_w;
    this.draw_y = this.row*this.draw_h;

    // done
    return this;
  }

  Tile.prototype.draw_w = 32;
  Tile.prototype.draw_h = 32;

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
  
  Tile.prototype.draw = function() {
    if(cursor.tile === this) {
      ctx.fillRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);
    }
    else {
      ctx.strokeRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);      
    }
  };
  
  Tile.prototype.update = function(dt) {
  };

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Tile;
}();