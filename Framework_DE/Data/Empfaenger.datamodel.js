/**
 * Supporting functions for partners
 */
load("Scripts\\Base.js");

function translateSalutationToDocLanguage(language, salutationInput){
	var translatedSalutation = "";
	switch (language.toString()) {
	case "en":
		if (salutationInput.toString().slice(0,4) == "Herr") {
			translatedSalutation = "Mr.";
		}
		else if (salutationInput.toString().slice(0,4) == "Frau")
			translatedSalutation = "Mrs.";
		break;
		// in other cases no salutation to support "Dear Tom" e.g.
	case "de":		// fall-thru to default
	default:		// assume mapped salutation from XML is in de - so no change necessary
		translatedSalutation = salutationInput
		break;
	}
	return translatedSalutation;
}

function translateSalutatoryAddressToEn(salutatoryAddress){
	var translation = "";
	var strSalut = salutatoryAddress.toString();
	if (strSalut.slice(0, 4) == "Herr") {
		translation =  " Mr. " + $Partner.Briefanrede.slice(5);
	}
	else if (strSalut.slice(0, 4) == "Frau") {
		translation =  "Mrs. " + strSalut.slice(5);
	}
	else if (strSalut.slice(0, 19) == "Sehr geehrter Herr ") {
		translation = "Dear Mr. " + strSalut.slice(19);
	}
	else if (strSalut.slice(0, 18) == "Sehr geehrte Frau ") {
		translation = "Dear Mrs. " + strSalut.slice(18);
	}	
	else if (strSalut.slice(0, 10) == "Moin Herr ") {
		translation = "Good Morning Mr. " + strSalut.slice(9);
	}
	else if (strSalut.slice(0, 10) == "Moin Frau ") {
		translation = "Good Morning Mrs. " + strSalut.slice(9);
	}		
	else if (strSalut.slice(0, 6) == "Hallo ") {
		translation = salutatoryAddress;
	}	
	else {
		translation = "Dear " + salutatoryAddress;
	}	
	return translation; 
}

function deriveSalutatoryAddress($Partner, $documentLanguage) 
{
	print("in deriveSalutatoryAddress");
	var language = FW_I18n.toLanguage($documentLanguage); 
	
	if (language == "de")
	{
		if (!$Partner.Briefanrede || $Partner.Briefanrede.isAbsent() || $Partner.Briefanrede.isEmpty()) {
			if (!$Partner.Anrede || $Partner.Anrede.isAbsent() || $Partner.Anrede.isEmpty() || $Partner.Anrede == "Firma") {
				return "Sehr geehrte Damen und Herren";
			} 
			else {
				var name = "Sehr geehrte";
				if (("" + $Partner.Anrede).slice(0, 4) == "Herr") {
					name = name + "r Herr";
				}
				else if (("" + $Partner.Anrede).slice(0, 4) == "Frau") {
					name = name + " Frau";
				}
				if ($Partner.Titel && !$Partner.Titel.isEmpty()) {
					name = name + " " + $Partner.Titel;
				}
				return name + " " + $Partner.Nachname;
			}
		} 
		else if (("" + $Partner.Briefanrede).slice(0, 4) == "Herr") {
			return "Sehr geehrter " + $Partner.Briefanrede;
		}
		else if (("" + $Partner.Briefanrede).slice(0, 4) == "Frau") {
			return "Sehr geehrte " + $Partner.Briefanrede;
		}
		else if (("" + $Partner.Briefanrede).slice(0, 4) == "Sehr" || ("" + $Partner.Briefanrede).slice(0, 4) == "Hall") {
			return $Partner.Briefanrede;
		}
		else {
			return "Sehr geehrte(r) " + $Partner.Briefanrede;
		}
	}
	else if (language == "en")
	{
		print ("en");
		if (!$Partner.Briefanrede || $Partner.Briefanrede.isAbsent() || $Partner.Briefanrede.isEmpty()) {
			if (!$Partner.Anrede || $Partner.Anrede.isAbsent() || $Partner.Anrede.isEmpty() || $Partner.Anrede == "Company") {
				return "Dear Ladies and Gentlemen";
			} 
			else 
			{
				print ("Partner.Salutation in Spool " + $Partner.Anrede + " " + $Partner.Nachname);
				var transSalutation = translateSalutationToDocLanguage(language, $Partner.Anrede);
				print ("Partner.Salutation Translated " + transSalutation + " " + $Partner.Nachname);
				if ($Partner.Titel.toString() != "")	
				{
					return "Dear " + transSalutation + " " + $Partner.Titel + " " + $Partner.Nachname ;
				}
				else
				{
					return "Dear " + transSalutation + " " + $Partner.Nachname;
				}
			}
		} 
		else {
			var transSalutation = translateSalutatoryAddressToEn($Partner.Briefanrede);
			print ("Partner.SalutatoryAddress = "+ $Partner.Briefanrede + " --- " + transSalutation);			
			return transSalutation;
		}
	}	 
	else // default
	{
		print ("en");
		if (!$Partner.Briefanrede || $Partner.Briefanrede.isAbsent() || $Partner.Briefanrede.isEmpty()) {
			if (!$Partner.Anrede || $Partner.Anrede.isAbsent() || $Partner.Anrede.isEmpty() || $Partner.Anrede == "Company") {
				return "Dear Ladies and Gentlemen";
			} 
			else 
			{
				print ("Partner.Salutation in Spool " + $Partner.Anrede + " " + $Partner.Nachname);
				var transSalutation = translateSalutationToDocLanguage(language, $Partner.Anrede);
				print ("Partner.Salutation Translated " + transSalutation + " " + $Partner.Nachname);
				if ($Partner.Titel.toString() != "")	
				{
					return "Dear " + transSalutation + " " + $Partner.Titel + " " + $Partner.Nachname ;
				}
				else
				{
					return "Dear " + transSalutation + " " + $Partner.Nachname;
				}
			}
		} 
		else {
			var transSalutation = translateSalutatoryAddressToEn($Partner.Briefanrede);
			print ("Partner.SalutatoryAddress = "+ $Partner.Briefanrede + " --- " + transSalutation);			
			return transSalutation;
		}
	}	 
}


function deriveNameFirstname($Partner) {
	if ($Partner.Firmenname1 && !$Partner.Firmenname1.isEmpty()) {
		return $Partner.Firmenname1;
	}
	else {
		var name = $Partner.Nachname;
		if ($Partner.Vorname && !$Partner.Vorname.isEmpty()) {
			name = name + ", " + $Partner.Vorname;
		}
		if ($Partner.Titel && !$Partner.Titel.isEmpty()) {
			name = $Partner.Titel+ " " + name;
		}
		return name;
	}	
}