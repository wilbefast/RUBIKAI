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
    useful.assert(!this.tile.contents && this.tile.is_type("free"), "tile objects must spawn on free tile");
    this.tile.contents = this;
    this.draw_x = this.tile.draw_x + this.tile.draw_w*0.5;
    this.draw_y = this.tile.draw_y + this.tile.draw_h*0.5;
 
    // globally unique identifier
    this.hash = _next_guid;
    _next_guid++;

    // add to update and draw lists 
    objects.add(this);

    // done
    return this;
  }

  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return TileObject;
}();