/**
 * jspsych-html-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["alternate-html-button-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-button-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      stimulus_debrief: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus debrief',
        default: null,
        description: 'Explain how the stimulus should be rated.'
      },
      debrief_duration: { //TODO this shoud be replaced with Next button
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Debrief duration',
        default: 3000,
        description: 'How long to show the debrief.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      lower_caption: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Lower caption',
        default: null,
        description: 'Any content here will be displayed to the left of the buttons.'
      },
      upper_caption: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Upper caption',
        default: null,
        description: 'Any content here will be displayed to the right of the buttons.'
      },
      //TODO: post_trial_gap
      cognitive_loading: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Grid task',
        default: false,
        description: 'Whether or not to do the cognitive loading task'
      },
      loading_magnitude: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Loading magnitude',
        default: null,
        description: '3 for low loading, 4 for high loading.' //TODO ?
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var html = '';

    var tile_flipped=0;
    var generated_tile_ids=[];
    var user_input_tile_ids=[];
    var grid_size=16;
    var grid_fill='blue';

    var num_correct=0; //score
    var num_total=0;

    var rt;
    var end_time;
    var start_time;

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      end_time = Date.now();
      rt = end_time - start_time;
      // response.button = choice;
      // response.rt = rt;


      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      // end trial
      if (trial.stimulus_debrief != null) {

        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#debriefing').style.display = 'block';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-prompt').style.display = 'none';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-rating').style.display = 'none';
        }, 0);

        ////////

        if (trial.cognitive_loading) {
          jsPsych.pluginAPI.setTimeout(function() {
            display_element.querySelector('#board').style.display = 'none';
          }, 0);
          jsPsych.pluginAPI.setTimeout(function() {
            display_element.querySelector('#debriefing').style.display = 'block';
          }, 0);
          console.log("here inline 406");
          setTimeout(prepare_board_for_user_input, trial.debrief_duration);
		 
        } else {
          setTimeout(end_trial, trial.debrief_duration);
        }
        // end_trial();
        // jsPsych.pluginAPI.setTimeout(end_trial, trial.debrief_duration);
      } else {
        //blah FIXME
        end_trial();
      }

    };


    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        // "rt": response.rt,
        // "stimulus": trial.stimulus,
        // "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    /*
    Randomly generates the to-be-remembered pattern
    TODO: Only choose cells that haven't been chosen before and are neighbors of
     ones that have been chosen. The first cell is chosen randomly.
     - we don't have to do that
     - easy pattern- 3x3 grid,  make the pattern a straight line
     - option: hard-code the original patterns, mirrors, and rotations (24 loads total)
          see: xhp paper
          we want to hard code / replicate the original patterns
    */
    function generate_random_pattern() {
      var i = grid_size, j;
      //TODO: loading as param
      while(generated_tile_ids.length < trial.loading_magnitude) {
        j = Math.floor(Math.random() * grid_size);
        // valuex = 'tile_' + j;
        var index = generated_tile_ids.indexOf(j);
        if (index == -1) {
          generated_tile_ids.push(j);
        }
      }
    }

    /*
    Toggles the tile
    */
    function flip() {
      // t.stopPropagation(); //?
      console.log("in flip()");
      var ids = this.id.slice(5);

      if (this.style.background == grid_fill) { // to unclick
        var index = user_input_tile_ids.indexOf(ids);
        if (index >= 0 ) {
          user_input_tile_ids.splice(index, 1);
          tile_flipped -= 1;
          this.style.background = '';
        }
      } else { // to click
        tile_flipped += 1;
        user_input_tile_ids.push(ids);
        this.style.background = grid_fill;
      }
    }


    /*
    Initializes a new grid, generates new pattern, displays the pattern
    */
    function newBoard() {
      // console.log("here");
      var output = '';
      tile_flipped = 0;

      document.getElementById("Verify_Test").disabled = true;

      for(var i=0; i<grid_size; i++) {
        // NOTE: do not ever flip here
          output += '<div id="tile_'+i+'" class="tile"></div>';
      }
      document.getElementById('board').innerHTML = output;
    }


    function start_test() {
      console.log("starting test");
      document.getElementById("Verify_Test").disabled = false;
      generate_random_pattern();
      console.log("generated random pattern");

      for(var i=0; i<trial.loading_magnitude; i++) {
        var ids = 'tile_'+ generated_tile_ids[i];
        var tile = document.getElementById(ids);
        tile.style.background = grid_fill;
        console.log("grid filled the single random tile");
      }

      console.log("colored in selected random tiles");

      setTimeout(do_stimulus_judgement, 1000);
    }

    /*
    Initializes a new grid, resets vars, gets user clicks
    */
    function prepare_board_for_user_input() {
      console.log("preparing board for user input");


      // UNPURGE GRID REMNANTS, PURGE PROMPT AND STIM
      if (trial.cognitive_loading) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#debriefing').style.display = 'none';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#board').style.display = 'block';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#Verify_Test').style.display = 'block';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-prompt').style.display = 'none';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-rating').style.display = 'none';
        }, 0);
      }


      var output = '', j;
      tile_flipped = 0;

      user_input_tile_ids = [];
      // document.getElementById('board').innerHTML = "";

      for (var i=0; i<grid_size; i++) {
        var result = 'tile_' + i;
        output += '<div id="'+ result +'" class="tile"></div>';
      }

      console.log("trying to get board element");
      console.log(output);
      document.getElementById('board').innerHTML = output;

      console.log("waiting for clicks");
      for (var i=0; i<grid_size; i++) {
        var result = 'tile_' + i;
        var tile = document.getElementById(result);
        tile.addEventListener('click', flip);
      }

      document.getElementById ("Verify_Test").addEventListener("click", verify_result, false);
    }


    /*
    Checks if user input is right, almost, or wrong
    Increments num_correct and num_total appropriately
    */
    function verify_result() {

      document.getElementById("Verify_Test").disabled = true;

      var index, tile_value, num_wrong=0;

      // count how many of user_input are hits, misses, false alarms
      var hits=0, false_alarms=0, misses=0;
      for (var i = 0; i < user_input_tile_ids.length; i++) {
        tile_value = Number(user_input_tile_ids[i]);
        index = generated_tile_ids.indexOf(tile_value);

        if (index < 0) {
          false_alarms += 1;
        } else {
          hits += 1;
        }
      }
      misses = generated_tile_ids.length - hits

      // TODO: keep track of hits/misses/falsealarms which is different

      // update scores according to num_wrong
      // 1 point for correct, 0.5 point for almost, 0 point for wrong
      // num_wrong = misses + false_alarms; //FIXME scoring scheme--?
      // no need to keep track of response
      num_wrong = Math.max(misses, false_alarms);
      if (num_wrong == 0) {
        verdict = 'Right';
        change_score(1);
      } else if (num_wrong == 1) {
        verdict = 'Almost';
        change_score(0.5);
      } else {
        verdict = 'Wrong';
        change_score(0);
      }
      alert(verdict + "\nscore: " + num_correct + "\nnum_total: " + num_total);

      end_trial();


    }

    /*
    Increment the num_correct and num_total according to round score
    1 point for correct, 0.5 point for almost, 0 point for wrong
    */
    function change_score(round_score) {
      num_correct += round_score
      num_total += 1
    }


// DEBRIEF STUFF POSSIBLY LOST:
// // the debrief
// html += '<div class="debrief-stimulus">'+trial.stimulus_debrief+'</div>';
// jsPsych.pluginAPI.setTimeout(function() {
//   display_element.querySelector('#debrief-stimulus').style.display = 'none';
// }, 0);




    function do_stimulus_judgement() {

      // PURGE GRID REMNANTS
      if (trial.cognitive_loading) {
        if (trial.stimulus_debrief != null) {
          jsPsych.pluginAPI.setTimeout(function() {
            display_element.querySelector('#debriefing').style.display = 'none';
          }, 0);
        }
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#board').style.display = 'none';
        }, 0);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#Verify_Test').style.display = 'none';
        }, 0);
      }

      // display stimulus
      html += '<div id="jspsych-html-button-response-stimulus">'+trial.stimulus+'</div>';

      //show prompt if there is one
      if (trial.prompt !== null) {
        html += '<div id="jspsych-html-button-response-prompt">'+trial.prompt+'</div>' //trial.prompt;
      }

      //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      html += '<div id="jspsych-html-button-response-rating">';

      if (trial.lower_caption) {
        html += trial.lower_caption;
      }

      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }

      if (trial.upper_caption) {
        html += trial.upper_caption;
      }

      html += '</div>';


      display_element.innerHTML = html;

      // start time
      start_time = Date.now();

      // add event listeners to buttons
      for (var i = 0; i < trial.choices.length; i++) {
        display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
          console.log('for loop');
          after_response(choice);
        });
      }

      // buttons, prompt, and debrief are hidden at start
      if (trial.stimulus_debrief != null) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#debriefing').style.display = 'none';
        }, 0);
      }
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-prompt').style.display = 'none';
      }, 0);
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-rating').style.display = 'none';
      }, 0);

      // store response
      var response = {
        rt: null,
        button: null
      };




      // hide image if timing is set
      if (trial.stimulus_duration !== null) { //TODO stumulus_duration?
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-stimulus').style.display = 'none';
        }, trial.stimulus_duration);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-rating').style.display = 'block';
        }, trial.stimulus_duration);
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-prompt').style.display = 'block';
        }, trial.stimulus_duration);
      }

      console.log("made it this far");

      // NOTE DO NOT DELETE ALTHOUGH THIS IS NOT USED
      // // end trial if time limit is set
      // if (trial.trial_duration !== null) {
      //   jsPsych.pluginAPI.setTimeout(function() {
      //     end_trial();
      //   }, trial.trial_duration);
      // }
    }

    if (trial.stimulus_debrief != null){
      html += '<div id="debriefing">'+trial.stimulus_debrief+'</div>';
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#debriefing').style.display = 'none';
      }, 0);
    }
    if (trial.cognitive_loading) {
      console.log("hello inside trial.cognitive_loading");
      html += '<div id="board"> </div>';
      // display_element.innerHTML = html;


      html += '<input type="button" id="Verify_Test" value="Submit"/>';
	  jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#Verify_Test').style.display = 'none';
      }, 0);

      display_element.innerHTML = html;

      newBoard();
      start_test();
      // document.getElementById ("Verify_Test").addEventListener("click", verify_result, false);
    }

    else {
      console.log("hello no loading this trial");
      do_stimulus_judgement();

    }


  };

  return plugin;
})();
