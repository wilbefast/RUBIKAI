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

// ----------------------------------------------------------------------------
// GENETIC REINFORCEMENT LEARNING
// ----------------------------------------------------------------------------

"use strict"

var genetic = function() {

  var genetic = {
  };

  // ------------------------------------------------------------------------------------------
  // PRIVATE CONSTANTS
  // ------------------------------------------------------------------------------------------

  const _input_layer_size = 10;
  const _hidden_layer_size = 10;
  const _output_layer_size = 2;

  const _input = new Array(_input_layer_size);
  const _hidden = new Array(_hidden_layer_size);
  const _output = new Array(_output_layer_size);

  // ------------------------------------------------------------------------------------------
  // PRIVATE FUNCTIONS
  // ------------------------------------------------------------------------------------------
  
  const _build_chart = function(state_descriptions) {
    
    var nodes = [];
    var edges = [];

    for(var i = 0; i < _input_layer_size; i++) {
      nodes.push({
        group : "nodes",
        data : {
          id: "input_" + i,
          description : state_descriptions[i]
        }
      });
    }
    for(var h = 0; h < _hidden_layer_size; h++) {
      nodes.push({
        group : "nodes",
        data : {
          id: "hidden_" + h,
          description : "hidden_" + h
        }
      });
      for(var i = 0; i < _input_layer_size; i++) {
        edges.push({
          group : "edges",
          data : {
            source: "input_" + i,
            target : "hidden_" + h
          }
        });
      }
    }
    for(var o = 0; o < _output_layer_size; o++) {
      nodes.push({
        group : "nodes",
        data : {
          id: "output_" + o,
          description : o === 0 ? "X" : "Y"
        }
      });
      for(var h = 0; h < _hidden_layer_size; h++) {
        edges.push({
          group : "edges",
          data : {
            source: "hidden_" + h,
            target : "output_" + o
          }
        });
      }
    }

    cy.chart = cytoscape({
      container: document.getElementById('cytoscape'),
    
      boxSelectionEnabled: false,
      autounselectify: true,

      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 100
      },

      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(description)'
          },
        },
      ],
    
      elements: {
        nodes: nodes,
        edges: edges
      },
    }); 
  }

  const _create_random_solution = function() {
    var input_to_hidden = new Array(_input_layer_size);
    for(var i = 0; i < _input_layer_size; i++) {
      input_to_hidden[i] = new Array(_hidden_layer_size);
      for(var h = 0; h < _hidden_layer_size; h++) {
        input_to_hidden[i][h] = 2*Math.random() - 1;
      }
    }
  
    var hidden_to_output = new Array(_hidden_layer_size);
    for(var h = 0; h < _hidden_layer_size; h++) {
      hidden_to_output[h] = new Array(_output_layer_size);
      for(var o = 0; o < _output_layer_size; o++) {  
        hidden_to_output[h][o] = 2*Math.random() - 1;
      }
    }

    return {
      input_to_hidden : input_to_hidden,
      hidden_to_output : hidden_to_output
    }
  }

  const _get_average_run_length = function * (args) {
    var number_of_runs_to_average = args.number_of_runs_to_average;
    var total_length_of_runs = 0;
    for(var r = 0; r < number_of_runs_to_average; r++) {
      total_length_of_runs += yield * _get_run_length(args);
    }
    return total_length_of_runs / number_of_runs_to_average;
  }

  const _get_run_length = function * (args) {
    const game = args.game;
    const max_run_length = args.max_run_length || Infinity;
    const input_to_hidden = args.solution.input_to_hidden;
    const hidden_to_output = args.solution.hidden_to_output;
    const verbose = args.verbose;

    // restart game play until we die
    game.reset();
    var human_died = false;
    var run_length = 0;
    while(!human_died && run_length < max_run_length) {
      // first layer: "input"
      game.copy_state_to(_input);
      if(verbose) {
        for(var i = 0; i < _input_layer_size; i++) {
          var activation = _input[i];
          // colour the graph based on activation
          if(verbose) {
            cy.chart.$("#input_" + i).style({
              "background-color" : activation > 0 
                ? "rgb(" + activation*255 + ", 0, 0)"
                : "rgb(0, 0, " + (-activation)*255 + ")"
            });
          }
        }
      }

      // second layer: "hidden"
      for(var h = 0; h < _hidden_layer_size; h++) {  
        var activation = 0;
        for(var i = 0; i < _input_layer_size; i++) {
          activation += _input[i] * input_to_hidden[i][h];
        }
        activation = useful.clamp(activation, -1, 1);
        _hidden[h] = activation;

        // colour the graph based on activation
        if(verbose) {
          cy.chart.$("#hidden_" + h).style({
            "background-color" : activation > 0 
              ? "rgb(" + activation*255 + ", 0, 0)"
              : "rgb(0, 0, " + (-activation)*255 + ")"
          });
        }
      }

      // third layer: "output"
      for(var o = 0; o < _output_layer_size; o++) {  
        var activation = 0;
        for(var h = 0; h < _hidden_layer_size; h++) {
          activation += _hidden[h] * hidden_to_output[h][o];
        }
        activation = useful.clamp(activation, -1, 1);
        _output[o] = activation;

        // colour the graph based on activation
        if(verbose) {
          cy.chart.$("#output_" + o).style({
            "background-color" : activation > 0 
              ? "rgb(" + activation*255 + ", 0, 0)"
              : "rgb(0, 0, " + (-activation)*255 + ")"
          });
        }
      }

      // the output is used as a virtual joystick
      game.control(_output[0], _output[1]);

      // update the game
      var human_died = game.update();
      if(!human_died) {
        run_length++;
      }

      // pause to render the game state if verbose
      if(verbose) {
        yield * babysitter.waitForNextFrame();
      }
    }
    
    return run_length;
  }
  
  // ------------------------------------------------------------------------------------------
  // PUBLIC CONSTANTS
  // ------------------------------------------------------------------------------------------
  
  genetic.evolve_to_play = function *(args) {
    // unpacks arguments
    const game = args.game;
    const verbose = args.verbose;
    const run_count = args.run_count;
    const max_run_length = args.max_run_length;

    // build the chart to display the graph working
    var state_descriptions = game.get_state_descriptions();
    _build_chart(state_descriptions);
    
    // play multiple times 
    var best_solution = null;
    var best_solution_run_length = -Infinity;
    for(var r = 0; r < run_count; r++) {
      // create a random solution
      var solution = _create_random_solution();

      // run through game with this solution
      var run_length = yield * _get_average_run_length({
        game : game,
        number_of_runs_to_average : 10,
        max_run_length : max_run_length,
        solution : solution
      });

      // check whether the latest run was the best yet
      if(run_length > best_solution_run_length) {
        best_solution_run_length = run_length;
        best_solution = solution;
      }
    }

    // print results
    console.log("best solution of", run_count, "had average length", best_solution_run_length);
    if(best_solution_run_length >= max_run_length) {
      console.warn("the run was cut short to prevent a forever loop");
    }

    // run the game with the solution we found
    var stop = false;
    while(!stop) {
      var run_length = yield * _get_run_length({
        game : game,
        solution : best_solution,
        verbose : true
      });
      console.log("last run had length", run_length);
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return genetic;
}();