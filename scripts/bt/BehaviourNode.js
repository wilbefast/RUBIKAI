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
    useful.copy_entries(args, this, [ "parent" ]);

    // globally unique identifier
    this.hash = _next_guid;
    _next_guid++;

    // done
    return this;
  }

  // ------------------------------------------------------------------------------------------
  // ACCESS
  // ------------------------------------------------------------------------------------------
  
  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  BehaviourNode.prototype.update = function(dt) {
    this.current_node.update(dt);      
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return BehaviourNode;
}();