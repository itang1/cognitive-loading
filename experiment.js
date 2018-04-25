// NOTE look ito external-HTML, free-sort packages
// NOTE some script features are not supported in IE8 or earlier versions

/***************************************************
****************************************************
**** PREFERENCES ***********************************
****************************************************
****************************************************/
// The maximum value of the rating scale:
var number_scale = ['1', '2', '3', '4', '5', '6', '7'];
var tf_scale = ['True', 'False'];
// The message presented along with ratings:
var prompt_on_a_scale = 'How natural it would be for a knowledgeable person to utter that statement?';
var prompt_likely = 'True or False: It is likely that a knolwedgeabol speaker would utter this sentence.';
//var rating_message = 'How likely is it for a knowledgeable speaker to utter this sentence?';
// The label at the low end of the rating scale:
var rating_easy = 'Very unlikely';
// The label at the high end of the rating scale:
var rating_hard = 'Very likely';

var stimulus_duration = 1100;
var post_trial_gap = 100;


var here_we_go = {
  type: 'html-keyboard-response',
  stimulus: 'Here we go...',
  choices: jsPsych.NO_KEYS,
  trial_duration: 1000,
};

var here_we_go_continue = {
  type: 'html-keyboard-response',
  stimulus: 'Here we go... </br></br></br> Press any key to continue',
};

var any_key_continue = {
  type: 'html-keyboard-response',
  stimulus: 'Press any key to continue',
};

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '+',
  choices: jsPsych.NO_KEYS,
  trial_duration: 500,
};


/***************************************************
****************************************************
**** INSTRUCTIONS **********************************
****************************************************
****************************************************/
var introduction = {
  type: 'instructions',
  pages: [
    'Welcome. In this experiment, you\'ll be reading individual statements on the computer screen and making judgments on them. You will first see a cross in the center of the screen. The cross will disappear and the statement will appear in the center of the screen. Your task is to judge how natural it would be for a knowledgeable person to utter that statement, on a scale of 1 to 7. A rating of 1 means that it is very unlikely for a knowledgeable person to say that sentence, and a rating of 7 means it is very likely.<br/><br/>You will click a number key between 1 and 7 to record your judgment. If you are unsure, try to pick the best possible answer - we are interested in your honest judgments.<br/><br/>To be able to answer quickly and accurately, you should keep your fingers resting on the number keys. This way you won\'t have to look down at the keys to answer.<br/><br/>Press right arrow to continue.',

    'There is one more wrinkle.  While you judge each sentence, you will be asked to remember a visual pattern in a grid of squares.  First, you will see the grid with some of the squares turned blue.  You should make an effort to remember which squares are blue.  Next you will see the sentence that you are to judge true or false.  Finally, you will be shown a blank grid and asked to click on the squares that were blue in the pattern. You will be given feedback on how well you did on the grid.<br/><br/>You can take breaks as you need them, but please try to do so after you\'ve entered a grid pattern, before you go on to the next item, when the screen is blank.<br/><br/>If you have any questions about the procedure, ask the experimenter now.<br/><br/>Press right arrow to continue, left arrow to go back.',

    'Let\'s try some practice...<br/><br/>Press right arrow to continue, left arrow to go back.',
  ],
};

/***************************************************
****************************************************
**** PRACTICE TRIALS *******************************
****************************************************
****************************************************/
var practice_1 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some schools are books.',
  is_practice: true,
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  post_trial_gap: post_trial_gap,
};

var practice_1_debrief = {
  type: 'html-keyboard-response',
  stimulus: 'Some schools are books.</br></br>It is unlikely that a knowledgeable speaker would say this, so you should give this statement a rating toward the low end of the scale.</br></br></br>Press any key to continue',
};

var practice_2 = {
  type: 'alternate-html-button-response',
  stimulus: 'All tables are furniture.',
  is_practice: true,
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
};

var practice_2_debrief = {
  type: 'html-keyboard-response',
  stimulus: 'All tables are furniture.</br></br>This is a reasonable thing for a knowledgable speaker to say, so you should give this statement a rating toward the high end of the scale.</br></br></br>Press any key to continue',
};

var practice_3 = {
  type: 'alternate-html-button-response',
  stimulus: 'All tables are furniture.',
  is_practice: true,
  choices: tf_scale,
  prompt: prompt_likely,
  stimulus_duration: stimulus_duration,
};

var practice_3_debrief = {
  type: 'html-keyboard-response',
  stimulus: 'All tables are furniture.</br></br>The answer to this question was \'True\', because every tabl is a kind of furniture.</br></br></br>Press any key to continue',
};

var instruct_practices_with_grid = {
  type: 'instructions',
  pages: [
    'For the remaining items, you will see a grid pattern, then you judge the sentence, and then you will be asked to recall the grid pattern you saw.<br/><br/>Press right arrow to continue.',
  ]
};

var practice_4 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some toasters are mammals.',
  is_practice: true,
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  cognitive_loading: true,
};

var practice_4_debrief = {
  type: 'html-keyboard-response',
  stimulus: 'Some toasters are mammals.</br></br>You would probably give this statement a rating toward the low end of the scale.</br></br></br>Press any key to continue',
};

var practice_5 = {
  type: 'alternate-html-button-response',
  stimulus: 'All vegetables are carrots.',
  is_practice: true,
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  cognitive_loading: true,
};

var practice_6 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some jewelry are rings.',
  is_practice: true,
  choices: tf_scale,
  prompt: prompt_likely,
  stimulus_duration: stimulus_duration,
  cognitive_loading: true,
};

var instruct_end_practice = {
  type: 'instructions',
  pages: [
    'That\'s it for practice.<br/><br/>If you have any questions, ask the experimenter now.<br/><br/>When you are ready to continue, press the right arrow.',
  ]
};

/***************************************************
****************************************************
**** REAL TRIALS ***********************************
****************************************************
****************************************************/
/*
generate and flash a pattern
sentence judgement
user input pattern
test the user input

calculate and print score
*/

// NOTE: based on VDTRatings4_R_1BH

var trial_1 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some dalmations are dogs.',
  condition: 'condition 1',
  choices: number_scale,
  scale_type: 'number',
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  cognitive_loading: true,
};

var trial_2 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some insects are beetles.',
  condition: 's_t_low',
  choices: number_scale,
  scale_type: 'number',
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  cognitive_loading: true,
  loading_magnitude: 3,
  grid_size: 9,
};

var trial_3 = {
  type: 'alternate-html-button-response',
  stimulus: 'Some hammers are tools.',
  condition: 's_u_low',
  choices: number_scale,
  scale_type: 'number',
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  cognitive_loading: true,
  loading_magnitude: 3,
  grid_size: 9,
};


/***************************************************
****************************************************
**** CONCLUSION ************************************
TODO: core.endExperiment()
****************************************************
***************************************************/
var conclusion = {
  type: 'html-keyboard-response',
  stimulus: 'All done!<br/><br/>Thanks for participating.<br/><br/>Press any key to exit the program.',
  choices: jsPsych.ALL_KEYS,
};


/***************************************************
****************************************************
**** RUN THE EXPERIMENT ****************************
****************************************************
****************************************************/
var timeline = [];

/* enter fullscreen mode */
timeline.push({
  type: 'fullscreen',
  fullscreen_mode: true
});

// TODO: latin square
//TODO probs more efficient way to put fixations

timeline.push(introduction);

timeline.push(fixation);
timeline.push(practice_1);
timeline.push(practice_1_debrief);
timeline.push(any_key_continue);
timeline.push(fixation);
timeline.push(practice_2);
timeline.push(practice_2_debrief);
timeline.push(any_key_continue);
timeline.push(fixation);
timeline.push(practice_3);
timeline.push(practice_3_debrief);
timeline.push(instruct_practices_with_grid);
timeline.push(here_we_go_continue);
timeline.push(fixation);
timeline.push(practice_4);
timeline.push(practice_4_debrief);
timeline.push(any_key_continue);
timeline.push(fixation);
timeline.push(practice_5);
timeline.push(any_key_continue);
timeline.push(fixation);
timeline.push(practice_6);
timeline.push(instruct_end_practice);

timeline.push(here_we_go_continue);

/* real trials */
var trials = [trial_1, trial_2, trial_3];
for (var i = 0; i < trials.length; i++) {
    timeline.push(fixation);
    timeline.push(trials[i]);
    timeline.push(any_key_continue);
}






timeline.push(conclusion);


/* exit fullscreen mode */
timeline.push({
  type: 'fullscreen',
  fullscreen_mode: false
});

/* to run the experiment */

function saveData(name, data){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filename: name, filedata: data}));
}

jsPsych.init({
  timeline: timeline,
  // exclusions: {
  //   min_width: 800,
  //   min_height: 600
  // },
  on_finish: function() {
    jsPsych.data.displayData();
    saveData("experiment_data.csv", jsPsych.data.get().csv()); //TODO should probs use a unique filename each time or else overwritten
  }
});
