var areas = [];
// area.js
var items = [];
// item.js
var statuses = [];
// list of statuses
var actions = [];
// action.js
var area;
// current area id
var areaState;
// current areaState
var status;

var areaPoint = 1;
var itemPoint = 1;
var actionPoint = 1;

// var noItemsFound = "There are no items of importance here.";
var noItemsFound = "";
var itemsFoundInv = "Held there ";
var itemsFound = "In sight there ";
var plural = "are : ";
var singular = "is a ";

// wraps console.log because consoles don't pass well.
function log(content){
	console.log(content);
}

// descibes the area and available items and actions
function displayArea(areaID){
	if(areaID == null){
		log("Bad areaID");
		return;
	}
	setAreaState(areaID);
	displayActions(areaID, areaState);
	post(describeArea(areaID));
	displayAreaItem(areaID);
	setAreaState(areaID);
	displayAreaMove(areaID);
}

function displayAreaItem(areaID){
	var found = displayItems(areaID);
	if(found.length == 0){
		post(noItemsFound);
	}else if(found.length == 1){
		post(itemsFound + singular + found[0].desc);
	}else{
		var list = "";
		for(var i=0; i<found.length; i++){
			list += found[i].desc;
			if(i != found.length-1 && found.length > 2){
				list += ", ";
			}
			if(i == found.length-2){
				list += "and "
			}
		}
		post(itemsFound + plural);
	}
}

function displayAreaMove(areaID){
	var location = getLocation(areas, areaID);
	if(location != -1){
		var area = areas[location];
		for(var i = 0; i < area.connected.length; i++){
			moveButton(area.connected[i]);
		}
	}
}

function moveButton(connection){
	createButton("#input", connection.description, connection, move, "");
}

function move(connection){
	area = connection.id;
	post(connection.direction);
	refresh();
}

/*
*	areas
*/

// gets the local state of the area
function setAreaState(areaID){
	var location = getLocation(areas, areaID);
	areaState = areas[location].areaState;
}

// finds an area by it's id and calls describe with it
function describeArea(areaID){
	return describeAreaRaw(areaID, status);
}

// with any status
function describeAreaRaw(areaID, statusID){
	var location = getLocation(areas, areaID);
	if(location != -1){
		return describeRaw(areas[location], statusID);
	}
	return "";
}

function describeAreafull(area, statusID, areaState){
	var statusName = statuses[getLocation(statuses, statusID)].name;
	var core = zozo[statusName];
	if(!core){
		core = zozo[statusName];
	}
	var content = core.root;
	content += core.state[areaState];
	return content;
}

/*
*	Item
*/

// finds an item by it's id and calls describe with it
function describeItem(itemID){
	return describeItemRaw(itemID, status);
}

// with any status
function describeItemRaw(itemID, statusID){
	var statusID = parseInt(statusID, 10);
	var location = getLocation(items, itemID);
	if(location != -1){
		if(items[location].hidden.indexOf(0) == -1 && items[location].hidden.indexOf(statusID) == -1){
			return describeRaw(items[location], statusID);
		}
	}
	return "";
}

// finds all items within an area and calls describe with them, 
// returns in object to keep them individual, name and desc
function displayItems(areaID){
	return displayItemsRaw(areaID, status);
}

// with any status
function displayItemsRaw(areaID, statusID){
	found = [];
	for (var i = 0; i < items.length; i++) {
		if(items[i].location == areaID){
			found.push({name: items[i].name, desc: describeRaw(items[i], statusID)});
		}
	}
	return found;
}

// checks to see if the item is in hand
function inHand(itemID){
	var position = getLocation(items, itemID);
	if(items[position].location == 0){
		return true;
	}else{
		return false;
	}
}

/*
*	actions
*/

// finds an item by it's id and calls describe with it
function describeAction(actionID){
	return describeActionRaw(actionID, status);
}

// with any status
function describeActionRaw(actionID, statusID){
	var location = getLocation(actions, actionID);
	if(location != -1){
		return describeRaw(actions[location], statusID);
	}
	return "";
}

function displayActions(areaID, statusID){
	for(var i = 0; i < actions.length; i++){
		var valid = false;
		if(actions[i].status.indexOf(statusID) != -1 || actions[i].status.indexOf(0) != -1){
			if(actions[i].location[0].area == 0){
				valid = true;
			}else{
				for(var j = 0; j < actions[i].location.length; j++){
					if(actions[i].location[j].area == areaID){
						if(actions[i].location[j].state == null){
							valid = itemEvaluation(actions[i].item);
						break;
						}else if(actions[i].location[j].state == areaState){
							valid = itemEvaluation(actions[i].item);
						break;
						}
					}
				}
			}
		}
		if(valid){
			actions[i].perform(actions[i].id);
		}
	}
}

// evaluates if items restrictions are met
function itemEvaluation(itemRestriction){
	var not;
	if(itemRestriction.not){
		not = true;
	}else{
		not = false;
	}
	if(itemRestriction.val == 0){
		// true
		return true;
	}else if(itemRestriction.val == -1){
		// false
		return false;
	}else{
		if((inHand(itemRestriction.val) && !not) || (!inHand(itemRestriction.val) && not)){
			// have item, or don't have the not item
			if(itemRestriction.and){
				// and..
				if(itemEvaluation(itemRestriction.and)){
					// have other item(s)
					return true;
				}else{
					// don't have other item(s)
					return false;
				}
			}else{
				// that's all
				return true;
			}
		}else{
			// don't have item
			if(itemRestriction.or){
				// but..
				if(itemEvaluation(itemRestriction.or)){
					// do have other item(s)
					return true;
				}else{
					// still missing other item(s)
					return false;
				}
			}else{
				// that's all
				return false;
			}
		}
	}
}

/*
*	generics
*/

// gets the location of zozo in an array
function getLocation(array, ID){
	var ID = parseInt(ID, 10)
	for (var i = 0; i < array.length; i++) {
		if(array[i].id == ID){
			return i;
		}else if(array[i].id > ID){
			return -1;
		}
	}
	return -1;
}

// compiles the description for things.
function describe(zozo){
	return describeRaw(zozo, status);
}

// with variable statusID
function describeRaw(zozo, statusID){
	if(zozo.hidden != null){
		if(zozo.hidden.indexOf(status) != -1){
			if(zozo.location == 0){
				if(zozo.hiddenInHand){
					return "";
				}
			}else{
				return "";
			}
		}
	}
	var statusName = statuses[getLocation(statuses, parseInt(statusID, 10))].name;
	var core = zozo[statusName];
	if(!core){
		core = zozo[statusName];
	}
	var content = core.root;
	if(core.state && core.state[areaState]){
		var stateContent = core.state[zozo.areaState];
		if(stateContent != null){
			content += stateContent;
		}
	}
	return content;
}

// allows sorting by id's.
function idSort(a, b) {
	if(a.id < b.id){
		return -1;
	}else if(b.id < a.id){
		return 1;
	}else{
		return 0;
	}
}
