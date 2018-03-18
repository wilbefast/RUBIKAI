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
// MUTAL EXCLUSION LOCK
// ----------------------------------------------------------------------------

"use strict";

var mutex = function() {
  
  var mutex = {};

  // in case you're wondering, this is how I do do private fields in Javascript
  var _is_locked = false;
  
  mutex.claim = function*() {
    while(_is_locked) {
      yield * babysitter.waitForNextFrame();     
    }
    _is_locked = true;
  }

  mutex.release = function*() {
    _is_locked = false;
  }

  mutex.is_locked = function() {
    return _is_locked;
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return mutex;
}();