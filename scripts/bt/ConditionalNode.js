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
    useful.assert(!this.child, "Conditional nodes can only have 1 child");
    this.child = child;
  }

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------

  ConditionalNode.prototype.update = function(dt, args) {
    if(this.predicate()) {
      return this.child.update(dt, args);
    }
    else {
      return BehaviourTree.FAILURE;
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return ConditionalNode;
}();