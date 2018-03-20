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

  // ------------------------------------------------------------------------------------------
  // ACCESS
  // ------------------------------------------------------------------------------------------
  
  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  SequenceNode.prototype.update = function(dt) {
    this.current_node.update(dt);      
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return SequenceNode;
}();