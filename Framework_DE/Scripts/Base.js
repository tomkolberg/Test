/**
 * 
 */

function log(m) {
	Packages.de.kwsoft.logging.LogFactory.getLog("MTextClient").info(m);
}

/**
 * Ausgabe des Pfades eines Knoten in das Log
 */
function printNodePath(node) {
	print(getNodePath(node));
}

/**
 * Ermittlung des Pfades eines Knoten
 * @param node Knoten aus Datenmodell
 * @returns Pfad als Zeichenkette
 */
function getNodePath(node) {
	var s = null;
	while (node != null) {
		if (s == null) s = node._name();
		else s = node._name() + '/' + s;
		node = node.parent();
	} 
	return s;
}

function dataNodeIndexOfInstance(node) {
	if (node == null) {
		return -1;
	}
	else if (node.instanceCount() == 1) {
		return 0;
	}
	else {
		for (var i = 0; i < node.instanceCount(); i++) {
			if (node.instance(i) === node) {
				return i;
			}
		}
		return -1;
	}
	
}

function isValid(node) {
	return node != null && node != undefined;
}

// 3 Funktionen um ein Datenmodell mit seinen Werten zu dumpen als Dokumenttext
// Beispiel um das Datenmodell $Vers zu dumpen: $JS.dumpDataModel($Vers)
// kann auch verwendet werden, um einen Datenmodellknoten mit dem kompletten Dump zu füllen
// Beginn Snippet um Knoten mit Dump zu füllen
// var res = '';
//
//for (dataModel in $document) {
//	res += dumpDataModel($document[dataModel]) + '\r';
//}
//
//res;
// Ende Snippet

/**
 * Duplicates a string n-times.
 * @param {String} str string to duplicate
 * @param {Number} n numer of duplciates
 * @return {String} the duplicated string
 */
function dup(str, n) {
	if (!n) {
		return '';
	}
	res = '';
    for (var i = 0; i < n; i++) {
    	res += str;
    }
    return res;
}
 

/**
 * Returns a tree dump of the given data node
 * 
 * @param {DataNode}
 *            node the node to dump
 * @param {number|null}
 *            the number of spaces to indent the result by, or null when no
 *            indent needed
 * @returns {string} the string dump of the data node tree
 * 
 */
function dumpDataNode(node, indent) {
	if (node!='dummyRole' && node !== undefined && node !== null && node instanceof DataNode) {
		var res = dup(' ', indent) + "_" + node._name();
		if (!(node.valueOf() == '')) {
			res += ' = _' + node.valueOf();
		}
		res += '\r'
        if (!indent) {
        	indent = 0;
		}
		for (var i = 0; i < node.count(); i++) {
			res += dumpDataNode(node.get(i), indent + 4);
		}
		return res;
	}
	return '';
}

function dumpDataModel(node) {
	return dumpDataNode(node);
}


/**
 * Prüfung, ob ein Datenknoten vorhanden und nicht leer ist
 * Prüfung wird für Elementknoten verwendet.
 * @param node
 * @returns {Boolean}
 */
function isEmpty(node) {
	return node == undefined || node == null || node.isEmpty();
}
/**
 * Prüfung ob ein Datenknoten vorhanden ist
 * @param node Datenknoten
 * @returns {Boolean}
 */
function isAbsent(node) {
	return node == undefined || node == null || (node instanceof DataNode && node.isAbsent())
}
/** 
 * Ausführen von Code ohne Berücksichtigung einer eventuellen Exception
 * @param code
 * @returns
 */
function Try(code) {
	try {
		return code;
	}
	catch(err) {}
}


function getValueOf(node) {
	if (node !== undefined && node !== null && node instanceof DataNode) {
		return node.valueOf();
	}
	else {
		for (var i = 1; i < getValueOf.arguments.length - 1; i++) {
			node = getValueOf.arguments[i];
			if (node !== undefined && node !== null && node instanceof DataNode) {
				return node.valueOf();
			}
		}
		return getValueOf.arguments.length > 1 ? getValueOf.arguments[getValueOf.arguments.length - 1] : '';
	}
}
/**
 * Einfügen eines Knoten in das Datenmodell
 * @param intoNode
 * @param asNode
 * @param aValue
 * @returns
 */
function addToModel(intoNode, asNode, aValue) {
	try {
		if (asNode == null || asNode == undefined) {
			print("Fehler beim Einfügen von " + aValue + " als " + getNodePath(asNode) + " in " + getNodePath(intoNode));
			return null;
		}
		var newNode = intoNode.add(asNode, aValue);
		return newNode;
	}
	catch(err) {
		print(err);
		print("Fehler beim Einfügen von " + aValue + " als " + getNodePath(asNode) + " in " + getNodePath(intoNode));
		return null;
	}
}

/**
 * Konvertierungsmethoden
 */
var Convert =  {
		toNumeric: function(value) {
			//print("toNumeric " + value + " " + typeof(value));
			if (typeof(value) == "string") 
			{
				var i = value.indexOf(',');
				var j = value.indexOf('.');
				//print(value + ": " + i + " " + j);
				var r;
				// Annahme: es gibt nur deutsche Formatierung
				if (i >= 0 && i < j)
				{
					r = parseFloat(value.replace(',', ''));
				}
				else if (j < i) 
				{
					r = parseFloat(value.replace('.', '').replace(',', '.'));
				}
				else 
				{
					r = parseFloat(value);
				}
				//print("toNumeric " + value + " => " + r);
				return r;
			}
			else if (typeof(value) == "object") {
				return Convert.toNumeric(value.toString());
			}
			//print(value + " is " + typeof(value));
			return value;
		},
		toDate: function(value) {
			if (typeof(value) == "string") {
				var strDate = value;
				// Standardformat in Deutschland DD.MM.YYYY (bzw. dd.MM.yyyy) annehmen
				var dateParts = strDate.split(".");
				var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
				return date;
			}
			else if (typeof(value) == "object")
			{
				return new Date(value);
			}
			return value;
		},
		toGermanNumberFormat: function(number)
		{
			var sRetVal = "";
			sRetVal = Convert.toNumeric(number).toString();
			sRetVal = sRetVal.replace('.',',');
			return sRetVal;
		}
}


var FW_I18n = {
		getDocumentLanguage: function() {
			if ($document && $document.Metadata && $document.Metadata.DocumentLanguage) return $document.Metadata.DocumentLanguage;
			else return "de";
		},
		toLanguage: function (value) {
			var _value = "" + value; // Ensure javascript string
			if (_value == "") {
				return "de";
			}
			var pos = _value.indexOf("_");
			if (pos > 0) {
				return _value.substr(0, pos).toLowerCase();
			}
			switch(_value) {
				case "GER": return "de";
				case "ENG": return "en";
				case "FRA": return "fr";
				case "ITA": return "it";
				case "SPA": return "es";
				case "NOR": return "no";
				case "SWE": return "se";
				case "DAN": return "da";
				case "CZE": return "cz";
				case "POR": return "pt";
				case "DUT": return "nl";
				case "SVK": return "sk";
				case "HUN": return "hu";
				case "ALB": return "sq";
				case "BAQ": return "BA";
				case "BEL": return "be";
				case "BOS": return "bs";
				case "BUL": return "bg";
				case "CAT": return "ca";
				case "EST": return "et";
//				case "FAO": return "FA";
//				case "GLE": return "GL";
				case "FIN": return "fi";
//				case "GLG": return "GL";
				case "GRC": return "gr";
				case "ICE": return "is";
//				case "KAL": return "KA";
//				case "LAT": return "LA";
//				case "LAV": return "LA";
//				case "LIT": return "LI";
//				case "LTZ": return "LT";
				case "MAC": return "MA";
				case "MLT": return "ML";
				case "MOL": return "md";
				case "POL": return "po";
//				case "ROH": return "RO";
				case "RUM": return "ro";
				case "RUS": return "ru";
//				case "SCC": return "SC";
//				case "SCR": return "SC";
//				case "SLV": return "SL";
				case "SWI": return "SW";
				case "TUR": return "tr";
//				case "UKR": return "UK";
//				case "BRA": return "BR";
				case "NNO": return "NN";
				case "USA": return "en";
//				case "FSW": return "FS";
//				case "ISW": return "IS";				
				default: return _value;
			}
		}
};