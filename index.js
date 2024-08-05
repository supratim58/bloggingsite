import express from "express";
import bodyParser from "body-parser";
import { students } from "./students.js";
import { svgs } from "./students.js";
import { blogs } from "./students.js";
import { basics } from "./students.js";

var loggedin = false;
var username = "";
var email = "";
console.log(students[0].first_name);

const app = express(),
  port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  
app.use(express.static("public"));
app.use((req, res, next) => {
  next();
});
app.listen(port, () => {
  console.log(`running at ${port}`);
});

app.get("/signin", (req, res) => {
  console.log("accessing the login page");
  res.render(
    "signin.ejs",

    new basics("none", blogs["paints"], loggedin, svgs, username,0,email)
  );
});

app.get("/", (req, res) => {
  res.render(
    "paints.ejs",

    new basics("paints", blogs["paints"], false, svgs, username,0,email)
  );
});
app.get("/:options", (req, res) => {
  if (req.params.options == "loggedout") {
    res.render(
      "paints.ejs",
      new basics("paints", blogs["paints"], false, svgs, username,0,email)
    );
  }
});
app.get("/section/:name", (req, res) => {
  var name = req.params.name;
  res.render(
    name + ".ejs",

    new basics(name, blogs[name], loggedin, svgs, username,0,email)
  );
});

app.get("/section/:name/:type", (req, res) => {
  if (req.params.type == "add")
    res.render(
      "addblog.ejs",
      new basics(req.params.name,blogs[req.params.name],loggedin,svgs,username,0,email
      )
    );
});

app.get("/section/:name/:id/view",(req,res)=>{
  var name = req.params.name;
  var id = req.params.id;
  res.render("viewitem.ejs",
    {
      name:req.params.name,
      blogs:blogs[name],
      loggedin:loggedin,
      header:svgs,
      username:username,
      currentitemid:id,
      posttime:blogs[name].at(id).posttime,
      email:email
    });
});

app.post("/signin/submit", (req, res) => {
  console.log("new signin with email number : " + req.body.emailId);
  const newuser = {
    first_name: req.body.fName,
    last_name: req.body.lName,
    email: req.body.emailId,
    id: students.length,
  };
  username = newuser.first_name + " " + newuser.last_name;
  email = newuser.email;
  console.log(email);
  loggedin = true;
  students.push(newuser);
  res.render(
    "paints.ejs",
    new basics("paints", blogs["paints"], loggedin, svgs, username,0,email)
  );
});

app.get("/", (req, res) => {
  console.log("accessed home page");
  res.render("index.ejs");
});

function refreshIds(array = []){
  for(let i = 0;i < array.length;i++){
    array[i].bloginfo.id = i;
  }
}

app.post("/section/:name", (req, res) => {
  var name = req.params.name;
  var len = blogs[name].length;
  var date;
  if(req.body.dateval == "") date = new Date();
    blogs[name].push({
    imagelink: `${req.body.imagelink}`,
    imageheight: "275px",
    blogcontent: req.body.sdes,
    bloginfo: { plot: req.params.name, id: len },
    ldes:req.body.ldes,
    posttime:date,
  });
  console.log("added successfully");
  refreshIds(blogs[name]);
  res.render(
    req.params.name + ".ejs",

    new basics(
      req.params.name,blogs[req.params.name],loggedin,svgs,username,0,email
    )
  );
});

app.post("/section/:name/:type/:val", (req, res) => {
  var val = req.params.val;
  var name = req.params.name;
  if(name == "edit") return;
  if (req.params.type == "delete") {
    blogs[name].splice(val, 1);
    res.render(
      name + ".ejs",

      new basics(name, blogs[name], loggedin, svgs, username,0,email)
    );
  
  } else if (req.params.type == "edit") {
    console.log("editing ");
    res.render("edit.ejs",

        new basics(name,blogs[name],loggedin,svgs,username,val,email)
    );
  }
  else if (req.params.type == "saveEdit"){
    var id = val * 1;
    console.log("saving the edit");
    blogs[name][id] = {
      imagelink: `${req.body.imagelink}`,
      imageheight: "auto",
      blogcontent: req.body.sdes,
      bloginfo: { plot: req.params.name, id: id },
      ldes:req.body.ldes,
    }
    res.render(name+".ejs",
  
      new basics(name,blogs[name],loggedin,svgs,username,id,email)
    );
  }
});