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
    this.draw_x = this.grid.draw_x + this.col*this.draw_w;
    this.draw_y = this.grid.draw_y + this.row*this.draw_h;

    // type
    this.tile_type = this.tile_types.free;
    
    // done
    return this;
  }

  Tile.prototype.draw_w = 16;
  Tile.prototype.draw_h = 16;

  //Tile.prototype.DEBUG = true;

  // ------------------------------------------------------------------------------------------
  // TYPES
  // ------------------------------------------------------------------------------------------
  
  Tile.prototype.tile_types = {
    wall : {
      name : "wall",
      is_pathable : false,
      colour : "#003f34"
    },
    free : {
      name : "free",
      is_pathable : true,
      colour : "rgba(0, 0, 0, 0)"      
    },
    open : {
      name : "open",
      is_pathable : false,
      colour : "red"    
    },
    closed : {
      name : "closed",
      is_pathable : false,
      colour : "blue"    
    }
  }

  Tile.prototype.set_type = function(type_name) {
    var tile_type = this.tile_types[type_name];
    if(useful.assert(tile_type, type_name + " must be a valid type")) {
      this.tile_type = tile_type;
    }
  }

  Tile.prototype.is_type = function(type_name) {
    return this.tile_type.name === type_name
  }

  Tile.prototype.is_pathable = function() {
    return this.tile_type.is_pathable;
  }

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
  
  Tile.prototype.draw = function() {

    // fill
    ctx.fillStyle = this.tile_type.colour;
    ctx.fillRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);
    ctx.lineWidth = 1;      

    // outline
    ctx.strokeStyle = "black";    
    if(cursor.tile === this) {
      ctx.lineWidth = 3;
    }
    else {
      ctx.lineWidth = 1;      
    }
    ctx.strokeRect(this.draw_x, this.draw_y, this.draw_w, this.draw_h);      

    if(this.DEBUG) {
      ctx.fillText("" + this.col + "," + this.row, this.draw_x, this.draw_y + this.draw_h*0.5);
    }
  };

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
  
  
  Tile.prototype.update = function(dt) {
  };

  // ------------------------------------------------------------------------------------------
  // QUERY
  // ------------------------------------------------------------------------------------------
  
  var _get_neighbours_from_type = function(tile, type) {
    if(type == "4") {
      return tile.neighbours4;
    }
    else if(type == "8") {
      return tile.neighbours8;
    }
    else if (type === "X" || type === "x" || type === "*") {
      return tile.neighboursX;
    }
    else {
      console.error("Invalid neighbours type, must be 4, 8 or X");
      return nil;
    }
  }

  Tile.prototype.is_neighbour_of = function(type, other) {
    return true;
    var neighbours = _get_neighbours_from_type(this, type);
    for(var i = 0; i < neighbours.length; i++) {
      var n = neighbours[indices[i]];
      if(n && n.index === type.index) {
        return true;
      }
    }    
  }

  Tile.prototype.map_neighbours = function(type, f) {
    var neighbours = _get_neighbours_from_type(this, type);
    
    var indices = [];
    for(var i = 0; i < neighbours.length; i++) {
      indices[i] = i;
    }
    useful.shuffle(indices);

    for(var i = 0; i < indices.length; i++) {
      var n = neighbours[indices[i]];
      if(n) {
        var result = f(n);
        if(result) {
          return result;
        }
      }
    }
  }

  Tile.prototype.any_neighbours = function(type, f) {
    return this.map_neighbours(type, function(n) {
      return f(n);
    });
  }

  Tile.prototype.all_neighbours = function(type, f) {
    return !this.map_neighbours(type, function(n) {
      return !f(n);
    });
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Tile;
}();