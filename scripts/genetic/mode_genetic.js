/*
(C) Copyright 2019 William Dyce

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
// GENETIC ALGORITHM FOR "ZOMBIE RUN" GAME
// ----------------------------------------------------------------------------

var mode_genetic = function() {

  var mode_genetic = {
  }

  mode_genetic.init = function() {

    // clean up
    mutex.force_release();    
    objects.clear();
    delete cy.chart;    

    // show cytoscape
    cy.style.display = "initial";    
    var nodes = [];
    var edges = [];
    nodes.push({
      group : "nodes",
      data : {
        id:  "TOTO"
      }
    });
    nodes.push({
      group : "nodes",      
      data : {
        id:  "TATA"
      }
    });
    edges.push({
      group : "edges",      
      data : {
        source : "TOTO",
        target : "TATA"
      }
    });

    cy.chart = cytoscape({
      container: document.getElementById('cytoscape'),
    
      boxSelectionEnabled: false,
      autounselectify: true,

      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10
      },

      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(id)'
          },
        },
      ],
    
      elements: {
        nodes: nodes,
        edges: edges
      },
    }); 
   
    // set random seed, for easier debugging
    Math.seedrandom('So if the infection wipes us all out- that is a return to normality.');

    // no grid is used for this mode
    grid = null;

    // set up the game
    zombierun.init({
      off_x : ctx.canvas.width*0.25,
      draw_w : 512,
      draw_h : 512
    });

    // run the game
    var stop = false;
    babysitter.add(genetic.play, {
      game : zombierun,
      run_count : 1000
    });
  }

  mode_genetic.left_click = function(tile) {
    // left click is not bound to anything
  }

  mode_genetic.right_click = function(tile) {
    // right click is not bound to anything
  }

  mode_genetic.draw = function() {
    zombierun.draw();
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return mode_genetic;
}();
