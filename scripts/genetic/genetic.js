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

  const _input_layer_size = 8;
  const _hidden_layer_size = 8;
  const _output_layer_size = 2;

  const _input = new Array(_input_layer_size);
  const _hidden = new Array(_hidden_layer_size);
  const _output = new Array(_output_layer_size);

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

  var genetic = {
  };
  
  genetic.play = function *(args) {
    // unpacks arguments
    const game = args.game;
    const verbose = args.verbose;
    const run_count = args.run_count;

    // play multiple times 
    var best_solution = null;
    var best_solution_run_length = -Infinity;
    for(var r = 0; r < run_count; r++) {
      // create a random solution
      var solution = _create_random_solution();
      var input_to_hidden = solution.input_to_hidden;
      var hidden_to_output = solution.hidden_to_output;

      // restart game play until we die
      game.reset();
      var human_died = false;
      var run_length = 0;
      while(!human_died && run_length < 6000) {
        // first layer: "input"
        game.copy_state_to(_input);
  
        // second layer: "hidden"
        for(var h = 0; h < _hidden_layer_size; h++) {  
          _hidden[h] = 0;
          for(var i = 0; i < _input_layer_size; i++) {
            _hidden[h] += _input[i] * input_to_hidden[i][h];
          }
        }
  
        // third layer: "output"
        for(var o = 0; o < _output_layer_size; o++) {  
          _output[o] = 0;
          for(var h = 0; h < _hidden_layer_size; h++) {
            _output[o] += _hidden[h] * hidden_to_output[h][o];
          }
        }
  
        // the output is used as a virtual joystick
        game.control(_output[0], _output[1]);
  
        // update the game
        var human_died = game.update();
        if(!human_died) {
          run_length++;
          if(run_length > best_solution_run_length) {
            best_solution_run_length = run_length;
            best_solution = solution;
          }
        }
        else {
          console.log("run", r, "length was", run_length);
        }
      }  
    }

    console.log("best run length was", best_solution_run_length);
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return genetic;
}();