// import Migrations from "Migrations";
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations, {from: "0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A"});
};
