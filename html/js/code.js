const urlBase = 'https://deepblue.page/LAMPAPI';
const extension = 'php';

let loginId = 0;
let firstName = "";
let lastName = "";
let contactFirstName = "";
let contactLastName = "";
let contactEmail = "";
let contactPhone = "";
let contactId = 0;

function doLogin(event) //Alessandro-updated 09/10/2025
{
	if (event) event.preventDefault(); // stop the form from reloading the page

	loginId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginEmail").value; //"loginName" ties to id value in html
	let password = document.getElementById("loginPassword").value;
	
	//document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				loginId = jsonObject.id;
		
				if( loginId < 1 )
				{		
					//document.getElementById("loginResult").innerHTML = "login/password combination incorrect";
					console.log("login failed");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "create-search.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
		console.log("issues something big login");

	}

}

function doRegister(event) //Alessandro-updated 09/10/2025
{
  if (event) event.preventDefault(); // stop the form from reloading the page

	loginId = 0;
  
	let fullName = document.getElementById("username").value;
	let splitname = fullName.split(" ");
  	let firstName = splitname[0];
  	let lastName = splitname[1];
  	let login = document.getElementById("login").value;
  	let password = document.getElementById("password").value;

	//document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				loginId = jsonObject.id;
				
				/* //want out for testing rn
				if(!validRegister(firstName, lastName, login, password))
				{		
					//document.getElementById("signupResult").innerHTML = "You fucked up Registering";
          			console.log("5: error, invalid register somehow");
					//return;
				}
				*/
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				window.location.href = "login.html"; //pending update from FE, probably like contacts.html or something
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
   		console.log("issues something big");
	}

}

function doLogout() //Dion-not updated yet
{
	loginId = 0;
	firstName = "";
	lastName = "";
	// clear cookies for first, last name and id 
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "loginId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

	window.location.href = "index.html";
}

function saveCookie() //Tyler-Updated
{
	const maxAge = 20 * 60;
	// Should save cookies as separate key-value pairs (untested)
	document.cookie = `firstName=${encodeURIComponent(firstName)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
	document.cookie = `lastName=${encodeURIComponent(lastName)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
	document.cookie = `loginId=${encodeURIComponent(loginId)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
}

function saveContact() //Alessandro made
{
    const maxAge = 20 * 60; // 20 minutes

    document.cookie = `contactFirstName=${encodeURIComponent(contactFirstName)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
    document.cookie = `contactLastName=${encodeURIComponent(contactLastName)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
    document.cookie = `contactEmail=${encodeURIComponent(contactEmail)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
    document.cookie = `contactPhone=${encodeURIComponent(contactPhone)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
    document.cookie = `contactId=${encodeURIComponent(contactId)}; max-age=${maxAge}; path=/; samesite=lax; secure`;
}


function readCookie() //Tyler-Updated
{
	loginId = -1;
	firstName = "";
	lastName = "";

	const cookies = document.cookie.split(";");

	for (const part of cookies) {
		const [rawKey, ...rest] = part.trim().split("=");
		const key = rawKey;
		const value = rest.join("=");
		if (!key) continue;

		if (key == "firstName") firstName = decodeURIComponent(value || "");
		else if (key == "lastName") lastName = decodeURIComponent(value || "");
		else if (key == "loginId") {
			const n = parseInt(decodeURIComponent(value || ""), 10);
			loginId = Number.isFinite(n) ? n : -1;
		}
	}

	if (loginId < 1) {
		window.location.href = "index.html" //Not logged in, send back to landing page
	}
}

function readContact() //Alessandro made
{
	contactFirstName = "";
 	contactLastName = "";
 	contactEmail = "";
 	contactPhone = "";
	contactId = 0;

    const cookies = document.cookie.split(";");

	for (const part of cookies) {
		const [rawKey, ...rest] = part.trim().split("=");
		const key = rawKey;
		const value = rest.join("=");
		if (!key) continue;

		if (key == "contactFirstName") contactFirstName = decodeURIComponent(value || "");
		else if (key == "contactLastName") contactLastName = decodeURIComponent(value || "");
		else if (key == "contactEmail") contactEmail = decodeURIComponent(value || "");
		else if (key == "contactPhone") contactPhone = decodeURIComponent(value || "");
		else if (key == "contactId") {
			const n = parseInt(decodeURIComponent(value || ""), 10);
			contactId = Number.isFinite(n) ? n : -1;
		}
	}

	if (contactId < 0) {
		console.log("contact ID not found"); //Not logged in, send back to landing page
	}
}

function addContact(event) //Alessandro-update in progress
{
	if (event) event.preventDefault(); // stop the form from reloading the page
	
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newPhone = document.getElementById("phoneNumber").value;
	let newEmail = document.getElementById("email").value;
	//document.getElementById("contactAddResult").innerHTML = "";

	readCookie();

	let tmp = {firstName:newFirstName,lastName:newLastName,phoneNumber:newPhone,email:newEmail,userId:loginId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/CreateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				/*
				if(true)//need to add return statement
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has already been added, go search them up";
					console.log("not added");
				}
				else
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
					console.log("added");
				}
				*/
				console.log("added contact");
				showNotification("Contact has been created");
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact(event) //Tyler-Updated, untested
{
	if (event) event.preventDefault();
	
	const srch = document.getElementById("searchInput").value.trim();

	readCookie();
	const resultMsg = document.getElementById("results");

	if (resultMsg) resultMsg.innerHTML = "";

	const tmp = {search: srch, userId: loginId};
	const jsonPayload = JSON.stringify(tmp);

	const url = urlBase + '/SearchContacts.' + extension;

	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			if (this.status === 200) {
				let json;
				try {json = JSON.parse(xhr.responseText);}
				catch {if (resultMsg) resultMsg.innerHTML = "Failed to parse server response."; return;}

				const results = Array.isArray(json.results) ? json.results : [];

				if (resultMsg) {
					if (results.length === 0) {
						resultMsg.innerHTML = "<em>No matches.</em>";
					} else {
						const rows = results.map(r => {
							const firstName = (r.Firstname ?? "").toString();
							const lastName = (r.LastName ?? "").toString();
							const phoneNumber = (r.Phone ?? "").toString();
							const email = (r.Email ?? "").toString();
							const tempContactID = (r.ID ?? "");
							return `<div class="contact-row" data-id="${tempContactID}">
										<strong>${firstName} ${lastName}</strong><br>
										<span>${phoneNumber}</span> &middot; <span>${email}</span>
									</div>`;
						});
                        resultMsg.innerHTML = `<div><strong>${results.length} contact(s) found</strong></div>${rows.join("")}`;
					}
				}
			} else {
				if (resultMsg) resultMsg.innerHTML = `Search failed (${this.status}).`;
			}
		}
	};

	try {
		xhr.send(jsonPayload);
	} catch (err) {
		if (resultMsg) resultMsg.innerHTML = err.message;
	}
}

function deleteContact() //Dion-not updated yet
{
	let contactId = document.getElementById("deleteContactId").value;
	document.getElementById("contactDeleteResult").innerHTML = ""; 
	
	let tmp = { 
	  id: contactId,
	  loginId: loginId
	};

	let jsonPayload = JSON.stringify(tmp); 
	
	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); 
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
	    xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.error) {
                        document.getElementById("contactDeleteResult").innerHTML = 
                            "Error deleting contact: " + jsonObject.error;
               	    } else {
                        document.getElementById("contactDeleteResult").innerHTML = 
                            "Contact deleted successfully.";
                    }
                }
            };
            xhr.send(jsonPayload); 
    	} 
    	catch (err) {
            document.getElementById("contactDeleteResult").innerHTML = err.message;
    	}
   	
}

function updateContact() //Dion-not updated yet
{
    if (event) event.preventDefault();

    let updateFirstName = document.getElementById("firstName").value;
    let updateLastName = document.getElementById("lastName").value;
    let updateEmail = document.getElementById("email").value;
    let updatePhone = document.getElementById("phone").value;
    
    readContact();
    readCookie();

    let tmp = {firstName: updateFirstName, lastName: updateLastName, email: updateEmail, phone: updatePhone, userId: loginId, contactId: contactId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact Updated");

            }
        }
        xhr.send(jsonPayload);
    }
    catch (err) {
        //document.getElementById("contactUpdateResult").innerHTML = err.message;
    }
	
}

function updatePassword() //Alessandro-not updated yet
{

}

function validRegister(firstName, lastName, login, password) //fully updated pending HTMLs
{

    var firstNameErr = lastNameErr = loginErr = passwordErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("FIRST NAME IS VALID");
        firstNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST NAME IS VALID");
        lastNameErr = false;
    }

    if (login == "") {
        console.log("LOGIN NAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(login) == false) {
            console.log("LOGIN NAME IS NOT VALID");
        }

        else {

            console.log("LOGIN NAME IS VALID");
            loginErr = false;
        }
    }

    if (password == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(password) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passwordErr = false;
        }
    }

    if ((firstNameErr || lastNameErr || loginErr || passwordErr) == true) {
        return false;

    }

    return true;
}

// Helper for "Contact has been created" notif
function showNotification(message) {
  const el = document.getElementById("notification");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  console.log(el);
  clearTimeout(showNotification._t);
  showNotification._t = setTimeout(() => { el.hidden = true; }, 3000);
}








