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
// "GO TO NEAREST" ACTION BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------


var ActionNode_GotoNearest = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var ActionNode_GotoNearest = function(args) {
    BehaviourNode.call(this, args);
    // check parameters
    useful.copy_entries(args, this, [ "such_that" ])

    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------

  ActionNode_GotoNearest.prototype.update = function(dt, args) {
    if(!args.path) {
      args.path = astar.get_path_to_any(args.tile, this.such_that);
      args.timer = 0.5;
    }
    else if (args.path.length > 0) {
      args.timer -= dt;
      if(args.timer < 0) {
        var new_tile = args.path.shift();
        if(new_tile.contents) {
          console.warn(new_tile.contents);
        }
        args.set_tile(new_tile);
        args.timer += 0.1;                  
      }
    }
    else {
      args.path = null;
      console.log(this.name, "go to nearest success");
      return BehaviourTree.SUCCESS;
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return ActionNode_GotoNearest;
}();