var { PrivateKey, key, Address, Signature } = require("bitsharesjs");
var seedrandom = require('seedrandom');
var bip39 = require("bip39");
var fs = require('fs');
var request = require('request');
var FormData = require('form-data');

var text = process.argv[2];//上链的内容
var node_host = process.argv[3];//节点ip
var node_port = process.argv[4];//节点port

fs.readFile('./key', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }

    let privateKey = PrivateKey.fromWif(data);
    let publicKey = privateKey.toPublicKey();
    let address = Address.fromPublic(publicKey);
    var signed = Signature.signBuffer(text, privateKey);
    var signedHex = signed.toHex();
    // var timetamp = Date.now();
    // console.log("timetamp:", timetamp);

    // console.log("text:", text);
    // console.log("address:", address.toString());
    // console.log("publicKey:", publicKey.toString());
    // console.log("signed:", signedHex);

    if (!text) {
        text = "hello";
    }

    //var form = new FormData();

    //form.append("text", text);

    // form.submit('http://example.org/', function (err, res) {
    //     res.resume();
    // });

    var requestData = {
        text: text,
        address: address.toString(),
        publicKey: publicKey.toString(),
        signedHex: signedHex
    }

    httprequest(requestData);
});


var url = "http://" + node_host + ":" + node_port + "/block";
function httprequest(requestData) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error);
        }
    });
};