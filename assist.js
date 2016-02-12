/*
*	Generics
*/

// wraps the inputs in an object acording to the location api.
function createLocation(areaID, stateList){
	return {area: areaID, stateList};
}

// wraps item id's according to the api. 
function createItemRestriction(itemID){
	return {val: itemID};
}

// adds an and section to an item restriction, in place
function and(restriction, itemID){
	restriction.and = createItemRestriction(itemID);
}

// adds an or section to an item retriction, in place
function or(restriction, itemID){
	restriction.or = createItemRestriction(itemID);
}

// allows item inversion
function not(restriction){
	restriction.not = true;
}

// I really hope people aren't using this, but it could be 'necessary'
function xor(itemID1, itemID2){
	var rest1 = both(itemID1, itemID2);
	var rest2 = both(itemID1, itemID2);
	not(rest1);
	not(rest2.and);
	rest1.or = rest2;
	return rest1;
}

// shouldn't be necessary, but I can see it simplifying things, mostly on language
function both(itemID1, itemID2){
	var rest = createItemRestriction(itemID1);
	and(rest, itemID2);
	return rest;
}

// shouldn't be necessary, but I can see it simplifying things, mostly on language
function either(itemID1, itemID2){
	var rest = createItemRestriction(itemID1);
	or(rest, itemID2);
	return rest;
}

// deMorgan!
function neither(itemID1, itemID2){
	var rest = createItemRestriction(itemID1);
	and(rest, itemID2);
	not(rest);
	not(rest.and);
	return rest;
}

/*
*	Areas
*/

// creates an area and adds it to the list of areas
// @roomName = name of room; @baseStatus = the id of the fallback status for the area;
// @localState = the starting local state for the area; 
// @statusList = list of descriptions of the area acording to status;
// @connectedList = list of objects of where and how the room is connected. see area.js; 
function createArea(roomName, baseStatus, localState, statusList, connectedList){
	var area = createAreaRaw(areaPoint, roomName, baseStatus, 
		localState, statusList, connectedList);
	areaPoint += 1;
	areas.push(area);
}

// gets value from area
function getValueArea(areaID, value){
	var location = getLocation(areas, areaID);
	if(location != -1){
		return areas[location][value];
	}
}

// sets value in area
function setValueArea(areaID, value, data){
	var location = getLocation(areas, areaID);
	if(location != -1){
		areas[location][value] = data;
	}
}

// renames an area, areaID & new name as inputs
function renameArea(areaID, name){
	setValueArea(areaID, "name", name);
}

// changes the local state of the area. areaID and areaState [number] to change to
function changeStateArea(areaID, state){
	setValueArea(areaID, "areaState", state);
}

// sets the status [if it already exists it's overwritten].
function setStatusArea(areaID, status, name){
	setValueArea(areaID, name, status);
}

// sets status according to statusID
function setStatusIDArea(areaID, status, statusID){
	var location = getLocation(statuses, statusID);
	setValueArea(areaID, statuses[location].name, status);
}

//  from area ID, to area ID, path taken on movement, description that will appear on action.
function createPathFull(fromID, toID, direction, description){
	var connection = createConnection(toID, direction, description);
	createPath(fromID, connection);
}

// puts a connection into the list of paths in the fromID
function createPath(fromID, connection){
	var location = getLocation(areas, fromID);
	areas[location].connected.push(connection);
}

// creates a bidirectional path, dir1 desc1 area1 ⇒ area2, dir2 desc2 area2 ⇒ area1
function createBidirectionalPath(area1, area2, dir1, dir2, desc1, desc2){
	createPathFull(area1, area2, dir1, desc1);
	createPathFull(area2, area1, dir2, desc2);
}

function removePathFull(fromID, toID, direction, description){
	var connection = createConnection(toID, direction, description);
	removePath(fromID, connection);
}

// removes a connection, takes the first it sees. 
function removePath(fromID, connection){
	var location = getLocation(areas, fromID);
	for(var i = 0; i < areas[location].connected.length; i++){
		if(areas[location].connected[i].id == connection.id){
			if(areas[location].connected[i].direction.valueOf() == connection.direction.valueOf()){
				if(areas[location].connected[i].description.valueOf() == connection.description.valueOf()){
					areas[location].connected.splice(i, 1);
					break;
				}
			}
		}
	}
}

function removePathRuthless(area1, area2){
	var location = getLocation(areas, area1);
	for(var i = 0; i < areas[location].connected.length; i++){
		if(areas[location].connected[i].id == area2){
			areas[location].connected.splice(i, 1);
			break;
		}
	}
}

// removes a bidirections path, takes the first found on each
function removeBidirectionalPath(area1, area2){
	removePathRuthless(area1, area2);
	removePathRuthless(area2, area1);
}

/*
*	Items
*/

// creates an item and adds it to the list of items
// @itemName = name of the item; @baseStatus = fallback status for the item;
// @statusList = list of descriptions according to status; @location = the location of the item;
// @hiddenInHand = can this item be hidden if it is picked up; @hidden = status ids of when the item is hidden;
function createItem(itemName, baseStatus, statusList, location, hiddenInHand, hidden){
	var item = createItemRaw(itemPoint, itemID, itemName, baseStatus, 
		statusList, location, hiddenInHand, hidden);
	itemPoint += 1;
	items.push(item);
}

// sets the location of the item given to the area given
// takes the item id number and the area ID to set it to
function setItemLocation(itemID, areaID){
	var position = getLocation(items, itemID);
	if(position != -1){
		items[position].location = areaID;
	}
}

// places item of ID given into the inventory
function addItemToInv(itemID){
	setItemLocation(itemID, 0);
}

// fires an item into the void [places it nowhere]
function removeItem(itemID){
	setItemLocation(itemID, null);
}

/*
*	Actions
*/

// creates an action and adds it to the list of actions
// @actionName = name of the actions; @baseStatus = th id of the fallback status for the action
// @statusList = list of the descriptions of the action; @locationList = list of locations where the action can be performed
// @itemRestrictions = object describing the item requirements for an action. @statusList = list of status id's the actions can be performed in;
// @performance = the function the action performs when it is activated.
function createAction(actionName, baseStatus, statusList, locationList, itemRestrictions, statusList, performance){
	var action = createActionRaw(actionPoint, actionID, actionName, baseStatus, 
		statusList, locationList, itemRestrictions, statusList, performance);
	actionPoint += 1;
	actions.push(action);
}

// The idea on this one is to set variables for actions, 
// because they are handed their id in the function call for perform.
function setValueAction(actionID, value, data){
	var location = getLocation(actions, actionID);
	if(location != -1){
		actions[location][value] = data;
	}
}

// For when an action should have a button
function makeButton(name, data, funct, tag){
	createButton("#input", name, data, funct, tag);
}

/*
*	Raws, be very careful with these.
*/
function createAreaRaw(areaID, roomName, baseStatus, localState, statusList, connectedList){
	var area = {};
	area.id = areaID;
	area.name = roomName;
	area.base = baseStatus;
	area.areaState = localState;
	for(var i = 0; i < statusList; i++){
		area[statusList[i].name] = {
			root: statusList[i].root,
			state: statusList[i].state
		}
	}
	area.connected = connectedList;
	return area;
}

function createItemRaw(itemID, itemName, baseStatus, statusList, location, hiddenInHand, hidden){
	var item = {};
	item.id = itemID
	item.name = itemName;
	item.base = baseStatus;
	for(var i = 0; i < statusList; i++){
		item[statusList[i].name] = {
			root: statusList[i].root,
		}
	}
	item.location = location;
	item.hiddenInHand = hiddenInHand;
	item.hidden = hidden;
	return item;
}

function createActionRaw(actionID, actionName, baseStatus, statusList, locationList, itemRestrictions, statusList, performance){
	var action = {};
	action.id = actionID;
	action.name = actionName;
	action.base = baseStatus;
	for(var i = 0; i < statusList; i++){
		action[statusList[i].name] = {
			root: statusList[i].root
		}
	}
	action.location = locationList;
	action.item = itemRestrictions;
	action.status = stateList;
	action.perform = performance;
	// functions in perform have acess to the id of the action along with all global variables.
}

function createConnection(areaID, directionIN, descriptionIN){
	return {id: areaID, direction: directionIN, description: descriptionIN};
}

function setAreaPoint(point){
	areaPoint = point;
}
function setItemPoint(point){
	itemPoint = point;
}
function setActionPoint(point){
	actionPoint = point;
}