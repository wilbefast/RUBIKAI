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
// BEHAVIOUR TREE CLASS
// ----------------------------------------------------------------------------


var BehaviourTree = function() {
  
  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------
  
  var _next_guid = 1;  
  var BehaviourTree = function(args) {
    // check parameters
    useful.copy_entries(args, this, [ ]);

    // globally unique identifier
    this.hash = _next_guid;
    _next_guid++;

    // done
    return this;
  }
    
  BehaviourTree.SUCCESS = 1;
  BehaviourTree.FAILURE = 2;
  BehaviourTree.RUNNING = 3;
  

  // ------------------------------------------------------------------------------------------
  // CHILDREN
  // ------------------------------------------------------------------------------------------

  BehaviourTree.prototype.add_child = function(child) {
    useful.assert(this.root === undefined, "there can only be one root node");
    this.root = child;
  }

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  BehaviourTree.prototype.update = function(dt, args) {
    useful.assert(this.root, "there must be a root node");
    var result = this.root.update(dt, args);  
    useful.assert(result, "Behaviour tree nodes must return a result");
    useful.assert(result === BehaviourTree.SUCCESS || result === BehaviourTree.FAILURE || result === BehaviourTree.RUNNING,
      "The behaviour tree update result can only ever be SUCCESS, FAILURE or RUNNING");    
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return BehaviourTree;
}();