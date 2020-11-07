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
// 'NEAR BERRY' BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------


var ConditionalNode_NearBerry = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var ConditionalNode_NearBerry = function() {
    ConditionalNode.call(this, {
      name : "near_berry",
      description : "Is near berry?",                        
      parent : main_selector,
      predicate : function() {
        return rabbit.tile.any_neighbours("4", function(n) {
          return n.contents && n.contents.is_berry;
        });
      }
    });

    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // RENDERING
  // ------------------------------------------------------------------------------------------

  ConditionalNode_NearBerry.prototype.style = {
    shape : "diamond"
  };

  // ------------------------------------------------------------------------------------------
  // CHILDREN
  // ------------------------------------------------------------------------------------------

  ConditionalNode_NearBerry.prototype.add_child = function(child) {
    useful.assert(this.children.length == 0, "Conditional nodes can only have 1 child");
    this.children[0] = child;
  }

  ConditionalNode_NearBerry.prototype.map = BehaviourNode.prototype.map;  
  ConditionalNode_NearBerry.prototype.map_children = BehaviourNode.prototype.map_children;  

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------

  ConditionalNode_NearBerry.prototype.update = function(dt, args) {
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

  return ConditionalNode_NearBerry;
}();