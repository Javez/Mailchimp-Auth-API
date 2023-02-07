const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
})

app.get("/", function(req, res) {

   res.sendFile(__dirname + "/index.html");
});
app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const secondName = req.body.sname;
    const email = req.body.email;

    const data = {
       members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: secondName
            }
        }
       ] 
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/7ceddb7d1b"
    
    const options = {
        method: "POST",
        auth: "javez:0ba39a0e22646835aa6386c877c85ed5-us11"
    }
    
    const request = https.request(url, options, function(response) {
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/error.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
 });

 app.post("/failure", function(req, res) { 
    res.redirect("/");
 });

 // list id  7ceddb7d1b

 // api key 0ba39a0e22646835aa6386c877c85ed5-us11