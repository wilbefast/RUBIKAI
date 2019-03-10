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
// SEQUENCE BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------

var SequenceNode = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var SequenceNode = function(args) {
    BehaviourNode.call(this, args);

    // done
    return this;
  }
  SequenceNode.prototype.add_child = BehaviourNode.prototype.add_child;
  SequenceNode.prototype.map = BehaviourNode.prototype.map;
  
  
  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  SequenceNode.prototype.update = function(dt, args) {
    for(var i = 0; i < this.children.length; i++) {
      var result = this.children[i].update(dt, args);
      useful.assert(result, "Behaviour tree nodes must return a result");      
      if(result === BehaviourTree.FAILURE) {
        // any failure is a failure of the sequence
        return this.state = BehaviourTree.FAILURE;
      }
      else if (result === BehaviourTree.RUNNING) {
        return this.state = BehaviourTree.RUNNING;
      }
    }

    // made it to the end
    console.log(this.name, "sequence finished")
    return this.state = BehaviourTree.SUCCESS;
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return SequenceNode;
}();