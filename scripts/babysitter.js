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

var babysitter = function() {
  var babysitter = {
    coroutines : []
  }
  
  babysitter.add = function(c, args) {
    // add a new coroutine to be "babysat"
    babysitter.coroutines.push(c(args));
  }
  
  babysitter.clear = function() {
    // remove all the coroutines, start afresh
    babysitter.coroutines.length = 0;
  }
  
  babysitter.countRunning = function() {
    return babysitter.coroutines.length;
  }
  
  babysitter.waitForSeconds = function* (duration_s) {
    var duration_ms = duration_s*1000;
    var start_ms = Date.now();
    var dt = 0.0;
    while(Date.now() - start_ms < duration_ms) {
      dt = yield undefined;
    }
    return dt;
  }

  babysitter.waitForNextFrame = function* () {
    yield undefined;
  }
  
  babysitter.addWaitForSeconds = function(duration_s) {
    babysitter.add(function*(dt) {
      yield * babysitter.waitForSeconds(duration_s);
    })
  }
  
  babysitter.doForSeconds = function* (duration_s, f, onFinish) {
    var duration_ms = duration_s*1000;
    var start_ms = Date.now();
    var dt = 0.0;
    while(Date.now() - start_ms < duration_ms) {
      var t = (Date.now() - start_ms) / duration_ms;
      f(t);
      dt = yield undefined;
    }
    if(onFinish) {
      onFinish();
    }
    return dt;
  }
  
  babysitter.addDoForSeconds = function(duration_s, f, onFinish) {
    babysitter.add(function*(dt) {
      yield * babysitter.doForSeconds(duration_s, f, onFinish);
    })
  }
  
  babysitter.update = function(dt) {
    // this is where I'd really love J. Blow's 'remove' primitive...
    var i = 0;
    while(i < babysitter.coroutines.length) {
      var c = babysitter.coroutines[i];
      // this passes delta-time to the coroutine using Lua magic
      var done = c.next(dt).done;
      // remove any couroutines that have finished
      if(done) {
        babysitter.coroutines.splice(i, 1);
      }
      else {
        i++;
      }
    }
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return babysitter;
}();

