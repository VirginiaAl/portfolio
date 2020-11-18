const express = require("express");
const path = require('path')
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
  console.log(`escuchando puerto ${PORT}`);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

  app.post('/', async (req, res) => {
    const { email, message } = req.body;

    contentHTML = `
        <h1>User Information</h1>
        <ul>
            <li>User Email: ${email}</li>
        </ul>
        <p>${message}</p>
    `;

    let transporter = nodemailer.createTransport({
        // host: 'smtp.mail.yahoo.com',
        // port: 587,
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASS
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    let info = await transporter.sendMail({
        from: req.body.email, // sender address,
        to: 'clientesvirginia@gmail.com',
        subject: 'Website Contact Form',
        // text: 'Hello World'
        html: contentHTML
    })

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.redirect('/')
  });
