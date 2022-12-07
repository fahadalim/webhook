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
let currentState = ""
app.use(cors());

app.listen(process.env.PORT || 9001, () => {
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

app.post("/webhook", async (req, res) => {
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
      if (body_param.entry[0].changes[0].value.messages[0].type == "text") {
        let phon_no_id =
          body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body_param.entry[0].changes[0].value.messages[0].from;
        let msg_body =
          body_param.entry[0].changes[0].value.messages[0].text.body;
        let type = body_param.entry[0].changes[0].value.messages[0].type;

        const checkNewUser = await User.findOne({ from: from });
        console.log("fahad:", checkNewUser);
        if (checkNewUser === null) {
          userStatus = "new";
        } else if (checkNewUser !== null) {
          userStatus = "old";
        }
        let user = User.create({
          from: from,
          to: phon_no_id,
          status: 0,
          type: type,
          body: msg_body,
          userStatus: userStatus,
        });
        res.status(200).send({ data: user, message: "success" });
      } else if (
        body_param.entry[0].changes[0].value.messages[0].type == "interactive"
      ) {
        console.log(body_param.entry[0].changes[0].value.messages[0].type);
        if (
          body_param.entry[0].changes[0].value.messages[0].interactive
            .button_reply.title == "vegetable"
        ) {
          let phon_no_id =
            body_param.entry[0].changes[0].value.metadata.phone_number_id;
          let from = body_param.entry[0].changes[0].value.messages[0].from;
          let type = body_param.entry[0].changes[0].value.messages[0].type;
          let user = User.create({
            from: from,
            to: phon_no_id,
            status: 0,
            type: type,
            userStatus: "old",
            list: "vagetable",
          });
          res.status(200).send({ data: user, message: "success" });
        } else if (
          body_param.entry[0].changes[0].value.messages[0].interactive
            .button_reply.title == "groceries"
        ) {
          let phon_no_id =
            body_param.entry[0].changes[0].value.metadata.phone_number_id;
          let from = body_param.entry[0].changes[0].value.messages[0].from;
          let type = body_param.entry[0].changes[0].value.messages[0].type;
          let user = User.create({
            from: from,
            to: phon_no_id,
            status: 0,
            type: type,
            userStatus: "old",
            list: "groceries",
          });
          res.status(200).send({ data: user, message: "success" });
        }
      }

      //   console.log("phone number " + phon_no_id);
      //   console.log("from " + from);
      //   console.log("boady param " + msg_body);

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

      let nodesOrder = [
        { id: '43403962-75b6-498f-8c8d-b8f755733c5f', type: 'startNode', data: {} },
        { id: 'd543879e-bd7d-442d-9b48-ee796fcccae2', type: 'apiNode', data: {} },
        { id: '34901df7-9c8c-4bd8-941f-987793d49088', type: 'conditionNode', data: {} },
        { id: '3c8829bf-fa78-48b0-896d-6dde6fa7290d', type: 'textNode', data: "Sorry we're facing problem" },
        { id: '98eb9e4e-b579-45d5-9b9b-5430cc282a75', type: 'textNode', data: 'Welcome to our platform' },
        { id: 'd1ae83cb-a05a-43d3-9f63-f90ea49385cd', type: 'textNode', data: 'Existing user' },
        { id: 'bda0d8e4-3b35-48b3-adbc-70c9b65d7405', type: "templateNode" }]

      for (let i = 0; i < nodesOrder.length; i++) {
        if (nodesOrder[i].type === "apiNode") {
          currentState = "apiNode"
          console.log("api node started")
        } else if (nodesOrder[i].type === "conditionNode") {
          currentState = "conditionNode"
          console.log("condition node started")

        } else if (nodesOrder[i].type === "textNode") {
          if (currentState === "apiNode") {
            console.log("api failed")
          }
          else if (currentState === "conditionNode") {
            console.log("new user")
          }
          currentState = "textNode"
        } else if (nodesOrder[i].type === "templateNode") {
          console.log("template sent")
          currentState = "templateNode"
        }
      }

    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});



