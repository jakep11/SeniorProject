const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
var bcrypt = require('bcrypt');

const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Session Management', () => {
   let studentCookie;
   let adminCookie;
   let defaultAdminCookie;

   before('create an admin and student user account', (done) => {
      connection.connect(function (err) {
         if (err)
            throw new Error('Unable to connect to database!');
      });

      let adminUser = {
         'firstName': 'Ben',
         'lastName': 'Admin',
         'email': 'ben@admin.com',
         'role': 1,
         'passHash': bcrypt.hashSync('admin', 10),
         'termsAccepted': new Date()
      };

      let studentUser = {
         'firstName': 'Ben',
         'lastName': 'Student',
         'email': 'ben@student.com',
         'role': 0,
         'passHash': bcrypt.hashSync('student', 10),
         'termsAccepted': new Date()
      };

      connection.query('insert into User set ?', adminUser);
      connection.query('insert into User set ?', studentUser, function() {
         done();
      });
   });

   after('remove Users and reset auto_increment', (done) => {
      let defaultAdmin = {
         'firstName': 'Joe',
         'lastName': 'Admin',
         'email': 'admin@example.com',
         'role': 1,
         'passHash': '$2a$10$Nq2f5SyrbQL2R0e9E.cU2OSjqqORgnwwsY1vBvVhV.SGlfzpfYvyi',
         'termsAccepted': new Date()
      };

      connection.query('delete from User');
      connection.query('alter table User auto_increment=1');
      connection.query('insert into User set ?', defaultAdmin, function (err) {
         if (err) throw err;

         done();
      });
   });

   describe('/POST with invalid login', () => {
      it('results in 400 and badLogin tag', (done) => {
         let session = {
            'email': 't@t.com',
            'password': 'pass'
         };

         chai.request(server)
            .post('/Session')
            .send(session)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'badLogin');
               done();
            });
      });
   });

   describe('/GET without AU', () => {
      it('results in 401', (done) => {
         chai.request(server)
            .get('/Session')
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:cookie without AU', () => {
      it('results in 401', (done) => {
         chai.request(server)
            .get('/Session/' + 'doesntreallymatter')
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/POST with valid login - student', () => {
      it('results in a POST for a new session', (done) => {
         let session = {
            'email': 'ben@student.com',
            'password': 'student'
         };

         agent
            .post('/Session')
            .send(session)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               res.should.have.cookie('SPAuth');

               // save cookie for getting Session by cookie
               studentCookie = res.header.location.replace('/Session/', '');

               done();
            });
      });
   });

   describe('/GET with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .get('/Session')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:cookie invalid with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .get('/Session/invalidCookie')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:cookie own with AU - student', () => {
      it('results in 200 and gets single own Session', (done) => {
         agent
            .get('/Session/' + studentCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.not.be.a('array');
               res.body.cookie.should.be.eql(studentCookie);
               res.body.should.have.property('userId');
               res.body.userId.should.be.eql(3);               
               res.body.should.have.property('loginTime');
               done();
            });
      });
   });

   describe('/GET/:cookie other with AU - student', () => {
      it('results in 403', (done) => {
         chai.request(server)
            .post('/Session')
            .send({'email': 'admin@example.com', 'password': 'password'})
            .end((err, res) => {
               defaultAdminCookie = res.header.location.replace('/Session/', '');
               
               agent
                  .get('/Session/' + defaultAdminCookie)
                  .end((err, res) => {
                     res.should.have.status(403);
                     res.body.should.be.empty;
                     done();
                  });
            });
      });
   });

   describe('/POST with valid login - admin', () => {
      it('results in a POST for a new session', (done) => {
         let session = {
            'email': 'ben@admin.com',
            'password': 'admin'
         };

         agent
            .post('/Session')
            .send(session)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               res.should.have.cookie('SPAuth');

               // save cookie for getting Session by cookie
               adminCookie = res.header.location.replace('/Session/', '');

               done();
            });
      });
   });

   describe('/GET with AU - admin', () => {
      it('results in a GET for all sessions', (done) => {
         agent
            .get('/Session')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(3);
               done();
            });
      });
   });

   describe('/GET/:cookie invalid with AU - admin', () => {
      it('results in 400 and notFound tag', (done) => {
         agent
            .get('/Session/invalidCookie')
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'notFound');
               done();
            });
      });
   });

   describe('/GET/:cookie own with AU - admin', () => {
      it('results in 200 and gets single own admin Session', (done) => {
         agent
            .get('/Session/' + adminCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.not.be.a('array');
               res.body.cookie.should.be.eql(adminCookie);
               res.body.should.have.property('userId');
               res.body.userId.should.be.eql(2);               
               res.body.should.have.property('loginTime');
               done();
            });
      });
   });

   describe('/GET/:cookie other with AU - admin', () => {
      it('results in 200 and gets single student Session', (done) => {
         agent
            .get('/Session/' + studentCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.not.be.a('array');
               res.body.cookie.should.be.eql(studentCookie);
               res.body.should.have.property('userId');
               res.body.userId.should.be.eql(3);
               res.body.should.have.property('loginTime');
               done();
            });
      });
   });

   describe('/DELETE/:cookie invalid with AU - admin', () => {
      it('results in 400 and notFound tag', (done) => {
         agent
            .delete('/Session/invalidCookie')
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'notFound');
               done();
            });
      });
   });

   describe('/DELETE/:cookie other with AU - admin', () => {
      it('results in 200 and logs out the student', (done) => {
         agent
            .delete('/Session/' + studentCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:cookie own with AU - admin', () => {
      it('results in 200 and logs out the admin', (done) => {
         agent
            .delete('/Session/' + adminCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:cookie other with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .post('/Session')
            .send({'email': 'ben@student.com', 'password': 'student'})
            .end((err, res) => {
               studentCookie = res.header.location.replace('/Session/', '');

               agent
                  .delete('/Session/' + defaultAdminCookie)
                  .end((err, res) => {
                     res.should.have.status(403);
                     res.body.should.be.empty;
                     done();
                  });
            });
      });
   });

   describe('/DELETE/:cookie invalid with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .delete('/Session/invalidCookie')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:cookie own with AU - student', () => {
      it('results in 200 and logs out the student', (done) => {
         agent
            .delete('/Session/' + studentCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });
});