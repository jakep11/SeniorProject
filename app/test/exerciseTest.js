let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
const agent = chai.request.agent(server);
let bcrypt = require('bcrypt');

chai.should();
chai.use(chaiHttp);

const mysql = require('mysql');
const connection = mysql.createConnection(require('../routes/connection.json'));

describe.only('Enrollment Management', () => {
   before('Nuke and preparation', (done) => {
      connection.connect(function (err) {
         if (err)
            throw new Error('Unable to connect to database!');
      });

      let studentUser = {
         'firstName': 'User1',
         'lastName': 'Student',
         'email': 'user1@student.com',
         'role': 0,
         'passHash': bcrypt.hashSync('student1', 10),
         'termsAccepted': new Date()
      };
      
      let section = {
         'name': 'Sec101',
         'description': 'Testing section',
         'term': 'S18'
      };

      let topic = {
         'name': 'Topic1',
         'sectionId': 1,
      };

      agent.post('/api/Session')
         .send({email: 'admin@example.com', password: 'password'})
         .end((err, res) => {
            res.should.have.status(200);
            agent
               .delete('/api/DB')
               .end((err, res) => {
                  res.should.have.status(200);

                  connection.query('insert into User set ?', studentUser);
                  connection.query('insert into Section set ?', section);
                  connection.query('insert into Topic set ?', topic, function() {
                     done();
                  });
               });
         });
   });

   after('close mysql connection', (done) => {
      connection.end();
      done();
   });

   describe('Tests without an AU', () => {
      describe('/GET without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .get('/api/Exercise')
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });

      describe('/POST without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .post('/api/Exercise')
               .send({'name': 'test', 'question': 'Test?', 'answer': 'test', 'type': 'test', 'points': 10, 'topicId': 1})
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });

      describe('/GET/:id without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .get('/api/Exercise/1')
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });

      describe('/PUT/:id without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .put('/api/Exercise/1')
               .send({'name': 'testing'})
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });

      describe('/DELETE/:id without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .delete('/api/Exercise/1')
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });

      describe('/PUT/:id/Grade without AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .put('/api/Exercise/1/Grade')
               .send({'name': 'testing'})
               .end((err, res) => {
                  res.should.have.status(401);
                  done();
               });
         });
      });
   });

   describe('Tests with a student AU', () => {
      before('Authenticate with student user', (done) => {
         agent.post('/api/Session')
            .send({email: 'user1@student.com', password: 'student1'})
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });

      describe('/GET with student AU', () => {
         let exercise = {
            'name': 'Ex1',
            'question': 'Is exercise api working?',
            'answer': 'Maybe',
            'type': 'Free-response',
            'points': 10,
            'dueDate': new Date(),
            'topicId': 1
         };


         it('should return an empty array', (done) => {
            agent.get('/api/Exercise')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(0);

                  // add an exercise
                  connection.query('insert into Exercise set ?', exercise, function() {
                     done();
                  });
               });
         });

         it('should return an array with 1 exercise', (done) => {
            agent.get('/api/Exercise')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(1);
                  res.body[0].should.not.have.property('answer');
                  done();
               });
         });
      });

      describe('/POST with student AU', () => {
         it('should return 403', (done) => {
            agent.post('/api/Exercise')
               .send({'name': 'test', 'question': 'Test?', 'answer': 'test', 'type': 'test', 'points': 10, 'topicId': 1})
               .end((err, res) => {
                  res.should.have.status(403);
                  done();
               });
         });
      });

      describe('/GET/:id with student AU', () => {
         it('should return the exercise with id 1', (done) => {
            agent.get('/api/Exercise/1')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body[0].should.have.property('name', 'Ex1');
                  res.body[0].should.not.have.property('answer');
                  done();
               });
         });

         it('should return 404', (done) => {
            agent.get('/api/Exercise/999')
               .end((err, res) => {
                  res.should.have.status(404);
                  done();
               });
         });
      });

      describe('/PUT/:id with student AU', () => {
         it('should return 403', (done) => {
            agent.put('/api/Exercise/1')
               .send({'name': 'testing'})
               .end((err, res) => {
                  res.should.have.status(403);
                  done();
               });
         });
      });

      describe('/DELETE/:id with student AU', () => {
         it('should return 403', (done) => {
            agent.delete('/api/Exercise/1')
               .end((err, res) => {
                  res.should.have.status(403);
                  done();
               });
         });
      });

      describe('/PUT/:id/Grade with student AU', () => {
         it('should return 200 and isCorrect property false', (done) => {
            agent.put('/api/Exercise/1/Grade')
               .send({'answer': 'wrong'})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('isCorrect', false);
                  done();
               });
         });

         it('should return 200 and isCorrect property true', (done) => {
            agent.put('/api/Exercise/1/Grade')
               .send({'answer': 'Maybe'})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('isCorrect', true);
                  done();
               });
         });
      });
   });

   describe('Tests with an admin AU', () => {
      before('Authenticate with admin user', (done) => {
         agent.post('/api/Session')
            .send({email: 'admin@example.com', password: 'password'})
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });

      describe('/POST with admin AU', () => {
         it('should return 200 and add a new exercise', (done) => {
            agent.post('/api/Exercise')
               .send({'name': 'Ex2', 'question': 'Test?', 'answer': 'right', 'type': 'Free-response', 'points': 10, 'topicId': 1})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.empty;
                  done();
               });
         });
      });

      describe('/GET with admin AU', () => {
         it('should return 2 exercises', (done) => {
            agent.get('/api/Exercise')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(2);
                  res.body[0].should.not.have.property('answer');
                  res.body[1].should.not.have.property('answer');
                  done();
               });
         });
      });

      describe('/GET/:id with admin AU', () => {
         it('should return the exercise with id 1', (done) => {
            agent.get('/api/Exercise/1')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body[0].should.have.property('name', 'Ex1');
                  res.body[0].should.not.have.property('answer');
                  done();
               });
         });

         it('should return the exercise with id 2', (done) => {
            agent.get('/api/Exercise/2')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(1);
                  res.body[0].should.not.have.property('answer');
                  res.body[0].should.have.property('name', 'Ex2');
                  done();
               });
         });

         it('should return 404', (done) => {
            agent.get('/api/Exercise/999')
               .end((err, res) => {
                  res.should.have.status(404);
                  done();
               });
         });
      });

      describe('/PUT/:id with admin AU', () => {
         it('should return 200 and update the exercise', (done) => {
            agent.put('/api/Exercise/1')
               .send({'name': 'testing', 'answer': 'right', 'points': 5})
               .end((err, res) => {
                  res.should.have.status(200);
                  done();
               });
         });
      });

      describe('/DELETE/:id with admin AU', () => {
         it('should return 200 and remove the exercise', (done) => {
            agent.delete('/api/Exercise/2')
               .end((err, res) => {
                  res.should.have.status(200);
                  done();
               });
         });
      });

      describe('/PUT/:id/Grade with admin AU', () => {
         it('should return 200 and isCorrect property false', (done) => {
            agent.put('/api/Exercise/1/Grade')
               .send({'answer': 'wrong'})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('isCorrect', false);
                  done();
               });
         });

         it('should return 200 and isCorrect property true', (done) => {
            agent.put('/api/Exercise/1/Grade')
               .send({'answer': 'right'})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('isCorrect', true);
                  done();
               });
         });
      });
   });
});