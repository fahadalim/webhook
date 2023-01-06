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

        console.log('msgbody', msg_body)


        const checkNewUser = await User.findOne({ from: from });
        console.log("fahad:", checkNewUser);
        if (checkNewUser === null) {
          userStatus = "new";
        } else if (checkNewUser !== null) {
          userStatus = "old";
        }

        if (msg_body === "start") {
          //send to ask if old or new
          // const token = 'EAAJW4aYvBDsBALT9d7TQo0l3OhmVScmzIRiWhVr23BZBWwGIcY6K302cze03Cqv9zhhVxezb53TU3x6n2ZCZBJ5KUEfp7a2ZChaiiCuHqFmpgQZADVUXtZBrSuXKw6Bdox1xOOriFIlgfmZBPSMbtMEkfW4ZC8ogbhWjmo346oUNqVMSXqmNDBQagmmpKrhbpIMl2DdTwLdNxmjVvnwaMSUm'
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v15.0/" + "113964918201249" + "/messages?access_token=" + token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: "are you new/old"
              }
            },
            headers: {
              "Content-Type": "application/json"
            }

          });
        }
        else if (msg_body === "new") {
          // const token = 'EAAJW4aYvBDsBAEZAUrJD1JHtATFNWIPLv1TmvsVZBqr7u8LhfWp3DQqFNQRLTS3L5RjbPNmavyhSHNLrIUE9RVVP6k4KTpv1GaHX6jQT3T6VuzeyE71LZCI2Lub9kttjQVV1zVC7uSbPOjsXI56TRZCZBQxKfuew494hZCEgeFCx82p6NRwDSgKNSCxfDKKHS8xmxiDWVocuZBFQCm1gAAR'
          axios({
            method: "POST",
            url:
              "https://graph.facebook.com/v15.0/" +
              113964918201249 +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: 'pls provide phone no.',
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        else if (msg_body === "old" || msg_body.length === 10) {
          // const token = 'EAAJW4aYvBDsBAEZAUrJD1JHtATFNWIPLv1TmvsVZBqr7u8LhfWp3DQqFNQRLTS3L5RjbPNmavyhSHNLrIUE9RVVP6k4KTpv1GaHX6jQT3T6VuzeyE71LZCI2Lub9kttjQVV1zVC7uSbPOjsXI56TRZCZBQxKfuew494hZCEgeFCx82p6NRwDSgKNSCxfDKKHS8xmxiDWVocuZBFQCm1gAAR'
          axios({
            method: "POST",
            url:
              "https://graph.facebook.com/v15.0/" +
              113964918201249 +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: 'Vegetables \n 1. Potato \n 2. Tomato \n 3. Onion',
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
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


    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});



