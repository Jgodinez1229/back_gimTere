const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'josueomarnunezgodinez@gmail.com',
        pass: 'xkxo vzey erhp fggz'
    }
});

module.exports = transporter;