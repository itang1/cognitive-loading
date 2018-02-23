// NOTE look ito external-HTML, free-sort packages
// NOTE some script features are not supported in IE8 or earlier versions

/***************************************************
****************************************************
**** PREFERENCES ***********************************
****************************************************
****************************************************/
// The maximum value of the rating scale:
var number_scale = ['1', '2', '3', '4', '5', '6', '7'];
// The message presented along with ratings:
var rating_message = 'How likely is it for a knowledgeable speaker to utter this sentence?';
// The label at the low end of the rating scale:
var rating_easy = 'Very unlikely';
// The label at the high end of the rating scale:
var rating_hard = 'Very likely';
var stimulus_duration = 1100;
var post_trial_gap = 100;
var prompt_on_a_scale = 'On a scale of 1-7, how natural it would be for a knowledgeable person to utter that statement?';

var timeline = [];

var here_we_go = {
  type: 'html-keyboard-response',
  stimulus: 'Here we go...',
  choices: jsPsych.NO_KEYS,
  trial_duration: 1000,
};

var any_key_continue = {
  type: 'html-keyboard-response',
  stimulus: 'Press any key to continue',
};


/***************************************************
****************************************************
**** INSTRUCTIONS **********************************
****************************************************
****************************************************/
var introduction = {
  type: 'instructions',
  pages: [
    'Welcome. In this experiment, you\'ll be reading individual statements on the computer screen and making judgments on them. You will first see a cross in the center of the screen. The cross will disappear and the statement will appear in the center of the screen. Your task is to judge how natural it would be for a knowledgeable person to utter that statement, on a scale of 1 to 7. A rating of 1 means that it is very unlikely for a knowledgeable person to say that sentence, and a rating of 7 means it is very likely.<br/><br/>You will hit a number key between 1 and 7 to record your judgment. If you are unsure, try to pick the best possible answer - we are interested in your honest judgments.<br/><br/>To be able to answer quickly and accurately, you should keep your fingers resting on the number keys. This way you won\'t have to look down at the keys to answer.',

    'There is one more wrinkle.  While you judge each sentence, you will be asked to remember a visual pattern in a grid of squares.  First, you will see the grid with some of the squares turned blue.  You should make an effort to remember which squares are blue.  Next you will see the sentence that you are to judge true or false.  Finally, you will be shown a blank grid and asked to click on the squares that were blue in the pattern. You will be given feedback on how well you did on the grid.<br/><br/>You can take breaks as you need them, but please try to do so after you\'ve entered a grid pattern, before you go on to the next item, when the screen is blank.<br/><br/>If you have any questions about the procedure, ask the experimenter now.',

    'Let\'s try some practice...',
  ],
  show_clickable_nav: true
};

// TODO: enter fullscreen

/***************************************************
****************************************************
**** PRACTICE TRIALS *******************************
****************************************************
****************************************************/
// TODO: prompt on same line as stimulus
var practice_1 = {
  type: 'html-button-response',
  stimulus: 'Some schools are books.',
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  stimulus_debrief: 'It is unlikely that a knowledgeable speaker would say this, so you should give this statement a rating toward the low end of the scale.',
  lower_caption: rating_easy,
  upper_caption: rating_hard,
  post_trial_gap: post_trial_gap,
};

var practice_2 = {
  type: 'html-button-response',
  stimulus: 'All tables are furniture.',
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  stimulus_debrief: 'This is a reasonable thing for a knowledgable speaker to say, so you should give this statement a rating toward the high end of the scale.',
  lower_caption: rating_easy,
  upper_caption: rating_hard,
};

//TODO instruct {For the remaining items, you will see a grid pattern, then you judge the sentence, and then you will be asked to recall the grid pattern you saw.}
var practice_3 = {
  type: 'html-button-response',
  stimulus: 'Some toasters are mammals.',
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  stimulus_debrief: 'You would probably give this statement a rating toward the low end of the scale.',
  lower_caption: rating_easy,
  upper_caption: rating_hard,
};

var practice_4 = {
  type: 'html-button-response',
  stimulus: 'All vegetables are carrots.',
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  stimulus_debrief: 'You would probably give this statement a rating toward the low end of the scale.',
  lower_caption: rating_easy,
  upper_caption: rating_hard,
};

var practice_5 = {
  type: 'html-button-response',
  stimulus: 'Some jewelry are rings.',
  choices: number_scale,
  prompt: prompt_on_a_scale,
  stimulus_duration: stimulus_duration,
  stimulus_debrief: 'You would probably give this statement a rating toward the high end of the scale.',
  lower_caption: rating_easy,
  upper_caption: rating_hard,
};

var end_practice = {
  type: 'instructions',
  pages: [
    'That\'s it for practice.<br/><br/>If you have any questions, ask the experimenter now.<br/><br/>When you are ready to continue, let the experimenter know.',
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

var test_trial = {
    type: 'grid-task',
    stimulus: 'slidie2...',
    choices: jsPsych.NO_KEYS,
};

/***************************************************
****************************************************
**** CONCLUSION ************************************
TODO: core.endExperiment()
****************************************************
***************************************************/
var conclusion = {
  type: 'html-keyboard-response',
  stimulus: 'All done!<br/><br/>Thanks for participating.<br/><br/>Click any key to exit the program.',
  choices: jsPsych.ALL_KEYS,
};


/***************************************************
****************************************************
**** RUN THE EXPERIMENT ****************************
****************************************************
****************************************************/
// timeline.push(introduction);

// timeline.push(practice_1);
// timeline.push(practice_2);
// timeline.push(practice_3);
// timeline.push(practice_4);
// timeline.push(practice_5);

timeline.push(test_trial);

timeline.push(conclusion);



jsPsych.init({
  timeline: timeline,
  // exclusions: {
  //   min_width: 800,
  //   min_height: 600
  // },
  on_finish: function() {
    jsPsych.data.displayData();
  }
});
