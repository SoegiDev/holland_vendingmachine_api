const axios = require("axios");

async function GETDATA(paramUrl, head) {
  let datas = await axios
    .get(paramUrl, {
      headers: head,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
  return datas;
}

async function POSTDATA(paramUrl, body, head) {
  let datas = await axios
    .post(paramUrl, body, {
      headers: head,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
  return datas;
}

async function PUTDATA(paramUrl, body, head) {
  let datas = await axios
    .put(paramUrl, body, {
      headers: head,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
  return datas;
}

module.exports = { GETDATA, POSTDATA, PUTDATA };
