/**
 * Erweiterungen für die Klasse DataNode
 */

/**
 * Die Methode gibt den Index der aktuelle Instance innerhalb der gleichnamigen Geschwister zurück.
 */
DataNode.prototype.indexOfInstance = function () {
	if (this.instanceCount() == 1) {
		return 0;
	}
	else {
		for (var i = 0; i < this.instanceCount(); i++) {
			if (this.instance(i) === this) {
				return i;
			}
		}
		return -1;
	}
}

/**
 * Rückgabe des Pfadnamen für den aktuellen Knoten
 * @returns {String}
 */
DataNode.prototype.pathName = function () {
	if (this.parent() != null) {
		return this.parent().pathName() + "/" + this._name();
	}
	else {
		return "$" + this._name();
	}
}

DataNode.prototype.each2 = function(actionFunc) {
	for (var i = 0; i < this.instanceCount(); i++) {
		actionFunc(this.instance(i));
	}
};

DataNode.prototype.filter2 = function(filterFunc) {
	var list = new DataNodeList();
	this.each2(function(dataNode) {
		if (filterFunc(dataNode)) {
			list.add(dataNode);
		}
	});
	return list;
};

