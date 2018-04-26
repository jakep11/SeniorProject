const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
var bcrypt = require('bcrypt');

const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Video Management', () => {
   let studentCookie;
   let adminCookie;
   let defaultAdminCookie;

   before('Nuke and preparation', (done) => {

      connection.connect(function (err) {
         if (err)
            throw new Error('Unable to connect to database!');
      });

      // Section for testing
      let section437 = {
         'name': 'CSC437',
         'description': 'Web Dev',
         'term': 'W18'
      }

      let topic1 = {
         'name': 'First topic',
         'sectionId': 1,
      }

      agent.post('/Session')
         .send({email: 'admin@example.com', password: 'password'})
         .end((err, res) => {
            res.should.have.status(200);
            
            agent
               .delete('/DB')
               .end((err, res) => {
                  connection.query('insert into Section set ?', section437);
                  connection.query('insert into Topic set ?', topic1);
                  res.should.have.status(200);
                  done();
               });
         });
   });

   describe('Register and log in as a student', () => {

      let user = {
         'email': 'UserA@domainA',
         'firstName': 'FirstA',
         'lastName': 'LastA',
         'password': 'passwordA',
         'role': 0,
         'termsAccepted': true
      };

      it('results in 200 and registers a new student account', (done) => {
         agent
            .post('/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(200);
               res.header.location.should.not.be.empty;
               done();
            });
      });

      it('results in 200 and logs in as student', (done) => {
         agent
            .post('/Session')
            .send({email: 'UserA@domainA', password: 'passwordA'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               res.should.have.cookie('SPAuth');
               done();
            });
      });
      
   });
   describe('/GET 0 videos', () => {
      it('results in 200 and empty array', (done) => {
         
         agent
            .get('/Video')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   });

   describe('/POST video as a non-admin', () => {
      it('results in 403', (done) => {
         
         let videoData = {
            'name': 'video0',
            'link': 'http://example.com',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/Video')
            .send(videoData)
            .end((err, res) => {
               res.should.have.status(403);
               done();
            });
      });
   });

   describe('/POST video as an admin', () => {
      it('Logs in as admin', (done) => {
         let session = {
            'email': 'admin@example.com',
            'password': 'password'
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

      it('results in successful video creation', (done) => {
         
         let videoData = {
            'name': 'video1',
            'link': 'http://example.com',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/Video')
            .send(videoData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/POST 2nd video as an admin', () => {
      it('results in successful video creation', (done) => {
         
         let videoData = {
            'name': 'video2',
            'link': 'http://example.com',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/Video')
            .send(videoData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 2 videos', () => {
      it('results in 200 and 2 videos returned', (done) => {
         agent
            .get('/Video')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('link', 'http://example.com');
               done();
            });
      });
   });

   describe('/GET /video/2', () => {
      it('results in 200 and returns video with id = 2', (done) => {
         agent
            .get('/Video/2')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.property('id', 2);
               res.body.should.have.property('link', 'http://example.com');
               done();
            });
      });
   });

   describe('/PUT update /video/:id', () => {
      it('results in 200 and updates name of video 1', (done) => {

         let videoUpdateInfo = {
            'name': 'video1UpdatedName',
            'link': 'http://example.com/updated',
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .put('/Video/1')
            .send(videoUpdateInfo)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET /video/1', () => {
      it('results in 200 and confirms the updates to video 1', (done) => {
         agent
            .get('/Video/1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.property('id', 1);
               res.body.should.have.property('name', 'video1UpdatedName')
               res.body.should.have.property('link', 'http://example.com/updated');
               done();
            });
      });
   });

   describe('/DELETE /video/1', () => {
      it('results in 200 and deletes video 1', (done) => {
         agent
            .delete('/Video/1')
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 1 video', () => {
      it('results in 200 and 1 video returned', (done) => {
         agent
            .get('/Video')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 2);
               done();
            });
      });
   });

   describe('/GET /video/1 will not work', () => {
      it('results in 404 because video was deleted', (done) => {
         agent
            .get('/Video/1')
            .end((err, res) => {
               res.should.have.status(404);
               
               done();
            });
      });
   });


});