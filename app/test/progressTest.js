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
describe('Progress Management', () => {

   before('Nuke, add users, sections, topic, video, progress', 
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
         };

         // Topic for testing
         let topic1 = {
         	'name' : 'JSBasic',
         	'sectionId' : 1
         }

         let topic2 = {
         	'name' : 'JSAdvanced',
         	'sectionId' : 1
         }

         // Video for testing
         let video1 = {
         	'name' : 'JSObjects', 
         	'link' : 'VaMU3wyK0zE',
         	'topicId' : 1, 
         	'dueDate' : '2017-02-10 23:59:59'
         }

         let video2 = {
				'name' : 'InheritanceA', 
				'link' : 'wMAQTikkJxE',
				'topicId' : 2, 
				'dueDate' : '2017-01-15 23:59:59'
         }

         let video3 = {
         	'name' : 'InheritanceB', 
         	'link' : '1IveCSIBh_g',
         	'topicId' : 2, 
         	'dueDate' : '2017-01-15 23:59:59'
         }

         // Progress for testing
         let progress1 = {
         	'userId' : 3,
    			'activityType' : 3,
    			'activityId' : 1,
    			'topicId' : 1
         }

         let progress2 = {
         	'userId' : 3,
    			'activityType' : 3,
    			'activityId' : 2,
    			'topicId' : 2
         }

         let progress3 = {
         	'userId' : 3,
    			'activityType' : 3,
    			'activityId' : 3,
    			'topicId' : 2
         }

         // admin login, nuke, add test user, section, topic, video, progress
         agent
            .post('/api/Session')
            .send({'email': 'admin@example.com', 'password': 'password'})
            .end(() => {
               agent
                  .delete('/api/DB')
                  .end(() => {
                     connection.query('insert into User set ?', adminUser);
                     connection.query('insert into User set ?', studentUser1);
                     connection.query('insert into User set ?', studentUser2);

                     connection.query('insert into Section set ?', section437);
                     
                     connection.query('insert into Topic set ?', topic1);
                     connection.query('insert into Topic set ?', topic2);

                     connection.query('insert into Video set ?', video1);
                     connection.query('insert into Video set ?', video2);
                     connection.query('insert into Video set ?', video3);

                     connection.query('insert into Progress set ?', progress1);
                     connection.query('insert into Progress set ?', progress2);
                     connection.query('insert into Progress set ?', progress3, function() {
                        done();
                     });
                  });
            });
      });

   describe('No AU Test Cases', () => {
      
      describe('/GET/:userId w/o AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .get('/api/Progress/3')
               .end((err, res) => {
                  res.should.have.status(401);
               
                  done();
               });
         });
      });

      describe('/GET/:userId with userId not enrolled in any section w/o AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .get('/api/Progress/1')
               .end((err, res) => {
                  res.should.have.status(401);

                  done();
               });
         });

         it('should return 401', (done) => {
            chai.request(server)
               .get('/api/Progress/')
               .end((err, res) => {
                  res.should.have.status(401);
          
                  done();
               });
         });
      });

      describe('/PUT/:userId w/o AU', () => {
         it('should return 401', (done) => {
            chai.request(server)
               .put('/api/Progress/3/')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(401);
               
                  done();
               });
         });
      });
   });

   describe('Admin Test Cases', () => {
      before('Login Admin', (done) => {
         agent
            .post('/api/Session')
            .send({'email' : 'admin@example.com', 'password' : 'password'})
            .end((err, res) => {
               res.should.have.status(200);
            
               done();
            });
      });

      describe('/GET/:userId w/ admin', () => {
         it('should return 200', (done) =>{
            agent
               .get('/api/Progress/3')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(3);
                  
                  res.body[0].should.have.property('userId');
                  res.body[0].should.have.property('activityType');
                  res.body[0].should.have.property('activityId');
                  res.body[0].should.have.property('topicId');
                  res.body[0].should.have.property('grade');
                  res.body[0].should.have.property('attempted');
                  res.body[0].should.have.property('whenCompleted');

                  done();
               });
         });

         it('userId not enrolled in any section should return 200', (done) => {
            agent
               .get('/api/Progress/4')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(0);

                  done();
               });
         });

         it('missing userId should return 404', (done) => {
            agent
               .get('/api/Progress/')
               .end((err, res) => {
                  res.should.have.status(404);

                  done();
               });
         });
      });
      
      describe('/PUT/:id w/ admin', () => {
         it('should return 200', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.empty;
               
                  done();
               });
         });


         // bad cases
         it('userId not enrolled in any section should return 400', (done) => {
            agent
               .put('/api/Progress/1')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(400);
                  res.body[0].should.have.property('tag', 'progressNotFound');

                  done();
               });
         });

         it('should return 400 - missing activityType', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityId' : 1, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(400);
                  res.body[0].should.have.property('tag', 'missingField');
               	res.body[0].should.have.property('params');
                  res.body[0].params[0].should.equal('activityType');

                  done();
               });
         });

         it('should return 400 - missing activityId', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(400);
                  res.body[0].should.have.property('tag', 'missingField');
                  res.body[0].should.have.property('params');
                  res.body[0].params[0].should.equal('activityId');
               
                  done();
               });
         });

         it('should return 400 - null grade', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : null})
               .end((err, res) => {
                  res.should.have.status(400);
                  res.body[0].should.have.property('tag', 'missingField');
                  res.body[0].should.have.property('params');
                  res.body[0].params[0].should.equal('userId');
               
                  done();
               });
         });

         it('should return 400 - otherField', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'activityId' : 1, 'topicId' : 0.5})
               .end((err, res) => {
                  res.should.have.status(400);
                  res.body[0].should.have.property('tag', 'forbiddenField');
                  res.body[0].should.have.property('params');
                  res.body[0].params[0].should.equal('topicId');
               
                  done();
               });
         });
      });
   });

   describe('Non owner user Test Cases', () => {
      before('Login studentUser2', (done) => {
         agent
            .post('/api/Session')
            .send({'email': 'user2@student.com', 'password': 'student2'})
            .end((err, res) => {
               res.should.have.status(200);
            
               done();
            });
      });

      describe('/GET/:userId w/ nonOwner user', () => {
         it('should return 403', (done) =>{
            agent
               .get('/api/Progress/3')
               .end((err, res) => {
                  res.should.have.status(403);

                  done();
               });
         });

         it('userId not enrolled in any section should return 403', (done) => {
            agent
               .get('/api/Progress/1')
               .end((err, res) => {
                  res.should.have.status(403);
                  
                  done();
               });
         });
      });

      describe('/PUT/:id w/ nonOwner User', () => {
         it('should return 403', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : 1.0})
               .end((err, res) => {
                  res.should.have.status(403);
                  
                  done();
               });
         });
      });
   });

   describe('User Test Cases', () => {
      before('Login studentUser1', (done) => {
         agent
            .post('/api/Session')
            .send({'email': 'user1@student.com', 'password': 'student1'})
            .end((err, res) => {
               res.should.have.status(200);
            
               done();
            });
      });

      describe('/GET/:userId w/ user', () => {
         it('should return 200', (done) =>{
            agent
               .get('/api/Progress/3')
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.lengthOf(3);
                  
                  res.body[0].should.have.property('userId');
                  res.body[0].should.have.property('activityType');
                  res.body[0].should.have.property('activityId');
                  res.body[0].should.have.property('topicId');
                  res.body[0].should.have.property('grade');
                  res.body[0].should.have.property('attempted');
                  res.body[0].should.have.property('whenCompleted');

                  done();
               });
         });
      });

      describe('/PUT/:id w/ User', () => {
         it('should return 403', (done) => {
            agent
               .put('/api/Progress/3')
               .send({'activityType' : 3, 'activityId' : 1, 'grade' : 0.5})
               .end((err, res) => {
                  res.should.have.status(403);
                  
                  done();
               });
         });
      });
   });
});