const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
var bcrypt = require('bcrypt');

const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Section Management', () => {
   let studentCookie;
   let adminCookie;
   let defaultAdminCookie;

   before('Nuke and preparation', (done) => {
      agent.post('/api/Session')
         .send({email: 'admin@example.com', password: 'password'})
         .end((err, res) => {
            res.should.have.status(200);
            
            agent
               .delete('/api/DB')
               .end((err, res) => {
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

   describe('/GET 0 sections', () => {
      it('results in 200 and empty array', (done) => {
         
         agent
            .get('/api/Section')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   });

   describe('/POST section as a non-admin', () => {
      it('results in 403', (done) => {
         
         let sectionData = {
            'name': 'CSC101',
            'description': 'Introduction to Computer Science',
            'term': 'S18'
         }

         agent
            .post('/api/Section')
            .send(sectionData)
            .end((err, res) => {
               res.should.have.status(403);
               done();
            });
      });
   });

   describe('/POST section as an admin', () => {
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

      it('results in successful section CSC102 creation', (done) => {
         
         let sectionData = {
            'name': 'CSC102',
            'description': 'Introduction to Computer Science 2',
            'term': 'S18'
         }

         agent
            .post('/api/Section')
            .send(sectionData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/POST 2nd section CSC103 as an admin', () => {
      it('results in successful section creation', (done) => {
         
         let sectionData = {
            'name': 'CSC103',
            'description': 'Introduction to Computer Science 3',
            'term': 'S18'
         }

         agent
            .post('/api/Section')
            .send(sectionData)
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 2 sections', () => {
      it('results in 200 and 2 sections returned', (done) => {
         agent
            .get('/api/Section')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('term', 'S18');
               done();
            });
      });
   });

   describe('/GET section specified by term', () => {
      it('results in 200 and sections in S18', (done) => {
         agent
            .get('/api/Section')
            .query({'term': 'S18'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('term', 'S18');
               done();
            });
      });
   });

   describe('/GET section specified by name', () => {
      it('results in 200 and CSC101 section returned', (done) => {
         agent
            .get('/api/Section')
            .query({'name': 'CSC102'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('name', 'CSC102');
               done();
            });
      });
   });







   describe('/GET /section/2', () => {
      it('results in 200 and returns section with id = 2', (done) => {
         agent
            .get('/api/Section/2')
            .end((err, res) => {
               res.should.have.status(200);
               //res.body.should.have.lengthOf(1);
               console.log("TEST JAKE", res.body);
               //res.body.should.include('id', 2);
               res.body.should.have.property('name', 'CSC103');
               done();
            });
      });
   });

   describe('/PUT update section/1', () => {
      it('Updates section 1', (done) => {
         let sectionUpdateInfo = {
            'name': 'CSC201',
            'description': 'Introduction to Computer Science is now CSC201'
         }

         agent.put('/api/Section/1')
         .send(sectionUpdateInfo)
         .end((err, res) => {
            res.should.have.status(200);
            done();
         })
      });
   });


   describe('/GET /section/1', () => {
      it('results in 200 and confirms the updates to section 1', (done) => {
         agent
            .get('/api/Section/1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.property('id', 1);
               res.body.should.have.property('name', 'CSC201')
               res.body.should.have.property('description', 'Introduction to Computer Science is now CSC201');
               done();
            });
      });
   });

   describe('/DELETE /section/1', () => {
      it('results in 200 and deletes section 1', (done) => {
         agent
            .delete('/api/Section/1')
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });
   });

   describe('/GET 1 section', () => {
      it('results in 200 and 1 section returned', (done) => {
         agent
            .get('/api/Section')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 2);
               done();
            });
      });
   });

   describe('/GET /section/1 will not work', () => {
      it('results in 404 because section was deleted', (done) => {
         agent
            .get('/api/Section/1')
            .end((err, res) => {
               res.should.have.status(404);
               
               done();
            });
      });
   });


});