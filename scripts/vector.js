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
// VECTOR MATH
// ----------------------------------------------------------------------------


var vector = function() {

  var vector = {}

  vector.len2 = function(x, y) {
    return x*x + y*y;
  }
  
  vector.len = function(x, y) {
    return Math.sqrt(x*x + y*y)
  }
  
  vector.normalise = function(x, y) {
    var l = Math.sqrt(x*x + y*y);
    if (l > 0)
    {
      x = x/l;
      y = y/l;
    }
    return { x : x, y : y, originalLength : l };
  }
  
  vector.dist2 = function(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    return x*x + y*y;
  }
  
  vector.dist = function(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    return Math.sqrt(x*x + y*y);
  }
  
  vector.dot = function(x1, y1, x2, y2) {
    return x1*x2 + y1*y2;
  }
  
  vector.det = function(x1, y1, x2, y2) {
    return x1*y2 - y1*x2;
  }  

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return vector;
}();