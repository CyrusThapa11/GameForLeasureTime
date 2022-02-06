const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("rendering !");
  res.render("index");
});

app.get("/level2", (req, res) => {
  console.log("rendering !");
  res.render("level2");
});

app.get("/level3", (req, res) => {
  console.log("rendering !");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: "Congo you won level 2 on boom-boom-withKaBoOm !!",
      from: "+19035825586",
      to: "+917535955144",
    })
    .then((message) => console.log("message.sid", message.sid));

  res.render("level3");
});

app.get("/sendsms", (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: "Congo you won level 1 on boom-boom-withKaBoOm !!",
      from: "+19035825586",
      to: "+917535955144",
    })
    .then((message) => console.log("message.sid", message.sid));
  console.log("sending sms");
  res.redirect("/level2");
});
app.get("/home", (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: "Congo you completed the game on boom-boom-withKaBoOm !!",
      from: "+19035825586",
      to: "+917535955144",
    })
    .then((message) => console.log("message.sid", message.sid));
  console.log("sending sms");
  res.redirect("/");
});

app.listen(4000, () => {
  console.log("at http://localhost:4000 ");
});
