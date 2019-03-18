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

  const _get_random_weights = function() {
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

  const _get_child_weights = function(parent_1, parent_2) {
    const weights_1 = parent_1.weights;
    const weights_2 = parent_2.weights;

    const input_to_hidden_1 = weights_1.input_to_hidden;
    const input_to_hidden_2 = weights_2.input_to_hidden;
    var input_to_hidden = new Array(_input_layer_size);
    for(var i = 0; i < _input_layer_size; i++) {
      input_to_hidden[i] = new Array(_hidden_layer_size);
      for(var h = 0; h < _hidden_layer_size; h++) {
        const donor = Math.random() > 0.5 ? input_to_hidden_1 : input_to_hidden_2;
        input_to_hidden[i][h] = donor[i][h];
      }
    }

    const hidden_to_output_1 = weights_1.hidden_to_output;
    const hidden_to_output_2 = weights_2.hidden_to_output;
    var hidden_to_output = new Array(_hidden_layer_size);
    for(var h = 0; h < _hidden_layer_size; h++) {
      hidden_to_output[h] = new Array(_output_layer_size);
      for(var o = 0; o < _output_layer_size; o++) {  
        const donor = Math.random() > 0.5 ? hidden_to_output_1 : hidden_to_output_2;
        hidden_to_output[h][o] = donor[h][o];
      }
    }

    return {
      input_to_hidden : input_to_hidden,
      hidden_to_output : hidden_to_output
    }
  }

  const _get_mutated_weights = function(parent, max_mutation) {
    const parent_weights = parent.weights;

    const parent_input_to_hidden = parent_weights.input_to_hidden;
    var input_to_hidden = new Array(_input_layer_size);
    for(var i = 0; i < _input_layer_size; i++) {
      input_to_hidden[i] = new Array(_hidden_layer_size);
      for(var h = 0; h < _hidden_layer_size; h++) {
        var mutation = (Math.random() - Math.random())*max_mutation;
        var weight = useful.clamp(parent_input_to_hidden[i][h] + mutation, -1, 1);
        input_to_hidden[i][h] = weight;
      }
    }
    
    const parent_hidden_to_output = parent_weights.hidden_to_output;
    var hidden_to_output = new Array(_hidden_layer_size);
    for(var h = 0; h < _hidden_layer_size; h++) {
      hidden_to_output[h] = new Array(_output_layer_size);
      for(var o = 0; o < _output_layer_size; o++) {  
        var mutation = (Math.random() - Math.random())*max_mutation;
        var weight = useful.clamp(parent_hidden_to_output[h][o] + mutation, -1, 1);
        hidden_to_output[h][o] = weight;
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
    const input_to_hidden = args.weights.input_to_hidden;
    const hidden_to_output = args.weights.hidden_to_output;
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

  const _colour_chart_edges = function(solution) {
    // set weights in chart to those we found in our solution
    var input_to_hidden = solution.weights.input_to_hidden;
    var hidden_to_output = solution.weights.hidden_to_output;
    for(var i = 0; i < _input_layer_size; i++) {
      for(var h = 0; h < _hidden_layer_size; h++) {
        var weight = input_to_hidden[i][h];
        var abs_weight = Math.abs(weight);
        cy.chart.$("edge[source = 'input_" + i + "'][target = 'hidden_" + h + "']")
        .style({
          "line-color" : weight > 0 
            ? "rgb(" + weight*255 + ", 0, 0)"
            : "rgb(0, 0, " + (-weight)*255 + ")",
          "width" : abs_weight*abs_weight*abs_weight*6
        });
      }
    }
    for(var h = 0; h < _hidden_layer_size; h++) {
      for(var o = 0; o < _output_layer_size; o++) {
        var weight = hidden_to_output[h][o];
        var abs_weight = Math.abs(weight);
        cy.chart.$("edge[source = 'hidden_" + h + "'][target = 'output_" + o + "']")
        .style({
          "line-color" : weight > 0 
            ? "rgb(" + weight*255 + ", 0, 0)"
            : "rgb(0, 0, " + (-weight)*255 + ")",
          "width" : abs_weight*abs_weight*abs_weight*6
        });
      }
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // PUBLIC CONSTANTS
  // ------------------------------------------------------------------------------------------
  
  genetic.evolve_to_play = function *(args) {
    // unpack arguments
    const game = args.game;
    const verbose = args.verbose;
    const population_size = args.population_size;
    const fitness_threshold_i = Math.floor((1 - args.fitness_threshold)*population_size);
    const number_of_generations = args.number_of_generations;
    const max_run_length = args.max_run_length;
    const max_mutation = args.max_mutation;
    const number_of_runs_to_average = args.number_of_runs_to_average;

    // build the chart to display the graph working
    var state_descriptions = game.get_state_descriptions();
    _build_chart(state_descriptions);

    // create the first ever generation from pure random
    var population = new Array(population_size);
    for(var p = 0; p < population_size; p++) {
      // create a random weights
      var weights = _get_random_weights();

      // run through game with these weights
      var run_length = yield * _get_average_run_length({
        game : game,
        number_of_runs_to_average : 10,
        max_run_length : max_run_length,
        weights : weights
      });

      // save this individual into the population list
      population[p] = {
        weights : weights,
        run_length : run_length
      };
    }

    // sort the first generation
    population.sort(function(a, b) {
      return b.run_length - a.run_length;
    });
    var best = population[0];

    // this first generation is now the previous generation
    var previous_population = population;
    var population = new Array(population_size); 
    for(var g = 1; g < number_of_generations; g++){
      // keep, but mutate, the fittest
      for(var p = 0; p < fitness_threshold_i; p++) {
        // mutate the weights
        var weights = _get_mutated_weights(previous_population[p], max_mutation);

        // run through game with these weights
        var run_length = yield * _get_average_run_length({
          game : game,
          number_of_runs_to_average : number_of_runs_to_average,
          max_run_length : max_run_length,
          weights : weights
        });

        // save this individual into the population list
        population[p] = {
          weights : weights,
          run_length : run_length
        };
      }

      // replace all the others with children of the fittest
      for(var p = fitness_threshold_i; p < population_size; p++) {
        // meet the parents
        var parent_i = p % fitness_threshold_i;
        var parent_1 = previous_population[parent_i];
        useful.assert(parent_1, "parent_1 must be defined");
        useful.assert(parent_1.weights, "parent_1 must have weights defined");
        parent_i = Math.floor(Math.random() * (fitness_threshold_i - 1));
        var parent_2 = previous_population[parent_i];
        useful.assert(parent_2, "parent_2 must be defined");
        useful.assert(parent_2.weights, "parent_2 must have weights defined");

        // create a random weights
        var weights = _get_child_weights(parent_1, parent_2);

        // run through game with these weights
        var run_length = yield * _get_average_run_length({
          game : game,
          number_of_runs_to_average : 10,
          max_run_length : max_run_length,
          weights : weights
        });

        // save this individual into the population list
        population[p] = {
          weights : weights,
          run_length : run_length
        };
      }

      // sort this generation
      population.sort(function(a, b) {
        return b.run_length - a.run_length;
      });

      // print results
      best = population[0];
      console.log("generation", g, "best average run length:", best.run_length);
      if(best.run_length >= max_run_length) {
        console.warn("the run was cut short to prevent a forever loop");
      }

      // swap the array pointers
      var overwrite_me = previous_population;
      previous_population = population;
      population = overwrite_me;

      // pause for dramatic effect
      _colour_chart_edges(best);
      yield * babysitter.waitForNextFrame();
    }

    // run the game with the solution we found
    var stop = false;
    while(!stop) {
      var run_length = yield * _get_run_length({
        game : game,
        weights : best.weights,
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