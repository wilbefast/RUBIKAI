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


  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  SelectorNode.prototype.update = function(dt, args) {
    for(var i = 0; i < this.children.length; i++) {
      var result = this.children[i].update(dt, args);
      useful.assert(result, "Behaviour tree nodes must return a result");      
      if(result === BehaviourTree.SUCCESS) {
        // any success is a success of the selector
        return BehaviourTree.SUCCESS;
      }
      else if (result === BehaviourTree.RUNNING) {
        return BehaviourTree.RUNNING;
      }
    }

    // nothing has worked
    return BehaviourTree.FAILURE;
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return SelectorNode;
}();