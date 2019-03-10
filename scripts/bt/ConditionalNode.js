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
// CONDITIONAL BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------


var ConditionalNode = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var ConditionalNode = function(args) {
    BehaviourNode.call(this, args);
    // check parameters
    useful.copy_entries(args, this, [ "predicate" ])

    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // CHILDREN
  // ------------------------------------------------------------------------------------------

  ConditionalNode.prototype.add_child = function(child) {
    useful.assert(this.children.length == 0, "Conditional nodes can only have 1 child");
    this.children[0] = child;
  }

  ConditionalNode.prototype.map = BehaviourNode.prototype.map;  
  ConditionalNode.prototype.map_children = BehaviourNode.prototype.map_children;  

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------

  ConditionalNode.prototype.update = function(dt, args) {
    if(this.predicate()) {
      var result = this.children[0].update(dt, args);
      useful.assert(result, "Behaviour tree nodes must return a result");
      return this.state = result;
    }
    else {
      this.map_children(function(bt_node) {
        bt_node.state = BehaviourTree.PENDING;
      });
      return this.state = BehaviourTree.FAILURE;
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return ConditionalNode;
}();