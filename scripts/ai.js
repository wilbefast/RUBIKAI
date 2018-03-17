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

// ----------------------------------------------------------------------------
// COROUTINE MANAGER
// ----------------------------------------------------------------------------

"use strict";

var ai = function() {
  var ai = {
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  ai.generate_maze = function*(grid) {

    // set all tiles to "wall"
    yield * grid.mapc(function*(tile) {
      tile.set_type("wall");
      //yield * babysitter.waitForNextFrame();         
    });

    // pick random starting tile
    var start_tile = grid.get_random_tile();
    start_tile.set_type("free");
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return ai;
}();