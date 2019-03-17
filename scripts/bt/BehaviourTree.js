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
  BehaviourTree.PENDING = 4;
  
  BehaviourTree.styles = [];
  BehaviourTree.styles[BehaviourTree.SUCCESS] = {
    "background-color": "yellow"
  };
  BehaviourTree.styles[BehaviourTree.FAILURE] = {
    "background-color": "red"
  };
  BehaviourTree.styles[BehaviourTree.RUNNING] = {
    "background-color": "navy"
  };
  BehaviourTree.styles[BehaviourTree.PENDING] = {
    "background-color": "silver"
  };

  BehaviourTree.layout = {
    name: 'dagre',
    padding: 0,
    nodeSep: 100
  };   

  // ------------------------------------------------------------------------------------------
  // CHILDREN
  // ------------------------------------------------------------------------------------------

  BehaviourTree.prototype.add_child = function(child) {
    useful.assert(this.root === undefined, "there can only be one root node");
    this.root = child;
  }

  BehaviourTree.prototype.map = function(f) {
    this.root.map(f);
  }

  // ------------------------------------------------------------------------------------------
  // RENDERING
  // ------------------------------------------------------------------------------------------

  BehaviourTree.prototype.build_chart = function(args) {
    useful.assert(!this.chart, "Only 1 chart can exist at a time");

    var hash = args.hash;
    var nodes = [];
    var edges = [];

    this.map(function(bt_node) {
      nodes.push({
        group : "nodes",
        data : {
          id:  bt_node.name + hash,
          description : bt_node.description
        }
      });
      if(bt_node.parent && bt_node.parent.name) {
        edges.push({
          group : "edges",
          data : {
            source : bt_node.parent.name + hash,
            target : bt_node.name + hash
          }
        });
      }
    });

    var chart = cy.chart;
    if(!chart) {
      chart = cytoscape({
        container: document.getElementById('cytoscape'),
      
        boxSelectionEnabled: false,
        autounselectify: true,
      
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(description)'
            }
          },
        ],
      
        elements: {
          nodes: nodes,
          edges: edges
        },
      }); 

      cy.chart = chart;
    }
    else {
      chart.add(nodes);
      chart.add(edges);
    }
    
    this.map(function(bt_node) {
      bt_node.chart_node = chart.$("#" + bt_node.name + hash + "");
    });
    
    this.chart = chart;
    cy.layout = chart.layout(BehaviourTree.layout);      
    cy.layout.run();    
  }

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  BehaviourTree.prototype.update = function(dt, args) {
    // update the model
    useful.assert(this.root, "there must be a root node");
    var result = this.root.update(dt, args);  
    useful.assert(result, "Behaviour tree nodes must return a result");
    useful.assert(result === BehaviourTree.SUCCESS || result === BehaviourTree.FAILURE || result === BehaviourTree.RUNNING,
      "The behaviour tree update result can only ever be SUCCESS, FAILURE or RUNNING");    
  
    // refresh the view
    this.map(function(bt_node) {
      bt_node.chart_node.style(BehaviourTree.styles[bt_node.state]);
      bt_node.chart_node.style(bt_node.style);
    });
  };
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return BehaviourTree;
}();