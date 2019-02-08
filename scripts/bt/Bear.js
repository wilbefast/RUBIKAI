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
// BEAR CLASS
// ----------------------------------------------------------------------------


var Bear = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Bear = function(args) {
    // super constructor
    TileObject.call(this, args);

    // clear nearby berries
    this.tile.map_neighbours("8", function(t) {
      // clear berries from around the rabbit
      if(t.contents && t.contents.is_berry) {
        t.contents.purge = true;
      }
    });

    // done
    return this;
  }

  Bear.prototype.set_tile = TileObject.prototype.set_tile; 
  Bear.prototype.on_purge = TileObject.prototype.on_purge; 


  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  Bear.prototype.update = function(dt) {
  };

  Bear.prototype.draw = function() {
    ctx.fillStyle = "brown";
    ctx.beginPath();
    ctx.arc(this.draw_x, this.draw_y, 12, 0, 2*Math.PI);
    ctx.fill();
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Bear;
}();