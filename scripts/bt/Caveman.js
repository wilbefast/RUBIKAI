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
// CAVEMAN CLASS
// ----------------------------------------------------------------------------


var Caveman = function() {

  // ------------------------------------------------------------------------------------------
  // BEHAVIOUR TREE
  // ------------------------------------------------------------------------------------------
  
  var _build_behaviour_tree_for = function(caveman) {
    var behaviour_tree = new BehaviourTree({
    });
      var main_selector = new SelectorNode({
        name : "caveman_" + caveman.hash,
        description: "Caveman " + caveman.hash + "'s AI",
        parent : behaviour_tree
      });
        var has_berry = new ConditionalNode({
          name : "has_berry",
          description : "Has berry?",
          parent : main_selector,
          predicate : function() { 
            return caveman.has_berry;
          }
        });
          var go_eat = new SequenceNode({
            name : "go_eat",
            description : "Go eat",
            parent : has_berry
          });
            var go_home = new ActionNode_GotoNearest({
              name : "go_home",
              description : "Go home",              
              parent : go_eat,
              such_that : function(tile) {
                return tile.any_neighbours("4", function(n) {
                  return n.is_type("caveman_home");
                });
              }
            });
            var eat_berry = new BehaviourNode({
              name : "eat_berry",
              description : "Eat berry",                            
              parent : go_eat,
              update : function(dt) {
                if(!caveman.has_berry) {
                  return this.state = BehaviourTree.FAILURE;                    
                }
                else {
                  caveman.progress = (caveman.progress || 0) + dt;
                  if(caveman.progress > 1) {
                    caveman.has_berry = false;
                    delete caveman.progress;
                    console.log("ate berry");
                    return this.state = BehaviourTree.SUCCESS;
                  }
                  else {
                    console.log("caveman eating berry", Math.floor(caveman.progress*100) + "%");
                    return this.state = BehaviourTree.RUNNING;                    
                  }
                }
              }
            });

        var near_berry = new ConditionalNode({
          name : "near_berry",
          description : "Is near berry?",                        
          parent : main_selector,
          predicate : function() {
            return caveman.tile.any_neighbours("4", function(n) {
              return n.contents && n.contents.is_berry;
            });
          }
        });
          var harvest_berry = new BehaviourNode({
            name : "harvest_berry",
            description : "Harvest berry",                          
            parent : near_berry,
            update : function(dt) {
              caveman.progress = (caveman.progress || 0) + dt;
              if(caveman.progress > 1) {
                caveman.tile.map_neighbours("4", function(n) {
                  if(n.contents && n.contents.is_berry) {
                    n.contents.purge = true;
                    caveman.has_berry = true;
                  }
                });
              }
              else {
                console.log("harvesting berry", Math.floor(caveman.progress*100) + "%");
                return this.state = BehaviourTree.RUNNING;                    
              }

              if(caveman.has_berry) {
                console.log("harvested berry");
                delete caveman.path;
                delete caveman.progress;
                return this.state = BehaviourTree.SUCCESS;
              }
              else {
                console.log("failed to harvest berry");                
                return this.state = BehaviourTree.FAILURE;
              }
            }
          });
        var find_berry = new ActionNode_GotoNearest({
          name : "find_berry",
          description : "Find berry",                        
          parent : main_selector,
          such_that : function(tile) {
            return tile.any_neighbours("4", function(n) {
              return n.contents && n.contents.is_berry;
            });
          }
        });

    behaviour_tree.build_chart();
        
    return behaviour_tree;
  }

  // ------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------------------------------------------

  var Caveman = function(args) {
    // call super constructor
    TileObject.call(this, args);

    // create behaviour tree
    this.behaviour_tree = _build_behaviour_tree_for(this);

    // done
    return this;
  }

  Caveman.prototype.set_tile = TileObject.prototype.set_tile; 
  Caveman.prototype.on_purge = TileObject.prototype.on_purge; 

  // ------------------------------------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------------------------------------
    
  Caveman.prototype.update = function(dt) {
    // tick behaviour tree
    this.behaviour_tree.update(dt, this);
  };

  Caveman.prototype.draw = function() {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.draw_x, this.draw_y, 8, 0, 2*Math.PI);
    ctx.fill();

    if(this.has_berry) {
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(this.draw_x, this.draw_y, 4, 0, 2*Math.PI);
      ctx.fill();  
    }
  }
  
  // ------------------------------------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------------------------------------

  return Caveman;
}();