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
// USEFUL FUNCTIONS
// ----------------------------------------------------------------------------

"use strict";

var useful = function() {

  var useful = {};

  useful.rand_in = function(array) {
    return array[Math.floor(Math.random() * (array.length - 1))];
  }

  useful.get_random_order = function(length) {
    var indices = new Array(length);
    for(var i = 0; i < length; i++) {
      indices[i] = i;
    }

    useful.shuffle(indices);

    return indices;
  }  

  useful.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    
    return array;
  }

  useful.assert = function(predicate, message) {
    if(!predicate) {
      console.error(message);
      console.trace();
    }

    return predicate;
  }

  useful.assert_keys_exist = function(object, keys) {
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if(object[key] === undefined) {
        console.error("assertion failed, missing key", key);
      }
    }
  }

  useful.copy_entries = function(source, destination, keys) {
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = source[key];
      if(value === undefined) {
        console.error("assertion failed, missing key", key);
      }
      else {
        destination[key] = value;
      }
    }
  }
  
  useful.clamp = function(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
  
  useful.lerp = function(a, b, amount) {
    useful.clamp(amount, 0, 1)
    return ((1-amount)*a + amount*b);
  }
  
  useful.smoothStep = function(N, x) {
    var _pascalTriangle = function(a, b) {
      var result = 1; 
      for(var i = 0; i < b; i++) {
        result *= (a - i)/(i + 1);
      }

      return result;
    }
  
    x = useful.clamp(x, 0, 1);
    var result = 0;
    for (var n = 0; n <= N; n++) {
      result += (_pascalTriangle(-N - 1, n) * _pascalTriangle(2*N + 1, N - n) * Math.pow(x, N + n + 1));
    }

    return result;
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return useful;
}();
