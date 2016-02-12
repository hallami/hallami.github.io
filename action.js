// design of action

var testAction = {
	id: 0,
	name: "Spin",
	base: 1,
	// what status decides the normal look of the item
	normal: {
		root: "spin in circles"
	},
	crazy: {
		root: "Wheeeeeeeeeeeeeeeeeeee"
	},
	// really basic idea of how the descriptions will work
	// If there isn't a description available for a status it will use the base
	location: [
		{area: 1},
		{area: 2}
	],
	// areas where the location is valid, below for states, area: 0 in first slot for anywhere.
	item: {
		val: 1,
		or: {
			val: 2
		}
	},
	// 1 || 2
	// See below
	status: [0],
	// [-1] cannot be done in any status
	// [0] can be done in any status
	// [1, 2] can be done in statuses with id's 1 & 2
	perform: function(id){
		makeButton("Spin", 
			{area1ID: 1, area2ID: 2,
			direction: "You walk through the hole in the wall",
			description: "Move through hole in the wall",
			post: "You spun a hole in the wall"}, 
			testFunction, 
			describeAction(id)
		);
	}
	// function this action performs
	// make a button if activated,
	// auto perform if the requirements are fulfilled by coming in to the area.
}

function testFunction(data){
	var area1 = getLocation(areas, data.area1ID);
	var area2 = getLocation(areas, data.area2ID);
	var path1 = createConnection(data.area2ID, data.direction, data.description);
	var path2 = createConnection(data.area1ID, data.direction, data.description);
	areas[area1].connected.push(path1);
	areas[area2].connected.push(path2);
	post(data.post);
	refresh();
}

actions.push(testAction);

var actionLocationExample1 = {
	area: 1,
	state: 0
}
// [{area: -1}] cannot be performed;
// [{area: 0}] can be performed anywhere;
// [{area: 1}, {area: 2, state: [1,2]}] 
// can be performed in areas 1 all states or 2 states 1 and 2

var actionItemExample1 = {
	val: 1,
	and: {
		val: 5,
		or: {
			val: 6
		}
	},
	or: {
		not: true,
		val: 2,
		and: {
			val: 4
		},

		or: {
			val: 3
		}
	}

}
// 1 & (5 || 6) || ¬2 & 4 || 3
// val: 0 = True; can always be performed if top
// val: -1 = False; can never be performed if top