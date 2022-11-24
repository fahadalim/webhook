const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const User = require("./models/user");
const connect = require("./db");
const cors = require("cors");

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;
app.use(cors());

app.listen(8000 || process.env.PORT, () => {
  console.log("webhook is listening");
  connect();
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

app.get("/fahad", async (req, res) => {
  try {
    const allData = await User.find();
    res.json(allData);
  } catch (error) {
    res.status(500).send({ data: [], message: "error" });
  }
});

app.post("/fahad", async (req, res) => {
  try {
    let brand = await User.create(req.body);
    res.status(500).send({ data: brand, message: "success" });
  } catch (error) {
    res.status(500).send({ data: [], message: "error" });
  }
});

// app.get("/checkNewUser", async (req, res) => {
//   try {
//     const checkUser = await User.findOne({ from: req.body.from });
//     if (checkUser === null) {
//       res.send({ userStatus: 0, message: "new user" });
//     } else if (checkUser.from === req.body.from) {
//       res.send({ userStatus: 1, message: "user existed" });
//     }
//   } catch (error) {
//     res.status(500).send({ data: [], message: error.message });
//   }
// });


app.post("/webhook", (req, res) => {
  //i want some
let userStatus = "";
  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      let type = body_param.entry[0].changes[0].value.messages[0].type;

      const checkNewUser = User.findOne({from:from})
      if(checkNewUser === null){
        userStatus = "new"
      }else if(checkNewUser !== null){
        userStatus = "old"
      }
      let user = User.create({
        from: from,
        to: phon_no_id,
        status: 0,
        type: type,
        body: msg_body,
        userStatus : userStatus
      });
      res.status(200).send({ data: user, message: "success" });

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      //    axios({
      //        method:"POST",
      //        url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
      //        data:{
      //            messaging_product:"whatsapp",
      //            to:from,
      //            text:{
      //                body:"Hi.. I'm Prasath, your message is "+msg_body
      //            }
      //        },
      //        headers:{
      //            "Content-Type":"application/json"
      //        }

      //    });

      //    res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
