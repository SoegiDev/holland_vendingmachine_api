const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
var checkdb = require("../dbExist");

// WELCOME//
module.exports.WelcomeVendingMachine = async (req, res, next) => {
  try {
    const JsonData = {
      title: "New VM API",
      description: "New Service API for Vending Machine",
    };
    return res.json(JsonData);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST BANNER
module.exports.ListBanner = async (req, res, next) => {
  try {
    const vm_id = { vmcode: process.env.VM_ID };
    let url = process.env.VM_DOCK_URL;
    let path = process.env.PATH_BANNER_GET;
    let buff = new Buffer(JSON.stringify(vm_id));
    let base64data = buff.toString("base64");
    let jailbreak = base64data.substring(base64data.length - 5);
    console.log(jailbreak);
    let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
    let post_string = "key=" + datakey + "&data=" + base64data;
    let paramUrl = url + "confirm/Other/video/?" + post_string;
    const dataRet = {
      b: base64data,
      getSubs: jailbreak,
    };
    axios({
      method: "get",
      paramUrl,
    })
      .then(function (response) {
        console.log(response);
        res.json(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    //res.json(dataRet);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST Stock
module.exports.ListStock = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log("message", from, to);
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        attach: msg.message.attach,
        type: msg.message.file_type,
        size: msg.message.file_size,
        createdAt: msg.createdAt,
        read: msg.message.read,
        senderName: msg.senderName,
        senderPicture: msg.senderPicture,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

// Create Transaction
module.exports.CreateTrx = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log("message", from, to);
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        attach: msg.message.attach,
        type: msg.message.file_type,
        size: msg.message.file_size,
        createdAt: msg.createdAt,
        read: msg.message.read,
        senderName: msg.senderName,
        senderPicture: msg.senderPicture,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

function checkTable() {
  if (checkdb) {
    return false;
  } else {
    return true;
  }
}
