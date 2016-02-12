var testStatus1 = {
	id: 1,
	name: "normal",
	base: 1,
	normal: {
		root: "normal"
	},
	crazy: {
		root: "weirdo"
	}
}
// 0 restricted for no status for hidden on items/status on action

var testStatus2 = {
	id: 2,
	name: "crazy",
	base: 1,
	normal: {
		root: "weirdo"
	},
	crazy: {
		root: "normal"
	}
}

statuses.push(testStatus1);
statuses.push(testStatus2);
status = 1;