var axios = require("axios");
var qs = require("qs");


class GmailAPI {
    accessToken = "";
    constructor() {
      this.accessToken = this.getAcceToken();
    }
  
    getAcceToken = async () => {
      var data = qs.stringify({
        client_id:
          "1080712786914-bq05escecffjaq346n88p82pujctn7gk.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token:
          "1//06VecS1b-0gt8CgYIARAAGAYSNwF-L9IrKbxPWjpbfK2rt4uJ6V-qmOVHPdy2iIw-uhdyP80ofgcUhD9NLra1nOvj0raeMcGPVpY",
        grant_type: "refresh_token",
      });
      var config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
  
      let accessToken = "";
  
      await axios(config)
        .then(async function (response) {
          accessToken = await response.data.access_token;
  
          console.log("Access Token " + accessToken);
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return accessToken;
    };
  
    searchGmail = async (searchItem) => {
      var config1 = {
        method: "get",
        url:
          "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
        headers: {
          Authorization: `Bearer ${await this.accessToken} `,
        },
      };
      var threadId = "";
  
      await axios(config1)
        .then(async function (response) {
          threadId = await response.data["messages"][0].id;
  
          console.log("ThreadId = " + threadId);
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return threadId;
    };
  
    readGmailContent = async (messageId) => {
      var config = {
        method: "get",
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        headers: {
          Authorization: `Bearer ${await this.accessToken}`,
        },
      };
  
      var data = {};
  
      await axios(config)
        .then(async function (response) {
          data = await response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return data;
    };
  
    readInboxContent = async (searchText) => {
      const threadId = await this.searchGmail(searchText);
      const message = await this.readGmailContent(threadId);
  
      const encodedMessage = await message.payload["parts"][0].body.data;
  
      const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
  
      console.log(decodedStr);
  
      return decodedStr;
    };
  }
  
  module.exports = new GmailAPI();