$(document).ready(function() {
	area = 1;
	status = 1;
	setAreaState(area);
	refresh();
});

var status1 = {
	id: 1,
	name: "normal",
	base: 1,
	normal: {
		root: "Doin' O.K."
	}
}

statuses.push(status1);

var nWall = {
	id: 1,
	name: "northWall",
	base: 1,
	areaState: 0,
	normal: {
		root: "This is the north wall. ",
		state: ["There is a locked door in the wall.", "The door is unlocked."]
	},
	connected: 
	[{id: 2, direction: "You turned right.", description: "Turn right."},
	{id: 3, direction: "You turned left.", description: "Turn left."}]
}

var eWall = {
	id: 2,
	name: "eastWall",
	base: 1,
	areaState: 0,
	normal: {
		root: "This is the east wall. "
	},
	connected: 	
	[{id: 4, direction: "You turned right.", description: "Turn right."},
	{id: 1, direction: "You turned left.", description: "Turn left."}]
}

var wWall = {
	id: 3,
	name: "westWall",
	base: 1,
	areaState: 0,
	normal: {
		root: "This is the west wall. "
	},
	connected: 	
	[{id: 1, direction: "You turned right.", description: "Turn right."},
	{id: 4, direction: "You turned left.", description: "Turn left."}]
}

var sWall = {
	id: 4,
	name: "southWall",
	base: 1,
	areaState: 0,
	normal: {
		root: "This is the south wall. ",
		state: ["There is a key on the floor.", "The key has been picked up."]
	},
	connected: 	
	[{id: 3, direction: "You turned right.", description: "Turn right."},
	{id: 2, direction: "You turned left.", description: "Turn left."}]
}

areas.push(nWall);
areas.push(eWall);
areas.push(wWall);
areas.push(sWall);

var item = {
	id: 1,
	name: "key",
	base: 1,
	normal: {
		root: "key"
	},
	location: 4,
	hiddenInHand: false,
	hidden: [0]
}

items.push(item);

function pickUp(data){
	changeStateArea(4, 1);
	addItemToInv(1);
	post("You picked up the key.");
	refresh();
}

var actionPickUp = {
	id: 3,
	name: "Pick Up Key",
	base: 1,
	normal: {
		root: "Pick up the key."
	},
	location: [{area: 4, state: 0}],
	item: {not: true, val: 1},
	status: [0],
	perform: function(id){
		makeButton("Pick up the key.", {}, pickUp, describeAction(id));
	}
}

actions.push(actionPickUp);

function useKey(data){
	var wait = $.Deferred();
	if(getValueArea(1, "areaState") == 0){
		changeStateArea(1, 1);
		post("You unlocked the door.");
	}else{
		changeStateArea(1, 0);
		post("You locked the door. I guess you changed your mind.");
	}
	refresh();
}

var actionKey = {
	id: 1,
	name: "Use Key",
	base: 1,
	normal: {
		root: "Use the key on the door."
	},
	location: [{area: 1}],
	item: {val: 1},
	status: [0],
	perform: function(id){
		makeButton("Use the key.", {}, useKey, describeAction(id));
	}
}

actions.push(actionKey);

function leave(data){
	document.location.href = "https://youtu.be/dQw4w9WgXcQ";
}

var actionExit = {
	id: 2,
	name: "Exit",
	base: 1,
	normal: {
		root: "Leave."
	},
	location: [{area: 1, state: 1}],
	item: {val: 0},
	status: [0],
	perform: function(id){
		makeButton("Leave the room.", {}, leave, describeAction(id));
	}
}

actions.push(actionExit);
