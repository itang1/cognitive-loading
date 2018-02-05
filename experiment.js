/*
Preferences
*/
// The maximum value of the rating scale:   TODO: slider response?
var number_scale = ['1', '2', '3', '4', '5', '6', '7'];
// The message presented along with ratings:
var rating_message = 'How likely is it for a knowledgeable speaker to utter this sentence?';
// The label at the low end of the rating scale:
var rating_easy = 'Very unlikely';
// The label at the high end of the rating scale:
var rating_hard = 'Very likely';
// The time allowed to respond a rating
var trial_duration = 2000;


var timeline = [];

var here_we_go = {
  type: 'html-keyboard-response',
  stimulus: 'Here we go...',
  choices: jsPsych.NO_KEYS,
  trial_duration: 1000,
};

var testing_filler = {
  type: 'html-keyboard-response',
  stimulus: 'Testing filler...',
  choices: jsPsych.NO_KEYS,
  trial_duration: 500,
};

/*
Instructions
*/
var introduction = {
  type: 'instructions',
  pages: [
    'Welcome. In this experiment, you\'ll be reading individual statements on the computer screen and making judgments on them. You will first see a cross in the center of the screen. The cross will disappear and the statement will appear in the center of the screen. Your task is to judge how natural it would be for a knowledgeable person to utter that statement, on a scale of 1 to 7. A rating of 1 means that it is very unlikely for a knowledgeable person to say that sentence, and a rating of 7 means it is very likely.<br/><br/>You will hit a number key between 1 and 7 to record your judgment. If you are unsure, try to pick the best possible answer - we are interested in your honest judgments.<br/><br/>To be able to answer quickly and accurately, you should keep your fingers resting on the number keys. This way you won\'t have to look down at the keys to answer.',

    'There is one more wrinkle.  While you judge each sentence, you will be asked to remember a visual pattern in a grid of squares.  First, you will see the grid with some of the squares turned blue.  You should make an effort to remember which squares are blue.  Next you will see the sentence that you are to judge true or false.  Finally, you will be shown a blank grid and asked to click on the squares that were blue in the pattern. You will be given feedback on how well you did on the grid.<br/><br/>You can take breaks as you need them, but please try to do so after you\'ve entered a grid pattern, before you go on to the next item, when the screen is blank.<br/><br/>If you have any questions about the procedure, ask the experimenter now.',

    'Let\'s try some practice...',
  ],
  show_clickable_nav: false
};
// timeline.push(introduction);

/*
Practice trials
*/
// var practice_stimuli = [
//   'Some schools are books.',
//   'All tables are furniture.',
//   'Some toasters are mammals.',
//   'All vegetables are carrots.',
//   'Some jewelry are rings.',
// ];
//
// var practice_stimuli_debrief = [
//   'It is unlikely that a knowledgeable speaker would say this, so you should give this statement a rating toward the low end of the scale.',
//   'This is a reasonable thing for a knowledgable speaker to say, so you should give this statement a rating toward the high end of the scale.',
//   'You would probably give this statement a rating toward the low end of the scale.',
//   'You would probably give this statement a rating toward the low end of the scale.',
//   'You would probably give this statement a rating toward the high end of the scale.',
// ];
//
// if (practice_stimuli.length != practice_stimuli_debrief.length) {
//   console.error('Inconsistent number of practice_stimuli and practice_stimuli_debrief.');
// }
//
// for (i = 0; i < practice_stimuli.length; i++) {
//   timeline.push({
//     type: 'html-keyboard-response',
//     stimulus: practice_stimuli[i],
//     choices: number_scale,
//     prompt: '\nOn a scale of 1-7, how natural it would be for a knowledgeable person to utter that statement?',
//     trial_duration: trial_duration, //TODO: set trial duration?
//   })
//   //TODO: practices 3, 4, 5 have the grid task
//   // instruct {For the remaining items, you will see a grid pattern, then you judge the sentence, and then you will be asked to recall the grid pattern you saw.}
//   // command { Here we go...}
//   timeline.push({
//     type: 'instructions',
//     pages: [practice_stimuli_debrief[i]],
//   })
// };
//
// var end_practice = {
//   type: 'instructions',
//   pages: [
//     'That\'s it for practice.<br/><br/>If you have any questions, ask the experimenter now.<br/><br/>When you are ready to continue, let the experimenter know.',
//   ]
// };
// timeline.push(end_practice);
timeline.push(here_we_go);

/*
Real trials
*/
/*
generate and flash a pattern
sentence judgement
user input pattern
test the user input

calculate and print score
*/
timeline.push(testing_filler);

var trial2 = {
    type: 'grid-task',
    stimulus: 'slidie2...',
    choices: jsPsych.NO_KEYS,
    trial_duration: 10000,
};
timeline.push(trial2);

/*
Conclusion
TODO: core.endExperiment()
*/
var conclusion = {
  type: 'html-keyboard-response',
  stimulus: 'All done!<br/><br/>Thanks for participating.<br/><br/>Click any key to exit the program.',
  choices: jsPsych.ALL_KEYS,
};
timeline.push(conclusion);


/*
run the experiment
*/
jsPsych.init({
  timeline: timeline,
  // experiment_structure: timeline,
  on_finish: function() {
    jsPsych.data.displayData();
  }
});
