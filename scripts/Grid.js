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
// GRID CLASS
// ----------------------------------------------------------------------------

var _next_guid = 1;

var Grid = function() {

    // ------------------------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------------------------

    var Grid = function(args) {

      // check parameters
      useful.copy_entries(args, this, [ "n_cols", "n_rows", "tile_class", "tile_draw_w", "tile_draw_h" ]);

      // globally unique identifier
      this.hash = _next_guid;
      _next_guid++;
      
      // rendering
      this.draw_w = this.n_cols*this.tile_draw_w;
      this.draw_h = this.n_rows*this.tile_draw_h;
      this.draw_x = (ctx.canvas.width - this.draw_w)*0.5;
      this.draw_y = (ctx.canvas.height - this.draw_h)*0.5;

      // build tiles
      this.tiles = new Array(this.n_cols * this.n_rows);
      for(var col = 0; col < this.n_cols; col++) {
        for(var row = 0; row < this.n_rows; row++) {
          var tile = new this.tile_class({
            grid : this,
            col : col,
            row : row,
            draw_w : this.tile_draw_w,
            draw_h : this.tile_draw_h
          });
          var index = col + this.n_cols*row; 
          this.tiles[index] = tile;
          tile.hash = index;
        }
      }

      // cache neighbourhoods
      for(var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        if(tile) {
          tile.N = this.grid_to_tile(tile.col, tile.row - 1);
          tile.S = this.grid_to_tile(tile.col, tile.row + 1);
          tile.E = this.grid_to_tile(tile.col + 1, tile.row);
          tile.W = this.grid_to_tile(tile.col - 1, tile.row);
          tile.neighbours4 = [
            tile.N,
            tile.E,
            tile.S,
            tile.W
          ];

          tile.NE = this.grid_to_tile(tile.col + 1, tile.row - 1);
          tile.SE = this.grid_to_tile(tile.col + 1, tile.row + 1);
          tile.NW = this.grid_to_tile(tile.col - 1, tile.row - 1);
          tile.SW = this.grid_to_tile(tile.col - 1, tile.row + 1);
          tile.neighboursX = [
            tile.NE,
            tile.SE,
            tile.SW,
            tile.NW
          ];

          tile.neighbours8 = [
            tile.N,
            tile.NE,
            tile.E,
            tile.SE,
            tile.S,
            tile.SW,
            tile.W,
            tile.NW
          ];
        }
      }

      // done
      return this;
    }
    
    Grid.prototype.clone = function() {
      var clone = new Grid({
        n_cols : this.n_cols,
        n_rows : this.n_rows,
        tile_class : this.tile_class,
        tile_draw_w : this.tile_draw_w,
        tile_draw_h : this.tile_draw_h
      });
      
      for(var i = 0; i < clone.tiles.length; i++) {
        clone.tiles[i].mimic_type_from(this.tiles[i]);
      }

      return clone;
    }

    // ------------------------------------------------------------------------------------------
    // ACCESS
    // ------------------------------------------------------------------------------------------
    
    Grid.prototype.is_valid_grid = function(col, row) {
      return col >= 0 && col < this.n_cols && row >= 0 && row < this.n_rows;
    }
    
    Grid.prototype.pixel_to_tile = function(x, y) {      
      x -= this.draw_x;
      y -= this.draw_y;
      
      return this.grid_to_tile(Math.floor(x / this.tile_draw_w), Math.floor(y / this.tile_draw_h));
    };

    Grid.prototype.grid_to_tile = function(col, row) {
      if(this.is_valid_grid(col, row)) {
        return this.tiles[row*this.n_cols + col];
      }
      else {
        return null;
      }
    }
    
    // ------------------------------------------------------------------------------------------
    // UPDATE
    // ------------------------------------------------------------------------------------------
    
    Grid.prototype.draw = function() {
      for(var i = 0; i < this.tiles.length; i++) {
        this.tiles[i].draw();
      }      
    };
    
    Grid.prototype.update = function(dt) {
      for(var i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update(dt);
      }      
    };
    
    // ------------------------------------------------------------------------------------------
    // QUERY
    // ------------------------------------------------------------------------------------------
    
    Grid.prototype.get_random_tile = function(such_that) {
      var indices = useful.get_random_order(this.tiles.length);
      for(var i = 0; i < indices.length; i++) {
        var tile = this.tiles[indices[i]];
        if(!such_that || such_that(tile)) {
          return tile;
        }
      }

      return null;
    }
    
    Grid.prototype.map = function(f) {
      for(var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        var result = f(tile);
        if(result) {
          return result;
        }
      }
    };

    Grid.prototype.map_coroutine = function*(c) {
      for(var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        var result = yield * c(tile);
        if(result) {
          return result;
        }
      }
    };

    Grid.prototype.map_rectangle = function(start_col, start_row, w, h, f) {
      for(var col = start_col; col < start_col + w; col++) {
        for(var row = start_row; row < start_row + h; row++) {
          var result;
          if(this.is_valid_grid(col, row)) {
            result = f(this.tiles[row*this.n_cols + col], col, row);
          }
          else {
            result = f(null, col, row);
          }

          if(result) {
            return result;
          }
        }
      }
    }

    Grid.prototype.get_most = function(f) {
      var highest_value = -Infinity;
      var highest_value_tile = null;
      var indices = useful.get_random_order(this.tiles.length);

      useful.shuffle(indices);

      for(var i = 0; i < indices.length; i++) {
        var tile = this.tiles[indices[i]];
        var result = f(tile);
        if(result > highest_value) {
          highest_value = result;
          highest_value_tile = tile;
        }
      }
      
      return highest_value_tile;
    };
    
    Grid.prototype.get_least = function(f) {
      var lowest_value = Infinity;
      var lowest_value_tile = null;
      var indices = useful.get_random_order(this.tiles.length);

      useful.shuffle(indices);

      for(var i = 0; i < indices.length; i++) {
        var tile = this.tiles[indices[i]];
        var result = f(tile);
        if(result < lowest_value) {
          lowest_value = result;
          lowest_value_tile = tile;
        }
      }

      return lowest_value_tile;
    };

    Grid.prototype.count = function(f) {
      var count = 0;
      for(var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        if(f(tile)) {
          count++;
        }
      }

      return count;
    };

    // ------------------------------------------------------------------------------------------
    // EXPORT
    // ------------------------------------------------------------------------------------------

    return Grid;
}();