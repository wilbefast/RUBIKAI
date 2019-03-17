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

    var keyboard_control = false;
    if(keyboard_control) {
      // player control using the keyboard
      babysitter.add(function*() {
        var reset = true;
        var stop = false;
        var run_length = 0; 
        while(!stop) {  
          if(reset) {
            zombierun.reset();
            if(run_length > 0) {
              console.log("last run had length", run_length);
            }
            run_length = 0;
            reset = false;
          }
          else {
            run_length++;
            zombierun.control(keyboard.x, keyboard.y);
            reset = zombierun.update();
            yield * babysitter.waitForNextFrame();
          }
        }  
      });
    }
    else {
      // run the game
      babysitter.add(genetic.evolve_to_play, {
        game : zombierun,
        run_count : 1000,
        max_run_length : 10000
      });
    }

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
