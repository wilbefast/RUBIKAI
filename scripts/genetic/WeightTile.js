/*
(C) Copyright 2019 William Dyce

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
// WEIGHT TILE CLASS
// ----------------------------------------------------------------------------

var WeightTile = function() {
  var _colours = new Array(256);
  for(var i = 0; i < _colours.length; i++) {
    var colour;
    if(i < 128) {
      var red = i*2;
      colour = "rgb(" + red + ",0,0)";

    }
    else {
      var blue = (i - 128)*2;
      colour = "rgb(0,0," + blue + ")";
    }
    _colours[i] = colour;
  }

  var _value_to_colour = function(v) {
    return _colours[Math.floor((v + 1) * 127.5)];
  }

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var WeightTile = function(args) {

    // check parameters
    useful.copy_entries(args, this, [ "grid", "row", "col", "draw_w", "draw_h" ]);
    
    // rendering
    this.draw_x = this.grid.draw_x + this.col*this.draw_w;
    this.draw_y = this.grid.draw_y + this.row*this.draw_h;
    this.value = 0;
    this.colour = _value_to_colour(0);
    
    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // COLOUR
  // ------------------------------------------------------------------------------------------

  WeightTile.prototype.set_value = function(value) {
    this.value[action] = value;
    this.colour[action] = _value_to_colour(value);
  }

  // ------------------------------------------------------------------------------------------
  // DRAW
  // ------------------------------------------------------------------------------------------

  WeightTile.prototype.draw = function() {
    ctx.fillStyle = this.colour;            
    ctx.fillRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);
    
    if(this.DEBUG) {
      ctx.fillText("" + this.col + "," + this.row, this.draw_x, this.draw_y + this.draw_h*0.5);
    }
  };

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
  
  WeightTile.prototype.update = function(dt) {
  };

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return WeightTile;
}();