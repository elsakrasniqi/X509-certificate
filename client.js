var net = require('net');

const {encrypt, decrypt, sign} = require('./utils')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});


var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
    console.log('Connected');
    readline.question(`Enter your input: `, msg => {

        let signed_msg = sign(msg, `${__dirname}/certificates/client/client-private.key`)

        let encrypted_msg = encrypt(msg, __dirname + '/certificates/client/server-publickey.cer')

        client.write(encrypted_msg.toString('base64') + '.' + signed_msg.toString('base64'));
        readline.close();
    });
});

client.on('data', function(msg) {
    let decrypted_msg = decrypt(msg, __dirname + '/certificates/client/client-private.key', '1234')
    console.log("Decrypted: " +  decrypted_msg)
    client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});