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
  
  genetic.play = function *(args) {
    // unpacks arguments
    const game = args.game;
    const verbose = args.verbose;

    while(true) {
      //game.control(Math.random()*2 - 1, Math.random()*2 - 1)
      game.control(keyboard.x, keyboard.y);
      game.update();
      yield * babysitter.waitForNextFrame();      
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return genetic;
}();