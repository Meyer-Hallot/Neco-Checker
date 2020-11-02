const { curly } = require('node-libcurl');
let crypto = require('crypto');
let nodemailer = require('nodemailer'); 
require('dotenv').config()
let lastHash = "";
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);

async function start(){
    const { statusCode, data, headers } = await curly.get(process.env.TARGET_URL);//'https://www.toplinemainecoons.com/kittens')
    //const { statusCode, data, headers } = await curly.get('http://127.0.0.1:1525/')
    console.log('retriving site')
    console.log('hashing')
    var hash = crypto.createHash('md5').update(data).digest('hex');
    if(lastHash != hash){
        console.log('website updated');
        console.log(hash);
        let transporter = nodemailer.createTransport({
            host: 'mail',
            port: 25,
            // We add this setting to tell nodemailer the host isn't secure during dev:
            ignoreTLS: true
        });
        transporter.sendMail({
            from: process.env.SENDER_EMAIL,//'necochan@layn.moe',
            to: process.env.USER_EMAILS,//'mh@simplesolutionsfs.com, meyerwasup@gmail.com',
            subject: process.env.SUBJECT_TEXT,//'New Kittens Possible',
            // text: process.env.BODY_TEXT,
            html: await readFile('email.html', 'utf8')
        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        });
    }else{
        console.log('no change');
    }
    lastHash = hash;
}
 
let intervalObj = setInterval(start, 10*1000);