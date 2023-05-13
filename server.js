var net = require('net');

const {encrypt, decrypt, verify} = require('./utils')


var server = net.createServer(function(socket) {
	socket.on('data', data => {
        let [client_encrypted_msg, signed_msg] = [...data.toString().split('.')];
        client_encrypted_msg = Buffer.from(client_encrypted_msg, 'base64')
        signed_msg = Buffer.from(signed_msg, 'base64')
        let decrypted_msg = decrypt(client_encrypted_msg, __dirname + '/certificates/server/server-private.key', '1234')
        
        let msg = `Server knows that you said: ${decrypted_msg}`

        let verified = verify(decrypted_msg, `${__dirname}/certificates/server/client-publickey.cer`, signed_msg)

        if(verified) {
            msg += '\n Verified: true';
        } else {
            msg += '\n Verified: false';
        }

        let encrypted_msg = encrypt(msg, __dirname + '/certificates/server/client-publickey.cer')

        socket.write(encrypted_msg);
    })
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');