// design of area;

var testArea1 = {
	id: 1,
	// id 0 reserved for held
	// See item.js/action.js: location
	name: "testRoom",
	base: 1,
	// what status decides the normal look of this area
	areaState: 0,
	// areas have states that are appended to the look
	normal: {
		root: "this is a room, ",
		state: ["everything is upright",
			"everythingisupsidedown"],
	},
	crazy: {
		root: "room is squigly",
		state: ["Q", "R"]
	},
	// really basic idea of how the descriptions will work
	// If there isn't a description available for a status it will use the base
	// connected: [1, 2, 3, 4],
	// id of rooms it's connected to
	// direction: ["You moved North", "...S", "...E", "...W"],
	// What the path is to get there?
	// <You drag yourself up the stairs> [whole thing is direction]
	// adding/removing paths is an action.
	// description: ["Move North", "Move South", "Move East", "Move West"]
	// descriptions of the directions, will appear in the movement button.
	connected: [
		{id: 1, direction: "You moved North", description: "Move North"},
		{id: 2, direction: "You moved South", description: "Move South"},
		{id: 3, direction: "You moved East", description: "Move East"},
		{id: 4, direction: "You moved West", description: "Move West"}
	]
}

var testArea2 = {
	id: 2,
	name: "testRoom2",
	base: 0,
	normal: {root: "this is a room also",
		state: ["everything is upright",
			"everythingisupsidedown"],
	},
	crazy: {
		root: "room is squigly also",
		state: ["Q", "R"]
	},
	areaState: 1,
	connected: [
		{id: 1, direction: "You moved North", description: "Move North"},
		{id: 2, direction: "You moved South", description: "Move South"},
		{id: 3, direction: "You moved East", description: "Move East"},
		{id: 4, direction: "You moved West", description: "Move West"}
	]
}

areas.push(testArea1);
areas.push(testArea2);