const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "data", "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getCurrentUser() {
  return readData().currentUser;
}

function patchCurrentUser(payload) {
  const data = readData();

  Object.assign(data.currentUser, payload);
  writeData(data);

  return data.currentUser;
}

module.exports = {
  getCurrentUser,
  patchCurrentUser
};