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

// This game was taken for the Open AI Gym: https://gym.openai.com/envs/FrozenLake-v0/

// Winter is here. You and your friends were tossing around a frisbee at the park
// when you made a wild throw that left the frisbee out in the middle of the lake.
// The water is mostly frozen, but there are a few holes where the ice has melted.
// If you step into one of those holes, you'll fall into the freezing water.
// At this time, there's an international frisbee shortage, 
// so it's absolutely imperative that you navigate across the lake and retrieve the disc.
// However, the ice is slippery, so you won't always move in the direction you intend.
// The surface is described using a grid like the following
//     SFFF
//     FHFH
//     FFFH
//     HFFG
// S : starting point, safe
// F : frozen surface, safe
// H : hole, fall to your doom
// G : goal, where the frisbee is located
// The episode ends when you reach the goal or fall in a hole.
// You receive a reward of 1 if you reach the goal, and zero otherwise.

"use strict";

// ----------------------------------------------------------------------------
// FROZEN LAKE GAME
// ----------------------------------------------------------------------------

var frozenlake = function() {

  var frozenlake = {
  }

  // ------------------------------------------------------------------------------------------
  // PRIVATE CONSTANTS
  // ------------------------------------------------------------------------------------------

  const _grid_w = 4;
  const _grid_h = 4;
  const _n_states = _grid_w*_grid_h;
  const _n_actions = 4;
  const _max_moves = 99;

  // ------------------------------------------------------------------------------------------
  // PRIVATE VARIABLES
  // ------------------------------------------------------------------------------------------

  var _start_tile;
  var _agent;

  // ------------------------------------------------------------------------------------------
  // PRIVATE FUNCTIONS
  // ------------------------------------------------------------------------------------------

  var _get_state_number = function() {
    return _agent.tile.col + _grid_w*_agent.tile.row;
  }

  // ------------------------------------------------------------------------------------------
  // PUBLIC FUNCTION
  // ------------------------------------------------------------------------------------------
  
  frozenlake.init = function() {
    // create a small grid
    grid = new Grid({
      n_cols : 4,
      n_rows : 4,
      tile_class : Tile,
      tile_draw_w : 128,
      tile_draw_h : 128
    });

    _start_tile = grid.grid_to_tile(0, 0);
    grid.grid_to_tile(1, 1).set_type("hole");
    grid.grid_to_tile(3, 1).set_type("hole");
    grid.grid_to_tile(3, 2).set_type("hole");
    grid.grid_to_tile(0, 3).set_type("hole");
    grid.grid_to_tile(3, 3).set_type("goal");

    _agent = new Agent({
      tile : _start_tile
    })
  }

  frozenlake.reset = function() {
    _agent.set_tile(_start_tile);
    return _get_state_number();
  }

  frozenlake.take_action = function(action_i) {
    var reward = 0;
    var end = false;

    switch(action_i) {
      case 0: _agent.try_move("N"); break;
      case 1: _agent.try_move("S"); break;
      case 2: _agent.try_move("E"); break;
      case 3: _agent.try_move("W"); break;
    }
    
    if(_agent.tile.is_type("goal")) {
      reward = 1;
      end = true;
    }
    else if(_agent.tile.is_type("hole")) {
      end = true;
    }
    
    return {
      state : _get_state_number(),
      reward : reward,
      end : end
    };
  }

  frozenlake.get_max_moves = function() {
    // timeout after 99 moves
    return _max_moves;
  }

  frozenlake.get_state_count = function() {
    // agent can be in each possible position on the grid
    return _n_states;
  }

  frozenlake.get_action_count = function() {
    // agent can attempt to move North, South, East or West
    return _n_actions;
  }

  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return frozenlake;
}();