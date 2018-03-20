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
// OBJECT MANAGER
// ----------------------------------------------------------------------------

var objects = function() {

  var objects = {
    update_list : [],
    draw_list : []
  }

  // ------------------------------------------------------------------------------------------
  // CREATION
  // ------------------------------------------------------------------------------------------
  
  objects.add = function(object) {
    if(object.draw) {
      objects.draw_list.push(object);
    }
  
    if(object.update) {
      objects.update_list.push(object);
    }
  }

  // ------------------------------------------------------------------------------------------
  // DESTRUCTION
  // ------------------------------------------------------------------------------------------
  
  objects.clear = function() {
    objects.draw_list.length = 0;
    objects.update_list.length = 0;
  }

  // ------------------------------------------------------------------------------------------
  // GAME LOOP
  // ------------------------------------------------------------------------------------------
  
  objects.update = function(dt) {
    var i = 0;
    while(i < objects.update_list.length) {
      var object = objects.update_list[i];
      object.update(dt);
      if(object.purge) {
        objects.update_list.splice(i, 1);
        if(object.on_purge) {
          object.on_purge();
        }
      }
      else
        i++;
    }
  }
  
  objects.draw = function() {
    var i = 0;
    while(i < objects.draw_list.length) {
      var object = objects.draw_list[i];
      object.draw();
      if(object.purge) {
        objects.draw_list.splice(i, 1);
      }
      else {
        i++;
      }
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // MASS OPERATIONS
  // ------------------------------------------------------------------------------------------
  
  objects.map = function(args) {
    if(args.orderBy) {
      objects.update_list.sort(args.orderBy);
    }
  
    var f = args.f;
    for(var i = 0; i < objects.update_list.length; i++) {
      f(objects.update_list[i], i);
    }
  }
  
  objects.any = function(predicate) {
    for(var i = 0; i < objects.update_list.length; i++) {
      if(!predicate || predicate(objects.update_list[i], i))
        return true;
    }
    return false;
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return objects;
}();


