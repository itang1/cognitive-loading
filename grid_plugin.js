/*
new plugin for grid task
 */


jsPsych.plugins['grid-task'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'grid-task',
    description: '',
    parameters: {
      // random_pattern: {
      //   type: jsPsych.plugins.parameterType.COMPLEX, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
      //   pretty_name: 'generated_tile_ids',
      //   array: true,
      //   default: undefined,
      //   description: 'The to-be-remembered pattern',
      // },
      // user_pattern: {
      //   type: jsPsych.plugins.parameterType.COMPLEX, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
      //   pretty_name: 'user_input_tile_ids',
      //   array: true,
      //   default: undefined,
      //   description: 'What user thinks the to-be-remembered pattern',
      // },
      grid_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid size',
        array: false,
        default: 25,
        description: 'Number of tiles in grid',
      },
      pattern_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Pattern duration',
        default: 2000,
        description: 'How long to show the to-be-remembered pattern',
      },
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      submit_button: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Submit',
        array: false,
        description: 'Label of the button to submit.'
      },
      start_button: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Start',
        array: false,
        description: 'Label of the button to start.'
      },
      exit_button: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Exit',
        array: false,
        description: 'Label of the button to exit.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
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
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<div style="margin: 100px 0px;">';
    html += '<div>' + trial.stimulus + '</div>';

    html += '<div id="board"> 1 2 3 </div>';


    if (trial.prompt !== null){
      html += trial.prompt;
    }






    var tile_flipped=0;
    var which_set=0;
    var generated_tile_ids=[];
    var user_input_tile_ids=[];
    var grid_size=25;
    var grid_fill='blue';

    var right_answer='Right';
    var almost_answer='Almost';
    var wrong_answer='Wrong';
    var num_correct=0; //score
    var num_total=0;

    var high_loading=6;
    var low_loading=3;

    var feedback_delay=200;
    var reset_delay=1000;

    /*
    Randomly generates the to-be-remembered pattern
    TODO: Only choose cells that haven't been chosen before and are neighbors of
     ones that have been chosen. The first cell is chosen randomly.
    */
    function generate_random_pattern() {
    	var i = grid_size, j;
    	//TODO: loading as param
    	var loading = high_loading;
    	while(generated_tile_ids.length < loading) {
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
    function flip(tile) {
      console.log("in flip");
      var tile_background = tile.style.background;
      var ids = tile.id.slice(5);
      // to unclick
      if (tile_background == grid_fill) {
        var index = user_input_tile_ids.indexOf(ids);

        if (index >= 0 ) {
          user_input_tile_ids.splice(index, 1);
          tile_flipped -=1;
          tile.style.background = '';
        }
      }
      // to click
      else {
        tile_flipped += 1;
        user_input_tile_ids.push(ids);
        tile.style.background = grid_fill;
      }
    }



    /*
    Initializes a new grid, generates new pattern, displays the pattern
    */
    function newBoard() {
    	// console.log("here");
    	var output = '', j;
    	tile_flipped = 0;

    	document.getElementById("Start_Test").disabled = false;
    	document.getElementById("Verify_Test").disabled = true;
    	// document.getElementById("submit_db").disabled = true;

    	for(var i=0; i<25; i++) {
        // NOTE: do not flip here
        	output += '<div id="tile_'+i+'" ></div>';
    	}
    	document.getElementById('board').innerHTML = output;
      // document.getElementById ("tile_1").addEventListener("click", flip(this), false);


    }

// NOTE: if using IE, not supported in IE8 or earlier versions

    function start_test() {

      console.log("starting test");

    	document.getElementById("Start_Test").disabled = true;
    	document.getElementById("Verify_Test").disabled = false;
    	// document.getElementById("submit_db").disabled = true;

    	generate_random_pattern();

      console.log("generated random pattern");

    	for(var i=0; i<6; i++) {
    		var ids = 'tile_'+ generated_tile_ids[i];
    		// var ids = generated_tile_ids[i];
    		var tile_1 = document.getElementById(ids);
    		tile_1.style.background = grid_fill;
    	}

      console.log("colored in selected random tiles");
    	setTimeout(prepare_board_for_user_input, reset_delay);
    }

    function test_done() {
    //	exit the html page
    	document.getElementById("Start_Test").disabled = false;
     	document.getElementById("Verify_Test").disabled = false;
    	// document.getElementById("submit_db").disabled = false;
    	// history.go(-1);
    }

    /*
    Initializes a new grid, resets vars, gets user clicks
    */
    function prepare_board_for_user_input() {
      console.log("preparing board for user input");

    	var output = '', j;
    	tile_flipped = 0;

    	user_input_tile_ids = [];
    	document.getElementById('board').innerHTML = "";

      console.log("waiting for clicks");

    	for (var i=0; i<grid_size; i++) {
    		// output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
        output += '<div id="tile_'+i+'"></div>';
    	}

    	document.getElementById('board').innerHTML = output;

// FIXME flip on click not working
      for (var i=0; i<grid_size; i++) {
        // output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
        // output += '<div id="tile_'+i+'"></div>';
        document.getElementById('tile_'+i+'').addEventListener("click", flip);
      }
      // document.getElementById('board').innerHTML = output;

      // "div"+this.id
    }

    /*
    resets all vars
    */
    function reset_memory_board(){
    	tile_flipped = 0;
    	generated_tile_ids = [];
    	user_input_tile_ids = [];

    	document.getElementById('board').innerHTML = "";
    	newBoard();
    }

    /*
    Checks if user input is right, almost, or wrong
    Increments num_correct and num_total appropriately
    */
    function verify_result() {

    	document.getElementById("Start_Test").disabled = true;
      document.getElementById("Verify_Test").disabled = true;
      // document.getElementById("submit_db").disabled = false;

    	var index, tile_value, num_wrong=0;

    	// count how many of user_input are hits, misses, false alarms
    	var hits=0, false_alarms=0, misses=0;
    	for (var i = 0; i < user_input_tile_ids.length; i++) {
    		tile_value = Number(user_input_tile_ids[i]);
    		// alert(tile_value);
    		index = generated_tile_ids.indexOf(tile_value);

    		if (index < 0) {
    			// alert("false_alarms");
    			false_alarms += 1;
    		} else {
    			// alert("hit");
    			hits += 1;
    		}
    	}
    	misses = generated_tile_ids.length - hits

    	// update scores according to num_wrong
    	// 1 point for correct, 0.5 point for almost, 0 point for wrong
    	// num_wrong = misses + false_alarms; //FIXME scoring scheme--?
    	num_wrong = Math.max(misses, false_alarms);
    	if (num_wrong == 0) {
    		verdict = right_answer;
    		change_score(1);
    	} else if (num_wrong == 1) {
    		verdict = almost_answer;
    		change_score(0.5);
    	} else {
    		verdict = wrong_answer;
    		change_score(0);
    	}
    	alert(verdict + "\nscore: " + num_correct + "\nnum_total: " + num_total);


    	// reset the board
    	setTimeout(reset_memory_board, 200);
    }

    /*
    Increment the num_correct and num_total according to round score
    1 point for correct, 0.5 point for almost, 0 point for wrong
    */
    function change_score(round_score) {
    	num_correct += round_score
    	num_total += 1
    }







    // add submit button

    html += '<input type="button" id="Start_Test" value="Start"/>';
    html += '<input type="button" id="Verify_Test" value="Submit"/>';
    html += '<input type="button" id="Exit" value="Exit"/>';

    // html += '<button id="Start_Test" type="button" onclick ="start_test()">'+trial.start_button+'</button>';
    // html += '<button id="Verify_Test" type="button" onclick="verify_result()">'+trial.submit_button+'</button>';
    // html += '<button id="Exit" type="button" onclick ="test_done()">'+trial.exit_button+'</button>';

    // start_test();
    display_element.innerHTML = html;

    newBoard();
    // start_test();
    // prepare_board_for_user_input();
    document.getElementById ("Start_Test").addEventListener("click", start_test, false);
    document.getElementById ("Verify_Test").addEventListener("click", verify_result, false);
    document.getElementById ("Exit").addEventListener("click", test_done, false);





    var response = {
      rt: null,
      response: null,
      veredict: null,
    };

    // display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
    //   // measure response time
    //   var endTime = (new Date()).getTime();
    //   response.rt = endTime - startTime;
    //   response.response = display_element.querySelector('#jspsych-html-slider-response-response').value;
    //
    //   if(trial.response_ends_trial){
    //     end_trial();
    //   } else {
    //     display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
    //   }
    //
    // });

    function end_trial(){
      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response,
        "stimulus": trial.stimulus
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    // if (trial.stimulus_duration !== null) {
    //   jsPsych.pluginAPI.setTimeout(function() {
    //     display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
    //   }, trial.stimulus_duration);
    // }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
