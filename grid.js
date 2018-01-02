var tile_flipped=0;
var which_set=0;
var generated_tile_ids=[];
var user_input_tile_ids=[];
var grid_size=25;
var grid_fill='blue';

var right_answer='Passed';
var almost_answer='Almost';
var wrong_answer='Not quite';
var num_correct=0;
var num_total=0;

var high_loading=6;
var low_loading=3;

var feedback_delay=200;
var reset_delay=2000;

/*
Randomly generates the to-be-remembered pattern
*/
function generate_random_pattern() {
	var i = grid_size,j;
	var loading = high_loading;
	while(generated_tile_ids.length < loading) {

		j = Math.floor(Math.random() *grid_size);
		valuex = 'tile_' + j;
		var index = generated_tile_ids.indexOf(valuex);
		if (index == -1) {
			//	generated_tile_ids.push(j);
			generated_tile_ids.push(valuex);
		}
	}
}

/*
Initializes a new grid, generates new pattern, displays the pattern
*/
function newBoard() {
	var output = '', j;
	tile_flipped = 0;
	for(var i=0; i<25; i++) {
		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;

	generate_random_pattern();

	for(var i=0; i<6; i++){
		//	var ids = 'tile_'+ generated_tile_ids[i];
		var ids = generated_tile_ids[i];
		var tile_1 = document.getElementById(ids);
		tile_1.style.background = grid_fill;
	}
	setTimeout(prepare_board_for_user_input, reset_delay);
}

/*
Initializes a new grid, resets vars, gets user clicks
*/
function prepare_board_for_user_input() {
	var output = '',j;
	tile_flipped = 0;

	user_input_tile_ids = [];
	document.getElementById('board').innerHTML = "";
	//which_set +=1;
	// which_set %= 2;
	// alert(set_one_memory_tile_ids.join("\n"));
	// alert(set_two_memory_tile_ids.join("\n"));


	for (var i = 0; i < 25; i++) {
		// output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;
}

/*
resets all vars
*/
function reset_memory_board(){
	tile_flipped =0;
	generated_tile_ids = [];
	user_input_tile_ids = [];

	//which_set +=1;
	// which_set %= 2;
	// alert(set_one_memory_tile_ids.join("\n"));
	// alert(set_two_memory_tile_ids.join("\n"));

	document.getElementById('board').innerHTML = "";
	newBoard();

}

/*
Checks if user input is right, almost, or wrong
Increments num_correct appropriately
*/
function verify_result() {
	var index, valuex, result=1;

	for (var i = 0; i < 6; i++) {
		valuex = user_input_tile_ids[i];

		//	index = -1;
		index = generated_tile_ids.indexOf(valuex);
		if (index < 0) {
			result = 0;
			break;
		}
	}
	if (result > 0) {
		alert(right_answer);
	} else {
		alert(wrong_answer);
	}
	setTimeout(reset_memory_board, 200);
}

/*
Toggles the tile
*/
function flip(tile){
	var tile_background = tile.style.background;
	if (tile_background == grid_fill) {

		var index = user_input_tile_ids.indexOf(tile.id);

		if (index >=0 ) {
			user_input_tile_ids.splice(index, 1);
			tile_flipped -=1;
			tile.style.background = 'url(tile_bg.jpg) no-repeat';
		}
	} else {
		tile_flipped += 1;
		user_input_tile_ids.push(tile.id);
		tile.style.background = grid_fill;
	}
	if (tile_flipped > 5) {
		// verify_result();
	}
}
