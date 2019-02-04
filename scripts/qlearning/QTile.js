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
// QTILE CLASS
// ----------------------------------------------------------------------------

var QTile = function() {

  var _colours = new Array(256);
  for(var i = 0; i < _colours.length; i++) {
    _colours[i] = "rgb(" + i + "," + i + "," + i + ")";
  }

  var _value_to_colour = function(v) {
    return _colours[Math.floor(v * 255)];
  }

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var QTile = function(args) {

    // check parameters
    useful.copy_entries(args, this, [ "grid", "row", "col", "draw_w", "draw_h" ]);
    
    // rendering
    this.draw_x = this.grid.draw_x + this.col*this.draw_w;
    this.draw_y = this.grid.draw_y + this.row*this.draw_h;
    this.draw_mid_x = this.draw_x + this.draw_w*0.5;
    this.draw_mid_y = this.draw_y + this.draw_h*0.5;
    this.draw_end_x = this.draw_x + this.draw_w;
    this.draw_end_y = this.draw_y + this.draw_h;
    this.action_value = new Array(4);
    this.action_colour = new Array(4);
    
    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // COLOUR
  // ------------------------------------------------------------------------------------------

  QTile.prototype.set_action_value = function(action, value) {
    this.action_value[action] = value;
    this.action_colour[action] = _value_to_colour(value);
  }

  // ------------------------------------------------------------------------------------------
  // DRAW
  // ------------------------------------------------------------------------------------------

  QTile.prototype.draw = function() {

    ctx.fillStyle = "white";        
    ctx.fillRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);
    
    // North
    ctx.fillStyle = this.action_colour[0];            
    ctx.beginPath();
    ctx.moveTo(this.draw_x, this.draw_y);
    ctx.lineTo(this.draw_mid_x, this.draw_mid_y);
    ctx.lineTo(this.draw_end_x, this.draw_y);
    ctx.fill();

    // East
    ctx.fillStyle = this.action_colour[1];            
    ctx.beginPath();
    ctx.moveTo(this.draw_end_x, this.draw_y);
    ctx.lineTo(this.draw_mid_x, this.draw_mid_y);
    ctx.lineTo(this.draw_end_x, this.draw_end_y);
    ctx.fill();

    // South
    ctx.fillStyle = this.action_colour[2];            
    ctx.beginPath();
    ctx.moveTo(this.draw_x, this.draw_end_y);
    ctx.lineTo(this.draw_mid_x, this.draw_mid_y);
    ctx.lineTo(this.draw_end_x, this.draw_end_y);
    ctx.fill();

    // West
    ctx.fillStyle = this.action_colour[3];            
    ctx.beginPath();
    ctx.moveTo(this.draw_x, this.draw_y);
    ctx.lineTo(this.draw_mid_x, this.draw_mid_y);
    ctx.lineTo(this.draw_x, this.draw_end_y);
    ctx.fill();

    if(this.DEBUG) {
      ctx.fillText("" + this.col + "," + this.row, this.draw_x, this.draw_y + this.draw_h*0.5);
    }
  };

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
  
  QTile.prototype.update = function(dt) {
  };

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return QTile;
}();