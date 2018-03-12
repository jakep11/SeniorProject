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
describe('Topic Management', () => {
   var studentCookie;
   var adminCookie;

   before('Nuke and add users and sections', 
    (done) => {
      connection.connect(function (err) {
         if (err)
            throw new Error('Unable to connect to database!');
      });

      let defAdminCookie;

      let defaultAdmin = {
         'firstName': 'Joe',
         'lastName': 'Admin',
         'email': 'admin@example.com',
         'role': 1,
         'passHash': '$2a$10$Nq2f5SyrbQL2R0e9E.cU2OSjqqORgnwwsY1vBvVhV.SGlfzpfYvyi',
         'termsAccepted': new Date()
      };

      // Users for testing
      let adminUser = {
         'firstName': 'UserB',
         'lastName': 'Admin',
         'email': 'userB@admin.com',
         'role': 1,
         'passHash': bcrypt.hashSync('admin', 10),
         'termsAccepted': new Date()
      };

      let studentUser = {
         'firstName': 'UserB',
         'lastName': 'Student',
         'email': 'userB@student.com',
         'role': 0,
         'passHash': bcrypt.hashSync('student', 10),
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

      // Activities for testing
      let video1 = {
         'name':'HTML Basics',
         'link':'youtube.com/HTMLBasics',
         'topicId': 1,
         'dueDate': '04-12-2018'
      }

      let video2 = {
         'name':'CSS Basics',
         'link':'youtube.com/CSSBasics',
         'topicId': 1,
         'dueDate': '04-12-2018'
      }

      // admin login
      agent
         .post('/Session')
         .send({
            'email': 'admin@example.com',
            'password': 'password'
         })
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            res.should.have.cookie('SeniorProject');
            defAdminCookie = res.header.location.replace('/Session/', '')
            done();
         });

      // Nuke
      it('results in 200', (done) => {
         agent 
            .delete('/DB')
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });

      // Admin logout
      it('results in 200', (done) => {
         agent
            .delete('/Session/' + defAdminCookie)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });

      connection.query('insert into User set ?', adminUser);
      connection.query('insert into User set ?', studentUser);

      connection.query('insert into Section set ?', section437);
      connection.query('insert into Section set ?', section133);
      connection.query('insert into Section set ?', section101);

      connection.query('insert into Video set ?', video1);
      connection.query('insert into Video set ?', video2, function() {
         done();
      });
   });

  // No Login test cases
   describe('/POST with no login', () => {
      it('results in 401', (done) => {
         let topic = {
            'name': 'Boolean Algebra',
            'sectionId': 2
         }

         chai.request(server)
         .post('/Topic')
         .send(topic)
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   describe('/GET with no login', () => {
      it('results in 401', (done) => {
         chai.request(server)
         .get('/Topic')
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   describe('/GET Id with no login', () => {
      it('results in 401', (done) => {
         chai.request(server)
         .get('/Topic/' + '2')
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   describe('/PUT Id with no login', () => {
      it('results in 401', (done) => {
         let newTopic = {
            'name': 'Algebra'
         }

         chai.request(server)
         .put('/Topic/' + '2')
         .send(newTopic)
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   describe('/DELETE Id with no login', () => {
      it('results in 401', (done) => {

         chai.request(server)
         .put('/Topic/' + '2')
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   describe('/GET Id/Activities with no login', () => {
      it('results in 401', (done) => {
        
         chai.request(server)
         .get('/Topic/' + '2/Activities')
         .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.empty;
            done();
         });
      });
   });

   // Handle all admin login tests
   // Adding new topics
   describe('/POST with admin login', () => {
      agent
         .post('/Session')
         .send({
            'email':'userB@admin.com',
            'password':'admin'
         })
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            res.should.have.cookie('SeniorProject');
            adminCookie = res.header.location.replace('/Session/', '')
            done();
         });
      
      it('results in 200', (done) => {
         let topic1 = {
            'name': 'HTML & CSS',
            'sectionId': 1
         }

         agent
            .post('/Topic')
            .send(topic1)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/POST more topics', () => {
      it('results in 200', (done) => {
         let topic2 = {
            'name': 'Boolean Algebra',
            'sectionId': 2
         }

         agent
            .post('/Topic')
            .send(topic2)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/POST more topics I', () => {
      it('results in 200', (done) => {
         let topic3 = {
            'name': 'Class Inheritance',
            'sectionId': 3
         }

         agent
            .post('/Topic')
            .send(topic3)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/POST more topics II', () => {
      it('results in 200', (done) => {
         let topic4 = {
            'name': 'JSBasics',
            'sectionId': 1
         }

         agent
            .post('/Topic')
            .send(topic4)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   // Adding topics different cases
   describe('/POST with missingName', () => {
      it('results in 400 with missingField tag', (done) => {
         let badTopic1 = {
            'sectionId': 2
         }

         agent
            .post('/Topic')
            .send(badTopic1)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('name');
               done();
            });
      });
   });
   
   describe('/POST with missingSectionId', () => {
      it('results in 400 with missingField tag', (done) => {
         let badTopic2 = {
            'name': 'Binary Operation'
         }

         agent
            .post('/Topic')
            .send(badTopic2)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].should.have.property('params');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('sectionId');
               done();
            });
      });
   });

   describe('/POST with null values', () => {
      it('results in 400 with missingField tag', (done) => {
         let badTopic3 = {
            'name': '',
            'sectionId': null
         }

         agent
            .post('/Topic')
            .send(badTopic3)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               for (erro in res.body) {
                  erro.should.have.property('tag', 'missingField');
                  erro.should.have.property('params');
                  erro.params.should.be.a('array');
                  erro.params.should.have.lengthOf(1);
               }

               res.body[0].params[0].should.equal('name');
               res.body[1].params[0].should.equal('sectionId');
               done();
            });
      });
   });

   describe('/POST with other field', () => {
      it('results in 400 with forbiddenField tag', (done) => {
         let badTopic4 = {
            'name': 'Polymorphism',
            'sectionId': 3,
            'other': 'Cat is a Animal'
         }

         agent
            .post('/Topic')
            .send(badTopic4)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'forbiddenField');
               res.body[0].should.have.property('params');
               res.body[0].params.should.be.a('array');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('other');
               done();
            });
      });
   });

   // getting the topics
   // good cases
   describe('/GET admin login with sectionId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + 'sectionId=1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(2);
               for (ans in res.body) {
                  ans.should.have.property('id, name, sectionId');
                  ans.sectionId.should.equal(1);
               }
               done();
            });
      });
   });

   describe('/GET admin login without sectionId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(4);
               for (ans in res.body) {
                  ans.should.have.property('id, name, sectionId');
               }
               done();
            });
      });
   }); 

   // other cases
   describe('/GET admin login without sectionId value', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + 'sectionId=')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(4);
               for (ans in res.body) {
                  ans.should.have.property('id, name, sectionId');
               }
               done();
            });
      });
   }); 

   describe('/GET admin login with sectionId value as string', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + 'sectionId=\'1\'')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   }); 

   describe('/GET admin login with non existing sectionId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + 'sectionId=10000')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   }); 

   // getting the topics with id
   describe('/GET/:Id admin login with topicId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + '1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 'name', 'sectionId');
               res.body[0].id.should.equal(1);
               res.body[0].name.should.equal('HTML & CSS');
               res.body[0].sectionId.should.equal(1);
               done();
            });
      });
   }); 

   describe('/GET/:Id admin login with non-existing topicId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + '666')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(0);
               done();
            });
      });
   }); 


   // updating topics
   describe('/PUT/:Id admin login', () => {
      it('results in 200', (done) => {
         let newTopic1 = {
            'name' : 'HTML'
         }

         agent
            .put('/Topic/' + '1')
            .send(newTopic1)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   }); 

   describe('/PUT/:Id admin login with other field', () => {
      it('results in 400 with forbiddenField tag', (done) => {
         let newTopic2 = {
            'other' : 'CSS'
         }

         agent
            .put('/Topic/' + '1')
            .send(newTopic2)
            .end((err, res) => {
               res.should.have.status(400);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('tag', 'forbiddenField');
               res.body[0].should.have.property('params');
               res.body[0].params.should.be.a('array');
               res.body[0].params.should.have.lengthOf(1);
               res.body[0].params[0].should.equal('other');
               done();
            });
      });
   }); 

   describe('/PUT/:Id admin login with null name', () => {
      it('results in 200', (done) => {
         let newTopic3 = {
            'name' : ''
         }

         agent
            .put('/Topic/' + '1')
            .send(newTopic3)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:Id to confirm update', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + '1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 'name', 'sectionId');
               res.body[0].id.should.equal(1);
               res.body[0].name.should.equal('HTML');
               res.body[0].sectionId.should.equal(1);
               done();
            });
      });
   }); 

   // deleting the topic
   describe('/DELETE/:Id admin login', () => {
      it('results in 200', (done) => {
         agent
            .delete('/Topic/' + '4')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:Id admin login with non-existing id', () => {
      it('results in 200', (done) => {
         agent
            .delete('/Topic/' + '1000')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   // verify delete
   describe('/GET to verify delete', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);
               for (ans in res.body) {
                  ans.should.have.property('id, name, sectionId');
               }
               done();
            });
      });
   });

   // Get activities
   describe('/GET/:Id/Activities', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/1/Activities')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);

               res.body[0].should.have.property('documents');
               res.body[0].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(0);
               
               res.body[1].should.have.property('exercises');
               res.body[1].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(0);
               
               res.body[2].should.have.property('videos');
               res.body[2].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(2);
            });
      });
   });

   // Admin logout
   it('results in 200', (done) => {
      agent
         .delete('/Session/' + adminCookie)
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            done();
         });
   });

   // Handle all student login tests
   // add new topic
   describe('/POST with student login', () => {
      agent
         .post('/Session')
         .send({
            'email':'userB@student.com',
            'password':'student'
         })
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            res.should.have.cookie('SeniorProject');
            studentCookie = res.header.location.replace('/Session/', '')
            done();
         });

      it('results in 403', (done) => {
         let topicA = {
            'name': 'NodeJs',
            'sectionId': 1
         }

         agent
            .post('/Topic')
            .send(topicA)
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   // get topics
   describe('/GET with student login', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);
               for (tpc in res.body) {
                  tpc.should.have.property('id', 'name', 'sectionId');
               }
               done();
            });
      });
   });

   describe('/GET student login with sectionId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + '1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id, name, sectionId');
               res.body[0].sectionId.should.equal(1);
               done();
            });
      });
   });

   describe('/GET/:Id student login with topicId', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/' + '1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(1);
               res.body[0].should.have.property('id', 'name', 'sectionId');
               res.body[0].id.should.equal(1);
               res.body[0].name.should.equal('HTML');
               res.body[0].sectionId.should.equal(1);
               done();
            });
      });
   }); 

   describe('/PUT/:Id with student login', () => {
      it('results in 403', (done) => {
         let newTopicA = {
            'sectionId': 3
         }

         agent
            .put('/Topic/' + '1')
            .send(newTopicA)
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:Id with student login', () => {
      it('results in 403', (done) => {
         agent
            .delete('/Topic/' + '1')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   })

   describe('/GET to confirm no update', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);
               for (tpc in res.body) {
                  tpc.should.have.property('id', 'name', 'sectionId');
               }

               res.body[0].name.should.equal('HTML');
               done();
            });
      });
   });

   describe('/GET/:Id/Activities', () => {
      it('results in 200', (done) => {
         agent
            .get('/Topic/1/Activities')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);
               
               res.body[0].should.have.property('documents');
               res.body[0].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(0);
               
               res.body[1].should.have.property('exercises');
               res.body[1].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(0);
               
               res.body[2].should.have.property('videos');
               res.body[2].documents.should.be.a('array');
               res.body[0].documents.should.have.lengthOf(2);
            });
      });
   });

   // Student logout
   it('results in 200', (done) => {
      agent
         .delete('/Session/' + studentCookie)
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            done();
         });
   });
});
