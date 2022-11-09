const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 4000;
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
      body: "Congratulations you won Second level of the game !! \n Here is your abstract art : https://api.echo3d.co/webar?key=twilight-glitter-7670&entry=1a5e6c68-3ae7-4c18-bf20-16f357580dbd ",
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
      body: "Congratulations you won Second level of the game !! \n Here is your abstract art : https://api.echo3d.co/webar?key=twilight-glitter-7670&entry=0f347d71-2717-419d-b697-df6d737f253a ",
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
      body: "Congratulations you won First level of the game !! \n Here is your abstract art : https://api.echo3d.co/webar?key=twilight-glitter-7670&entry=33f2bb46-9ac7-4a05-87b4-ade57893d742 ",
      from: "+19035825586",
      to: "+917535955144",
    })
    .then((message) => console.log("message.sid", message.sid));
  console.log("sending sms");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`at http://localhost:${port}`);
});
