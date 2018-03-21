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
// BERRY CLASS
// ----------------------------------------------------------------------------


var Berry = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Berry = function(args) {
    TileObject.call(this, args);

    // done
    return this;
  }

  Berry.prototype.is_berry = true;
  Berry.prototype.on_purge = TileObject.prototype.on_purge; 
  Berry.prototype.set_tile = TileObject.prototype.set_tile; 

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  Berry.prototype.update = function(dt) {

  }

  Berry.prototype.draw = function(dt) {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(this.draw_x, this.draw_y, 4, 0, 2*Math.PI);
    ctx.fill();
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Berry;
}();