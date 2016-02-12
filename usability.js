function invInfName(){
	found = [];
	for(var i = 0; i < items.length; i++){
		if(items[i].location == 0){
			var item = {}
			item.name = items[i].name;
			item.desc = describeItem(items[i].id);
			found.push(item);
		}
	}
	return found;
}

function checkInventoryName(){
	var found = invInfName();
	if(found.length > 1){
		log(itemsFoundInv + plural);
		var first = true;
		for(var i = 0; i < found.length; i++){
			if(!first){
				log(", ");
			}
			log(found[i].name + ": " + found[i].desc);
		}
	}else if(found.length == 1){
		log(itemsFoundInv + singular + found[0].name + ": " + found[0].desc);
	}else{
		log(noItemsFound);
	}
}

function checkInventory(){
	var found = invInfName();
	if(found.length > 1){
		log(itemsFoundInv + plural);
		var first = true;
		for(var i = 0; i < found.length; i++){
			if(!first){
				log(", ");
			}
			log(found[i].desc);
		}
	}else if(found.length == 1){
		log(itemsFoundInv + singular + found[0].desc);
	}else{
		log(noItemsFound);
	}
}

