// design of item

var testItem = {
	id: 1,
	// id 0 reserved for no item, See action.js
	name: "item",
	base: 1,
	// what status decides the normal look of the item
	normal: {
		root: "this is a key"
	},
	crazy: {
		root: "this is a fish"
	},
	// really basic idea of how the descriptions will work
	// If there isn't a description available for a status it will use the base
	location: 0,
	// null: unplaced, unfindable
	// 0: held
	// location > 0 ⇒ area of that id.
	hiddenInHand: false,
	// Can be hidden in inventory [held]
	// if an item would be hidden, but it is already in inventory it is visible
	hidden: [2, 3],
	// is hidden when status is in this list.
	// 0 always hidden
}

var testItem2 = {
	id: 2,
	// id 0 reserved for no item, See action.js
	name: "item",
	base: 1,
	// what status decides the normal look of the item
	normal: {
		root: "this is a key"
	},
	crazy: {
		root: "this is a fish"
	},
	// really basic idea of how the descriptions will work
	// If there isn't a description available for a status it will use the base
	location: 0,
	// null: unplaced, unfindable
	// 0: held
	// location > 0 ⇒ area of that id.
	hiddenInHand: false,
	// Can be hidden in inventory [held]
	// if an item would be hidden, but it is already in inventory it is visible
	hidden: [2, 3],
	// is hidden when status is in this list.
	// 0 always hidden
}

items.push(testItem);
items.push(testItem2);