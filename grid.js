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
		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;
}

function start_test() {
	document.getElementById("Start_Test").disabled = true;
	document.getElementById("Verify_Test").disabled = false;
	// document.getElementById("submit_db").disabled = true;

	generate_random_pattern();

	for(var i=0; i<6; i++) {
		var ids = 'tile_'+ generated_tile_ids[i];
		// var ids = generated_tile_ids[i];
		var tile_1 = document.getElementById(ids);
		tile_1.style.background = grid_fill;
	}
	setTimeout(prepare_board_for_user_input, reset_delay);
}

function test_done(){
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
	var output = '', j;
	tile_flipped = 0;

	user_input_tile_ids = [];
	document.getElementById('board').innerHTML = "";

	for (var i=0; i<grid_size; i++) {
		// output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;
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

/*
Toggles the tile
*/
function flip(tile) {
	var tile_background = tile.style.background;
	var ids = tile.id.slice(5);
	if (tile_background == grid_fill) {
		var index = user_input_tile_ids.indexOf(ids);

		if (index >= 0 ) {
			user_input_tile_ids.splice(index, 1);
			tile_flipped -=1;
			tile.style.background = 'url(tile_bg.jpg) no-repeat';
		}
	} else {
		tile_flipped += 1;
		user_input_tile_ids.push(ids);
		tile.style.background = grid_fill;
	}
	// if (tile_flipped > 5) {
	// 	verify_result();
	// }
}
