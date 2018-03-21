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


var Rabbit = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Rabbit = function(args) {

    TileObject.call(this, args);

    // done
    return this;
  }

  Rabbit.prototype.set_tile = TileObject.prototype.set_tile; 
  Rabbit.prototype.on_purge = TileObject.prototype.on_purge; 


  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  Rabbit.prototype.update = function(dt) {
  };

  Rabbit.prototype.draw = function() {
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.arc(this.draw_x, this.draw_y, 4, 0, 2*Math.PI);
    ctx.fill();
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Rabbit;
}();