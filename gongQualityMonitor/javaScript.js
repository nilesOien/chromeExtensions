// Set the date to yesterday's date and set
// the text box value to it.
async function setDate(){

 // Set display initially to show that things are loading
 // Removed, because I now do this directly in the HTML
 // let mainPara=document.getElementById('mainPara');
 // mainPara.innerHTML="Loading...";

 // Crude way to get yesterday's date.
 let d = new Date();
 d.setDate(d.getDate() - 1);
 
 let options = { year: 'numeric' };
 let yyyy = d.toLocaleDateString("en-US", options)
 
 options = { month: '2-digit' };
 let mm = d.toLocaleDateString("en-US", options)
 
 options = { day: '2-digit' };
 let dd = d.toLocaleDateString("en-US", options)

 let fullDate = yyyy + "/" + mm + "/" + dd;

 dateBox=document.getElementById("dateBox"); 
 dateBox.value=fullDate;

 return;

}

// Display the date in current use.
async function displayDate(){

 dateBox=document.getElementById("dateBox");
 displayDatePara=document.getElementById("displayDatePara");
 displayDatePara.innerHTML="The date currently used in URLs below is <B>" + dateBox.value + "</b>";

 return;

}

// Set the URLs according to the date in the date box.
async function setURLs() {

 let sites=["bb", "ct", "le", "ml", "mr", "tc", "td", "te", "ud"];
 let h="";

 // Get the date from the text box.
 dateBox=document.getElementById("dateBox");
 fullDate=dateBox.value;
 yyyy=fullDate.substring(0,4);
 yy=fullDate.substring(2,4); 
 mm=fullDate.substring(5,7);
 dd=fullDate.substring(8,10);

 let yyyymm = yyyy + mm;
 let yymmdd = yy + mm + dd;

 // Links are like
 // <A HREF="https://gong2.nso.edu/oDM/avq/202211/bbavq221107/bbavq221107_qam.html" target="_blank">bb</a>
 h="Then select link to site and product QA page below.<br><br>";
 h+="<table><tr>";

 // Site label header row in table.
 for (let i = 0; i < sites.length; i++) {
  // h += "<th>" + sites[i].toUpperCase() + "</th>"; // Decided to have top row lower case
  h += "<th>" + sites[i] + "</th>";
 }
 h += "</tr><tr>";

 // avq product row in table
 for (let i = 0; i < sites.length; i++) {

   // See if the file we're linking to exists on the server.
   // Put together the filename.
   let file="/oDM/avq/" + yyyymm + "/" + sites[i] + "avq" + yymmdd + "/" +
		 sites[i] + "avq" + yymmdd + "_qam.html";
   // Use the PHP we have to test if the file is on the server.

   // Use the whole URL rather than simply "fileExplore.php" because
   // that allows this to run as a Chrome extension.

   let testURL = "https://gong2.nso.edu/gongQualityMonitor/fileExplore.php?file=" +
		 file;

   // Get the response from the server.
   let response = await fetch(testURL);

   if (response.status != 200) {
    alert(response.statusText);
    return;
   }

   let data = await response.text();
   let reply=JSON.parse(data);

   if (reply.exists == 1){
    h += "<th><A HREF=\"https://gong2.nso.edu/oDM/avq/" + yyyymm + "/" + 
        sites[i] + "avq" + yymmdd + "/" +
        sites[i] + "avq" + 
        yymmdd + "_qam.html\" target=\"_blank\">" + sites[i] + "avq" + "</a>" + "</th>";
   } else {
    h+="<th>-</th>";
   }
  }

 h += "</tr><tr>";

 // zqp product row in table.
 for (let i = 0; i < sites.length; i++) {
   // No zqp data for te or tc
   if ((sites[i] === "tc") || (sites[i] === "te")){
    h+="<th>-</th>";
   } else {

    // See if the file we're linking to exists on the server.
    // Put together the filename.
    let file="/oQR/zqp/" + yyyymm + "/" + sites[i] + "zqp" + yymmdd + "/" +
                 sites[i] + "zqp" + yymmdd + "_qam.html";
    // Use the PHP we have to test if the file is on the server.

    // Use the whole URL rather than simply "fileExplore.php" because
    // that allows this to run as a Chrome extension.

    let testURL = "https://gong2.nso.edu/gongQualityMonitor/fileExplore.php?file=" +
                 file;

    // Get the response from the server.
    let response = await fetch(testURL);

    if (response.status != 200) {
     alert(response.statusText);
     return;
    }

    let data = await response.text();
    let reply=JSON.parse(data);

    if (reply.exists == 1){
     h += "<th><A HREF=\"https://gong2.nso.edu/oQR/zqp/" + yyyymm + "/" +
        sites[i] + "zqp" + yymmdd + "/" +
        sites[i] + "zqp" +
        yymmdd + "_qam.html\" target=\"_blank\">" + sites[i] + "zqp" + "</a>" + "</th>";
    } else {
     h+="<th>-</th>";
    }
   }
 }

 h += "</tr></table>";

 let mainPara=document.getElementById('mainPara');
 mainPara.innerHTML=h;
 
 return;

}

// Function to adjust the date in the text box. Called when plus
// or minus buttons clicked.
async function adjustDate(days){

 // Get the current date string from the text box.
 dateBox=document.getElementById("dateBox");
 fullDate=dateBox.value;
 yyyy=fullDate.substring(0,4);
 mm=fullDate.substring(5,7);
 dd=fullDate.substring(8,10);

 // Do the date math.
 let newMon = parseInt(mm);
 newMon = newMon -1;
 let q = new Date(parseInt(yyyy), newMon, parseInt(dd), 12, 0, 0);
 let d = new Date(q.getTime() + days * 60 * 60 * 24 * 1000);

 options = { year: 'numeric' };
 yyyy = d.toLocaleDateString("en-US", options)

 options = { month: '2-digit' };
 mm = d.toLocaleDateString("en-US", options)

 options = { day: '2-digit' };
 dd = d.toLocaleDateString("en-US", options)

 fullDate = yyyy + "/" + mm + "/" + dd;
 dateBox.value=fullDate;

 return;

}


// Function to add handlers because in a Chrome extension, one cannot
// have inline javascript in the HTML so things like onClick() and
// onChange() are off limits.
async function addHandlers() {

 // First to the update button 
 udb=document.getElementById('updateButton');
 udb.addEventListener('click', function () {
  update();
 });

 // Then to the actual text box, so it updates if they press return
 // and change the text contents of the box. I'll take that as
 // equivalent to them clicking the button.
 db=document.getElementById('dateBox');
 db.addEventListener('change', function () {
  update();
 });

 // The plus and minus buttons.
 mb=document.getElementById('minusButton');
 mb.addEventListener('click', function () {
  adjustDate(-1);
 });

 pb=document.getElementById('plusButton');
 pb.addEventListener('click', function () {
  adjustDate(1);
 });

 return;

}

// Small function that just does a simple, and
// rather incomplete, check on what the user has entered
// as a date. Returns false if all is well, else true.
async function invalidDate() {

 dateBox=document.getElementById("dateBox");
 fullDate=dateBox.value;

 if (fullDate.length != 10){
  alert("\"" + fullDate + "\"" + " is not in YYYY/MM/DD format");
  return true;
 } 

 if (fullDate.substring(4,5) != "/"){
  alert("\"" + fullDate + "\"" + " is not in YYYY/MM/DD format");
  return true;
 } 

 if (fullDate.substring(7,8) != "/"){
  alert("\"" + fullDate + "\"" + " is not in YYYY/MM/DD format");
  return true;
 } 

 return false;

}

// Init function called when page is set up.
async function initialize() {
 addHandlers(); // Add event handlers.
 setDate();     // Set the date in the text box to yesterday
 displayDate(); // Display the date in the display paragraph
 setURLs();     // Set the URLs in use according to the date  
 return;
}

// Update function called when user sets new date.
async function update() {

 if (invalidDate() === true){
  return; // Make sure we have a valid date
 }


 // Blank out existing links.
 let mainPara=document.getElementById('mainPara');
 mainPara.innerHTML="Updating...";

 displayDate(); // Display the date in the display paragraph
 setURLs();     // Set the URLs in use according to the date  
 return;
}

// Call init function on page load
initialize();

