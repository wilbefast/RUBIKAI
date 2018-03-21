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
// TILE OBJECT CLASS
// ----------------------------------------------------------------------------

var TileObject = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var _next_guid = 1;
  var TileObject = function(args) {

    // check parameters
    useful.copy_entries(args, this, [ "tile" ]);
    this.set_tile(this.tile);
 
    // globally unique identifier
    this.hash = _next_guid;
    _next_guid++;

    // add to update and draw lists 
    objects.add(this);

    // done
    return this;
  }

  TileObject.prototype.on_purge = function() {
    this.tile.contents = null;
    this.tile = null;
  }

  TileObject.prototype.set_tile = function(new_tile) {
    useful.assert(!new_tile.contents && new_tile.is_type("free"), "new tile should be free");
    if(this.tile) {
      this.tile.contents = null;
    }
    new_tile.contents = this;
    this.draw_x = new_tile.draw_x + new_tile.draw_w*0.5;
    this.draw_y = new_tile.draw_y + new_tile.draw_h*0.5;
    this.tile = new_tile;
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return TileObject;
}();