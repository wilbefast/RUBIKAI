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
// KEYBOARD MANAGER
// ----------------------------------------------------------------------------

var _up = false;
var _down = false;
var _left = false;
var _right = false;
var _space = false;
var _enter = false;

var keyboard = function() {
  var keyboard = {
    x : 0,
    y : 0,
    spacePressed : false,
    enterPressed : false,
    allow_input : true
  }

  keyboard.up = function(v) {
    _up = v;
    if(_up && !_down) {
      keyboard.y = -1;
    }
    else if(_down && !_up) {
      keyboard.y = 1;
    }
    else {
      keyboard.y = 0;
    }
  }
  
  keyboard.down = function(v) {
    _down = v;
    if(_up && !_down) {
      keyboard.y = -1;
    }
    else if(_down && !_up) {
      keyboard.y = 1;
    }
    else {
      keyboard.y = 0;
    }
  }

  keyboard.left = function(v) {
    _left = v;
    if(_left && !_right) {
      keyboard.x = -1;
    }
    else if(_right && !_left) {
      keyboard.x = 1;
    }
    else {
      keyboard.x = 0;
    }
  }

  keyboard.right = function(v) {
    _right = v;
    if(_left && !_right) {
      keyboard.x = -1;
    }
    else if(_right && !_left) {
      keyboard.x = 1;
    }
    else {
      keyboard.x = 0;
    }
  }

  keyboard.space = function(v) {
    keyboard.spacePressed = !_space && v;
    _space = v;
  }

  keyboard.enter = function(v) {
    keyboard.enterPressed = !_enter && v;
    _enter = v;
  }

  keyboard.update = function(dt) {
    keyboard.spacePressed = false;
    keyboard.enterPressed = false;
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return keyboard;
}();
