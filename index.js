const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const User = require("./models/user");
const connect = require("./db");
const cors = require("cors");
const postDb = require("./queries")


const app = express().use(body_parser.json());


const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

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


app.post("/webhook", async (req, res) => {
  //i want some
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
      let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);
      getuserInput(from,msg_body)
      
        //  axios({
        //      method:"POST",
        //      url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
        //      data:{
        //          messaging_product:"whatsapp",
        //          to:from,
        //          text:{
        //              body:"Hi.. I'm Prasath, your message is "+msg_body
        //          }
        //      },
        //      headers:{
        //          "Content-Type":"application/json"
        //      }

        //  });

        //  res.sendStatus(200);


    } else {
      res.sendStatus(404);
    }
  }
});

const getuserInput = (username,payload)=>{
    var data = JSON.stringify({
      username ,
      payload
    });
    var config = {
      method: 'post',
      url: 'https://whatsapp-webhook-kes7.onrender.com/takeUserInput',
      headers: {
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

app.post("/addWorkflow", postDb.addWorkflow)
app.get("/allWorkflows", postDb.getAllWorkflows)

app.post("/runWorkflowByOrder", postDb.runWorkflowByOrder)
app.post("/takeUserInput", postDb.takeUserInput)
app.post("/abortWorkflow", postDb.abortWorkflow)


app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});



