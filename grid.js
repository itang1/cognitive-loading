var tile_flipped= 0;
var which_set=0;
var generated_tile_ids=[];
var user_input_tile_ids = [];
var grid_size=25;

function generated_memory_pattern() {
	var i = grid_size,j;
	while(generated_tile_ids.length < 6){

		j = Math.floor(Math.random() *grid_size);
		valuex = 'tile_' + j;
		var index = generated_tile_ids.indexOf(valuex);
		if (index == -1) {
			//	generated_tile_ids.push(j);
			generated_tile_ids.push(valuex);
		}
	}
}


function newBoard() {

	var output = '', j;
	tile_flipped = 0;
	for(var i = 0; i < 25; i++) {
		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;
	generated_memory_pattern();

	for(var i=0; i<6; i++){
		//	var ids = 'tile_'+ generated_tile_ids[i];
		var ids = generated_tile_ids[i];
		var tile_1 = document.getElementById(ids);
		tile_1.style.background = 'blue';

	}
	setTimeout(prepare_board_for_user_input, 2000);

}

function prepare_board_for_user_input() {
	var output = '',j;
	tile_flipped =0;

	user_input_tile_ids = [];
	//which_set +=1;
	// which_set %= 2;
	// alert(set_one_memory_tile_ids.join("\n"));
	// alert(set_two_memory_tile_ids.join("\n"));

	document.getElementById('board').innerHTML = "";


	for(var i = 0; i < 25; i++){

		// output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';

		output += '<div id="tile_'+i+'" onclick="flip(this)"></div>';
	}
	document.getElementById('board').innerHTML = output;
}

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

function verify_result() {
	var index,valuex,result=1;

	for(var i = 0; i < 6; i++){
		valuex = user_input_tile_ids[i];

		//	index = -1;
		index = generated_tile_ids.indexOf(valuex);
		if (index < 0) {
			result = 0;
			break;
		}
	}
	if (result > 0) {
		alert('Test Passed');
	} else {
		alert('Test Failed');
	}
	setTimeout(reset_memory_board, 200);
}

function flip(tile){
	var tile_background = tile.style.background;
	if (tile_background == 'blue') {

		var index = user_input_tile_ids.indexOf(tile.id);

		if (index >=0 ) {
			user_input_tile_ids.splice(index, 1);
			tile_flipped -=1;
			tile.style.background = 'url(tile_bg.jpg) no-repeat';
		}
	} else {
		tile_flipped += 1;
		user_input_tile_ids.push(tile.id);
		tile.style.background = 'blue';
	}
	if (tile_flipped > 5) {
		// verify_result();
	}
}
