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
// BEHAVIOUR NODE CLASS
// ----------------------------------------------------------------------------


var BehaviourNode = function() {

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var _next_guid = 1;
  var BehaviourNode = function(args) {

    // check parameters
    useful.copy_entries(args, this, [ "parent", "name" ]);
    if(args.update) {
      // custom update
      this.update = args.update;
    }
    
    // add to parent
    this.parent.add_child(this);
    
    // create child list
    this.children = [];

    // globally unique identifier
    this.hash = _next_guid;
    _next_guid++;

    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // CHILDREN
  // ------------------------------------------------------------------------------------------

  BehaviourNode.prototype.add_child = function(child) {
    this.children.push(child);
  }

  BehaviourNode.prototype.map = function(f) {
    f(this);
    for(var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.map(f);
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return BehaviourNode;
}();