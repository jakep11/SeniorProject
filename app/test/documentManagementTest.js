const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
var bcrypt = require('bcrypt');

const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Document Management', () => {
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

      agent.post('/api/Session')
         .send({email: 'admin@example.com', password: 'password'})
         .end((err, res) => {
            res.should.have.status(200);
            
            agent
               .delete('/api/DB')
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
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(200);
               res.header.location.should.not.be.empty;
               done();
            });
      });

      it('results in 200 and logs in as student', (done) => {
         agent
            .post('/api/Session')
            .send({email: 'UserA@domainA', password: 'passwordA'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               res.should.have.cookie('SPAuth');
               done();
            });
      });
      
   });

   describe('/GET 0 documents', () => {
      it('results in 200 and empty array', (done) => {
         
         agent
            .get('/api/Document')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   });

   describe('/POST document as a non-admin', () => {
      it('results in 403', (done) => {
         
         let documentData = {
            'name': 'document0',
            'contentPath': 'this is the contentPath of document 0',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/api/Document')
            .send(documentData)
            .end((err, res) => {
               res.should.have.status(403);
               
               done();
            });
      });
   });

   describe('/POST document as an admin', () => {
      it('Logs in as admin', (done) => {
         let session = {
            'email': 'admin@example.com',
            'password': 'password'
         };

         agent
            .post('/api/Session')
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

      it('results in successful document creation', (done) => {
         let documentData = {
            'name': 'document1',
            'contentPath': 'This is the contentPath of document 1',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/api/Document')
            .send(documentData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/POST 2nd document as an admin', () => {
      it('results in successful document creation', (done) => {
         
         let documentData = {
            'name': 'document2',
            'contentPath': 'This is the contentPath of document 2',
            'topicId': 1,
            'dueDate': new Date().toISOString().slice(0, 19).replace('T', ' ')
         }

         agent
            .post('/api/Document')
            .send(documentData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 2 documents', () => {
      it('results in 200 and 2 documents returned', (done) => {
         agent
            .get('/api/Document')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               done();
            });
      });
   });

   describe('/GET /document/2', () => {
      it('results in 200 and returns document with id = 2', (done) => {
         agent
            .get('/api/Document/2')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.property('id', 2);
               res.body.should.have.property('contentPath');
               //res.body.should.have.property('contentPath', 'This is the contentPath of document 2');
               done();
            });
      });
   });

   describe('/PUT update /document/:id', () => {
      it('results in 200 and updates name of document 1', (done) => {

         let documentUpdateInfo = {
            'name': 'document1UpdatedName',
            'contentPath': 'This is the updated contentPath of document 1'
         }

         agent
            .put('/api/Document/1')
            .send(documentUpdateInfo)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET /document/1', () => {
      it('results in 200 and confirms the updates to document 1', (done) => {
         agent
            .get('/api/Document/1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.property('id', 1);
               res.body.should.have.property('name', 'document1UpdatedName')
               //res.body.should.have.property('contentPath', 'This is the updated contentPath of document 1');
               done();
            });
      });
   });

   describe('/DELETE /document/1', () => {
      it('results in 200 and deletes document 1', (done) => {
         agent
            .delete('/api/Document/1')
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 1 document', () => {
      it('results in 200 and 1 document returned', (done) => {
         agent
            .get('/api/Document')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 2);
               done();
            });
      });
   });

   describe('/GET /document/1 will not work', () => {
      it('results in 404 because document was deleted', (done) => {
         agent
            .get('/api/Document/1')
            .end((err, res) => {
               res.should.have.status(404);
               
               done();
            });
      });
   });


});