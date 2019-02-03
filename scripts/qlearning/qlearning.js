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
// Q-LEARNING ALGORITHM
// ----------------------------------------------------------------------------

"use strict"

var qlearning = function() {
  
  var qlearning = {
  };
  
  qlearning.play = function *(args) {
    // unpacks arguments
    const learning_ratio = args.learning_ratio;
    const discount_factor = args.discount_factor;
    const n_episodes = args.n_episodes;
    const game = args.game;
    const max_moves = game.get_max_moves();
    const n_states = game.get_state_count();
    const n_actions = game.get_action_count();
    const verbose = args.verbose;

    // initialise the game
    game.init();
  
    // create the "Q table"
    // this table contains the value of each action for each possible game-state
    var Q = new Array(n_states);
    for(var state = 0; state < n_states; state++) {
      Q[state] = new Array(n_actions);
      for(var action = 0; action < n_actions; action++) {
        // initially our agent feel that no action in any state has any value
        Q[state][action] = 0;
      }
    }

    // avoid allocating too much memory by creating arrays all the time
    var noise = new Array(n_actions);
  
    // create lists to contain total rewards and moves per episode
    var episode_reward = new Array(n_episodes);
    var episode_move_count = new Array(n_episodes);
  
    var episode = 0;
    var finished_learning = false;
    while(true) {
      // reset the gamestate
      var state = game.reset();
      var total_reward = 0;
      var n_moves = 0;

      // take a moment to contemplate life
      if(finished_learning) {
        yield * babysitter.waitForSeconds(0.25);      
      }
      else if(verbose) {
        yield * babysitter.waitForNextFrame(); 
      }
  
      // the Q-table learning algorithm
      var gameover = false;
      while(!gameover && (n_moves++ < max_moves)) {
        // pick the best action based on randomly exploring and exploiting the Q-table
        // we start by exploring a lot, but gradually explore less and exploit Q more
        var exploration_factor = 1.0 / (episode + 1);
        var best_q = -Infinity;
        var best_action = 0;
        for(var action = 0; action < n_actions; action++) {
          var q = Q[state][action] + Math.random()*exploration_factor;
          if(q > best_q) {
            best_action = action;
            best_q = q;
          }
        }
  
        // take the chosen action and find out what happens
        var result = game.take_action(best_action);
        if(finished_learning) {
          yield * babysitter.waitForSeconds(0.1);      
        }
        else if(verbose) {
          yield * babysitter.waitForNextFrame(); 
        }
        var new_state = result.state;
        
        // get (according to Q) the value of the best action given the new state
        var best_q = -Infinity;
        for(var action = 0; action < n_actions; action++) {
          var q = Q[new_state][action]; 
          if(q > best_q) {
            best_q = Q[new_state][action];
          }
        }
        
        // update the Q-Table based on the result of the action and this prediction
        var reward = result.reward;
        var q = Q[state][best_action];
        var new_q = q + learning_ratio*(reward + discount_factor*best_q - q);
        useful.assert(!isNaN(new_q));
        Q[state][best_action] = new_q;
        
        // get ready to start again from the new state
        total_reward += result.reward;
        state = new_state;
        
        // stop if you fall in a hole or reach the objective
        gameover = result.end;
      }
  
      // we track the number of moves and the reward to see whether we're getting better
      episode_reward[episode] = total_reward;
      episode_move_count[episode] = n_moves;
      episode++;

      // have we finished learning?
      if(!finished_learning && episode > n_episodes) {
        // log results
        console.log("Q after learning", Q);
        console.log("Reward for each episode", episode_reward);
        console.log("Move count for each episode", episode_move_count);

        // time to show off our work
        finished_learning = true;
      }

      // take a moment to contemplate life
      if(finished_learning) {
        yield * babysitter.waitForSeconds(0.25);      
      }
      else if(verbose) {
        yield * babysitter.waitForNextFrame(); 
      }
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------
  
  return qlearning;
}();