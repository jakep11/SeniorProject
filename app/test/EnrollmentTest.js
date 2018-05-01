const chai = require('chai');
const server = require('../app');
var bcrypt = require('bcrypt');

// 1. Might need to be const should = chai.should();
chai.should();
chai.use(require('chai-http'));
// 2. Only need if you want to use expect instead of should
const expect = chai.expect;

// 3. Use agent if you need to retain cookies between tests
const agent = chai.request.agent(server);

// 4. Include if you need to interact with database before or after a test
const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

// Description for test section
describe.skip('Enrollment Management', () => {

   before('Nuke, add users and sections', 
    (done) => {
      connection.connect(function (err) {
         if (err)
            throw new Error('Unable to connect to database!');
      });

      // Users for testing
      let adminUser = {
         'firstName': 'UserB',
         'lastName': 'Admin',
         'email': 'userB@admin.com',
         'role': 1,
         'passHash': bcrypt.hashSync('admin', 10),
         'termsAccepted': new Date()
      };

      let studentUser1 = {
         'firstName': 'User1',
         'lastName': 'Student',
         'email': 'user1@student.com',
         'role': 0,
         'passHash': bcrypt.hashSync('student1', 10),
         'termsAccepted': new Date()
      };

      let studentUser2 = {
         'firstName': 'User2',
         'lastName': 'Student',
         'email': 'user2@student.com',
         'role': 0,
         'passHash': bcrypt.hashSync('student2', 10),
         'termsAccepted': new Date()
      };

      // Section for testing
      let section437 = {
         'name': 'CSC437',
         'description': 'Web Dev',
         'term': 'W18'
      }

      let section133 = {
         'name': 'CPE133',
         'description': 'Digital Design',
         'term': 'S17'
      }

      let section101 = {
         'name': 'CPE101',
         'description': 'Intro to computer science I',
         'term': 'F17'
      }

      // admin login, nuke, add test user and section
      agent
       .post('/Session')
       .send({'email': 'admin@example.com', 'password': 'password'})
       .end(() => {
         agent
          .delete('/DB')
          .end(() => {
            connection.query('insert into User set ?', adminUser);
            connection.query('insert into User set ?', studentUser1);
            connection.query('insert into User set ?', studentUser2);

            connection.query('insert into Section set ?', section437);
            connection.query('insert into Section set ?', section133);
            connection.query('insert into Section set ?', section101, function() {
               done();
            });
         });
      });
   });

   describe("No AU Test Cases", () => {
      
      describe("/POST add Enrollment w/o AU" , () => {
         it('should return 401', (done) => {
            chai.request(server)
             .post('/Entollment')
             .send({'userId': 3, 'sectionId': 1})
             .end((err, res) => {
               res.should.have.status(401);
               
               done();
            })
         })
      });

      describe("/GET w/o AU", () => {
         it('should return 401', (done) => {
            chai.request(server)
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(401);
               
               done();
            })
         })
      });

      describe("/GET with query param w/o AU", () => {
         it('should return 401', (done) => {
            chai.request(server)
             .get('/Enrollment/?userId=1')
             .end((err, res) => {
               res.should.have.status(401);
               
               done();
            })
         });

         it('should return 401', (done) => {
            chai.request(server)
             .get('/Enrollment/?sectionId=1')
             .end((err, res) => {
               res.should.have.status(401);
               
               done();
            })
         })
      });

      describe("/DELETE w/o AU", () => {
         it('should return 401', (done) => {
            chai.request(server)
             .delete('/Enrollment')
             .send({'userId': 3, 'sectionId': 1})
             .end((err, res) => {
               res.should.have.status(401);
               
               done();
            })
         })
      });
   });

   describe("Admin Test Cases", () => {
      before('Login Admin', (done) => {
         agent
          .post('/Session')
          .send({'email': 'admin@example.com', 'password': 'password'})
          .end((err, res) => {
            res.should.have.status(200)
            
            done();
         })
      });
      
      describe("/POST w/ admin", () => {
         it('should return 200', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 3, 'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         })

         it('should return 200', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 3, 'sectionId': 3})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         })

         // bad cases
         it('should return 400 - duplicate enrollment', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 3, 'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'dupEnrollment');
               
               done();
            })
         })

         it('should return 400 - missing userId', (done) => {
            agent
             .post('/Enrollment')
             .send({'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params[0].should.equal('userId');
               
               done();
            })
         })

         it('should return 400 - null userId', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': null, 'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params[0].should.equal('userId');
               
               done();
            })
         })

         it('should return 400 - missing sectionId', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 3})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params[0].should.equal('sectionId');
               
               done();
            })
         })

         it('should return 400 - empty sectionId', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 3, 'sectionId': ''})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params[0].should.equal('sectionId');
               
               done();
            })
         })

         it('should return 400 - otherField', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 1, 'sectionId': 2, 'term' : 'S18'})
             .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'forbiddenField');
               res.body[0].should.have.property('params');
               res.body[0].params[0].should.equal('term');
               
               done();
            })
         })
      });

      describe("/GET w/ admin", () => {
         it('should return 200', (done) =>{
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('userId');
               res.body[0].should.have.property('sectionId');

               res.body[1].should.have.property('userId');
               res.body[1].should.have.property('sectionId');

               done();
            })
         });

         it('valid userId should return 200', (done) => {
            agent
             .get('/Enrollment/?userId=3')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('userId');
               res.body[0].should.have.property('sectionId');

               res.body[1].should.have.property('userId');
               res.body[1].should.have.property('sectionId');

               done();
            })
         })

         it('valid sectionId should return 200', (done) => {
            agent
             .get('/Enrollment/?sectionId=2')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('userId', 3);
               res.body[0].should.have.property('sectionId', 2);

               done();
            })
         })

         it('nonExisting userId should return 200', (done) => {
            agent
             .get('/Enrollment/?userId=100')
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               
               done();
            })
         })

         it('nonExisting sectionId should return 200', (done) => {
            agent
             .get('/Enrollment/?sectionId=100')
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               
               done();
            })
         })
      });

      describe("/DELETE w/ admin", () => {
         it('missing userId should return 400', (done) => {
            agent
             .delete('/Enrollment')
             .send({'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'missingField');

               res.body[0].should.have.property('params');
               res.body[0].params.should.be.a('array');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('userId');

               done();
            })
         })

         it('missing sectionId should return 400', (done) => {
            agent
             .delete('/Enrollment')
             .send({'userId' : 3, 'sectionId': ""})
             .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'missingField');

               res.body[0].should.have.property('params');
               res.body[0].params.should.be.a('array');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('sectionId');

               done();

            })
         })

         it('otherField should return 400', (done) => {
            agent
             .delete('/Enrollment')
             .send({'userId' : 3, 'other': ""})
             .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'forbiddenField');

               res.body[0].should.have.property('params');
               res.body[0].params.should.be.a('array');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('other');

               done()
            })
         })

         it('not enrolled userId should return 200', (done) => {
            agent
             .delete('/Enrollment')
             .send({'userId' : 4, 'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         })

         // Confirming no deletes
         it('should have no rows missing', (done) => {
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);

               done();
            })
         })

         it('should return 200', (done) =>{
            agent
             .delete('/Enrollment')
             .send({'userId': 3, 'sectionId': 3})
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.empty;
               done();
            })
         });

         // Confirming deletes
         it('should have no rows missing', (done) => {
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);

               done();
            })
         })
      });
   });

   describe("User Test Cases", () => {
      before('Login user2', (done) => {
         agent
          .post('/Session')
          .send({'email': 'user2@student.com', 'password': 'student2'})
          .end((err, res) => {
            res.should.have.status(200);
            
            done();
         })
      });

      describe("/POST w/ nonAdminAU", () => {
         it('should return 200', (done) => {
            agent
             .post('/Enrollment')
             .send({'userId': 4, 'sectionId': 1})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         })

         // it('enrolling not logged in student should return 403', (done) => {
         //    agent
         //     .post('/Enrollment')
         //     .send({'userId': 3, 'sectionId': 1})
         //     .end((err, res) => {
         //       res.should.have.status(403);
         //       res.body.should.be.empty;
               
         //       done();
         //    })
         // })
      });

      describe("/GET w/ nonAdminAU", () => {
         it('should return 200', (done) =>{
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               res.body[0].should.have.property('userId');
               res.body[0].should.have.property('sectionId');

               res.body[1].should.have.property('userId');
               res.body[1].should.have.property('sectionId');

               done();
            })
         });
      });

      describe("/DELETE w/ nonAdminAU", () => {
         it('not enrolled sectionId should return 200', (done) => {
            agent
             .delete('/Enrollment')
             .send({'userId' : 4, 'sectionId': 2})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         });

         // it('deleting not logged in student should return 403', (done) => {
         //    agent
         //     .delete('/Enrollment')
         //     .send({'userId' : 3, 'sectionId': 2})
         //     .end((err, res) => {
         //       res.should.have.status(403);
         //       res.body.should.be.empty;
               
         //       done();
         //    })
         // });

         // Confirming no deletes
         it('should have no rows missing', (done) => {
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);

               done();
            })
         });

         it('should return 200', (done) => {
            agent
             .delete('/Enrollment')
             .send({'userId' : 4, 'sectionId': 1})
             .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               
               done();
            })
         });

         // Confirming deletes
         it('should have no rows missing', (done) => {
            agent
             .get('/Enrollment')
             .end((err, res) => {
               res.should.have.status(200)
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);

               done();
            })
         });
      });
   });
})