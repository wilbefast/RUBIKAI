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
// SELECTOR BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------

var SelectorNode = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var SelectorNode = function(args) {
    BehaviourNode.call(this, args);

    // done
    return this;
  }
  SelectorNode.prototype.add_child = BehaviourNode.prototype.add_child;
  SelectorNode.prototype.map = BehaviourNode.prototype.map;
  SelectorNode.prototype.map_children = BehaviourNode.prototype.map_children;    

  // ------------------------------------------------------------------------------------------
  // RENDERING
  // ------------------------------------------------------------------------------------------

  SelectorNode.prototype.style = {
    shape : "star"
  };

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  SelectorNode.prototype.update = function(dt, args) {
    for(var i = 0; i < this.children.length; i++) {
      var result = this.children[i].update(dt, args);
      useful.assert(result, "Behaviour tree nodes must return a result");      
      if(result === BehaviourTree.SUCCESS) {
        // any success is a success of the selector
        return this.state = BehaviourTree.SUCCESS;
      }
      else if (result === BehaviourTree.RUNNING) {
        while(++i < this.children.length) {
          this.children[i].map(function(bt_node) {
            bt_node.state = BehaviourTree.PENDING;
          })
        }
        return this.state = BehaviourTree.RUNNING;
      }
    }

    // nothing has worked
    return this.state = BehaviourTree.FAILURE;
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return SelectorNode;
}();