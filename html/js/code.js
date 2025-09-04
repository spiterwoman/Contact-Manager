const urlBase = 'https://deepblue.page/LAMPAPI';
const extension = 'php';

let loginId = 0;
let firstName = "";
let lastName = "";

function doLogin()//assuming fully comliant, pending HTMLs
{
	loginId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value; //"loginName" ties to id value in html
	let password = document.getElementById("loginpassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
					document.getElementById("loginResult").innerHTML = "login/password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() //fully updated pending HTMLs
{
	loginId = 0;
	firstName = "";
	lastName = "";

	//FirstName,LastName,Login,password
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginpassword").value;
	//	var hash = md5( password );
	
	document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	//	var tmp = {login:login,password:hash};
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
		
				if(!validRegister(firstName, lastName, loginname, password))
				{		
					document.getElementById("signupResult").innerHTML = "You fucked up Registering";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html"; //pending update from FE, probably like contacts.html or something
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogout()
{
	loginId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function saveCookie()//shouldnt change
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",loginId=" + loginId + ";expires=" + date.toGMTString();
}

function readCookie()//shouldnt change
{
	loginId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "loginId" )
		{
			loginId = parseInt( tokens[1].trim() );
		}
	}
	
	if( loginId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("loginName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function addContact() //update in progess
{
	let newFirstName = document.getElementById("colorText").value; //colorText for like firstName
	let newLastName = document.getElementById("colorText").value;
	let newPhone = document.getElementById("colorText").value;
	let newEmail = document.getElementById("colorText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:newFirstName,lastName:newLastName,phone:newPhone,email:newEmail};
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
				if(true)//need to add return statement of th
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has already been added, go search them up";
				}
				else
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact() //not updated yet
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,loginId:loginId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function validRegister(firstName, lastName, login, password) 
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

