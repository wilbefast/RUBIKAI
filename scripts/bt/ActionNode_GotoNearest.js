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
    useful.copy_entries(args, this, [ "such_that" ]);

    // done
    return this;
  }

  ActionNode_GotoNearest.prototype.map = BehaviourNode.prototype.map;  
  ActionNode_GotoNearest.prototype.map_children = BehaviourNode.prototype.map_children;  
  ActionNode_GotoNearest.prototype.style = BehaviourNode.prototype.style; 

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------

  ActionNode_GotoNearest.prototype.update = function(dt, args) {
    if(this.such_that(args.tile)) {
      delete args.path;
      return this.state = BehaviourTree.SUCCESS; 
    }

    if(!args.path) {
      // No path? Get a new one
      args.path = astar.get_path_to_any(args.tile, this.such_that);
      if(args.path.length <= 0) {
        // couldn't find a new path
        return this.state = BehaviourTree.FAILURE; 
      }
      else {
        args.timer = 0.5;
      }
    }

    if (args.path.length > 0) {
      var path_end = args.path[args.path.length - 1];
      var path_start = args.path[0];
      if(!this.such_that(path_end)) {
        // Invalid path? Get a new one
        args.path = astar.get_path_to_any(args.tile, this.such_that);
        if(args.path.length <= 0) {
          // couldn't find a new path
          return this.state = BehaviourTree.FAILURE; 
        }
        else {
          args.timer = 0.5;
        }
      }
      else {
        args.timer -= dt;
        if(args.timer < 0) {
          args.path.shift();
          args.set_tile(path_start);
          args.timer += 0.1;         
        }
      }
      return this.state = BehaviourTree.RUNNING; 
    }
    else {
      delete args.path;
      console.log(this.name, "go to nearest success");
      return this.state = BehaviourTree.SUCCESS; 
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return ActionNode_GotoNearest;
}();