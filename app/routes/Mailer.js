const nodemailer = require('nodemailer');

const Mailer = function() {
   this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
         user: 'rwzsoeqzhyif7lgq@ethereal.email',
         pass: 'pzR9DEvHnaqqJb8P4S'
      }
   });
};

Mailer.prototype.sendMail = function(message, cb) {
   Mailer.singleton.transporter.sendMail(message, (error, info) => {
      cb(error, info);
   });
};

Mailer.singleton = new Mailer();

module.exports = Mailer.singleton;

