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
// CAVEMAN CLASS
// ----------------------------------------------------------------------------


var Caveman = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Caveman = function(args) {

    TileObject.call(this, args);

    // done
    return this;
  }

  Caveman.prototype.set_tile = TileObject.prototype.set_tile; 
  Caveman.prototype.on_purge = TileObject.prototype.on_purge; 


  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  Caveman.prototype.update = function(dt) {
  };

  Caveman.prototype.draw = function() {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.draw_x, this.draw_y, 8, 0, 2*Math.PI);
    ctx.fill();

    if(this.has_berry) {
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(this.draw_x, this.draw_y, 4, 0, 2*Math.PI);
      ctx.fill();  
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Caveman;
}();