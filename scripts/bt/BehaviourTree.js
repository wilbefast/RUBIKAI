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
  // RENDERING
  // ------------------------------------------------------------------------------------------

  BehaviourTree.prototype.build_chart = function() {
    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
    
      boxSelectionEnabled: false,
      autounselectify: true,
    
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(id)',
            'text-opacity': 0.5,
            'text-valign': 'center',
            'text-halign': 'right',
            'background-color': '#11479e'
          }
        },
    
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'width': 4,
            'target-arrow-shape': 'triangle',
            'line-color': '#9dbaea',
            'target-arrow-color': '#9dbaea'
          }
        }
      ],
    
      elements: {
        nodes: [
          { data: { id: 'n0' } },
          { data: { id: 'n1' } },
          { data: { id: 'n2' } },
          { data: { id: 'n3' } },
          { data: { id: 'n4' } },
          { data: { id: 'n5' } },
          { data: { id: 'n6' } },
          { data: { id: 'n7' } },
          { data: { id: 'n8' } },
          { data: { id: 'n9' } },
          { data: { id: 'n10' } },
          { data: { id: 'n11' } },
          { data: { id: 'n12' } },
          { data: { id: 'n13' } },
          { data: { id: 'n14' } },
          { data: { id: 'n15' } },
          { data: { id: 'n16' } }
        ],
        edges: [
          { data: { source: 'n0', target: 'n1' } },
          { data: { source: 'n1', target: 'n2' } },
          { data: { source: 'n1', target: 'n3' } },
          { data: { source: 'n4', target: 'n5' } },
          { data: { source: 'n4', target: 'n6' } },
          { data: { source: 'n6', target: 'n7' } },
          { data: { source: 'n6', target: 'n8' } },
          { data: { source: 'n8', target: 'n9' } },
          { data: { source: 'n8', target: 'n10' } },
          { data: { source: 'n11', target: 'n12' } },
          { data: { source: 'n12', target: 'n13' } },
          { data: { source: 'n13', target: 'n14' } },
          { data: { source: 'n13', target: 'n15' } },
        ]
      },
    });    
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