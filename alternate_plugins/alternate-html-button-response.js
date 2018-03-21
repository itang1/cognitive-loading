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
      debrief_duration: {
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
        description: 'The cognitive loading task'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    if (trial.cognitive_loading) {
      console.log("hello");
      var html = '<div style="margin: 100px 0px;">';
    }
    // html += '<div>' + trial.stimulus + '</div>';
    // html += '<div id="board"></div>';
    //
    // var output = '';
    //
    // for(var i=0; i<6; i++) {
    //     output += '<div id="tile_'+i+'" class="tile"></div>';
    // }
    // document.getElementById('board').innerHTML = output;





    // display stimulus
    var html = '<div id="jspsych-html-button-response-stimulus">'+trial.stimulus+'</div>';

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
    html += '<div id="jspsych-html-button-response-btngroup">';

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
    var start_time = Date.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // buttons and prompt are hidden at start
    jsPsych.pluginAPI.setTimeout(function() {
      display_element.querySelector('#jspsych-html-button-response-prompt').style.visibility = 'hidden';
    }, 0);
    jsPsych.pluginAPI.setTimeout(function() {
      display_element.querySelector('#jspsych-html-button-response-btngroup').style.visibility = 'hidden';
    }, 0);

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

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
        display_element.innerHTML = '<div class="jspsych-same-different-stimulus">'+trial.stimulus_debrief+'</div>';
        jsPsych.pluginAPI.setTimeout(end_trial, trial.debrief_duration);
      } else {
        end_trial();
      }

    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-btngroup').style.visibility = 'visible';
      }, trial.stimulus_duration);
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-prompt').style.visibility = 'visible';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
