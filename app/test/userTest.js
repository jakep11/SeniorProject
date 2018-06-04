let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
const agent = chai.request.agent(server);

let sessions = {};

let should = chai.should();
chai.use(chaiHttp);

describe('User Management', () => {
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

   describe('/GET without AU', () => {
      it('should return 401', (done) => {
         chai.request(server)
            .get('/api/User')
            .end((err, res) => {
               res.should.have.status(401);
               done();
            });
      });
   });

   describe('/GET/:id without AU', () => {
      it('should return 401', (done) => {
         chai.request(server)
            .get('/api/User/1')
            .end((err, res) => {
               res.should.have.status(401);
               done();
            });
      });
   });

   describe('/POST Register User A - student', () => {
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

      it('results in 400 if tried again', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'dupEmail');
               done();
            });
      });
   });
   
   describe('/GET User normal AU', () => {
      before('login user A', (done) => {
         agent.post('/api/Session')
            .send({email: 'UserA@domainA', password: 'passwordA'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               res.should.have.cookie('SPAuth');
               sessions['UserA@domainA'] = res.header.location.replace('/Session/', '');
               done();
            });
      });

      it('should return just the AU', (done) => {
         agent
            .get('/api/User')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(1);
               done();
            });
      });

      it('results in 200 and returns empty array', (done) => {
         agent
            .get('/api/User?email=a')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(0);
               done();
            });
      });
   });

   describe('/POST admin with student AU', () => {
      let user = {
         'email': 'admin@test',
         'firstName': 'Admin',
         'lastName': 'Test',
         'password': 'password',
         'role': 1,
         'termsAccepted': true
      };

      it('results in 403', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(403);
               done();
            });
      });
   });

   describe('/POST student with dupEmail', () => {
      let user = {
         'email': 'UserA@domainA',
         'firstName': 'FirstA',
         'lastName': 'LastA',
         'password': 'passwordA',
         'role': 0,
         'termsAccepted': true
      };

      it('results in 400 with dupEmail tag', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'dupEmail');
               done();
            });
      });
   });

   describe('/POST student without terms accepted', () => {
      let user = {
         'email': 'UserB@domainB',
         'firstName': 'FirstB',
         'lastName': 'LastB',
         'password': 'passwordB',
         'role': 0,
         'termsAccepted': false
      };

      it('results in 400 with noTerms tag', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'noTerms');
               done();
            });
      });
   });

   describe('/POST without password', () => {
      let user = {
         'email': 'UserB@domainB',
         'firstName': 'FirstB',
         'lastName': 'LastB',
         'role': 0,
         'termsAccepted': true
      };

      it('results in 400 with missingField tag and params containing password', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].params[0].should.be.eql('password');
               done();
            });
      });

      it('results in 400 with missingField tag and params containing password', (done) => {
         user.password = '';
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].params[0].should.be.eql('password');
               done();
            });
      });

      it('results in 400 with missingField tag and params containing password', (done) => {
         user.password = null;
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'missingField');
               res.body[0].params[0].should.be.eql('password');
               done();
            });
      });
   });

   describe('/GET/:id own - student AU', () => {
      it('results in 200 and returns the single user', (done) => {
         agent
            .get('/api/User/2')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body[0].should.have.property('id', 2);
               res.body[0].should.have.property('firstName', 'FirstA');
               res.body[0].should.have.property('lastName', 'LastA');
               res.body[0].should.have.property('email','UserA@domainA');
               res.body[0].should.have.property('role', 0);
               done();
            });
      });
   });

   describe('/GET/:id other - student AU', () => {
      it('results in 403', (done) => {
         agent
            .get('/api/User/1')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:id invalid - student AU', () => {
      it('results in 404', (done) => {
         agent
            .get('/api/User/0')
            .end((err, res) => {
               res.should.have.status(404);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/PUT/:id own with AU - student', () => {
      it('results in 200 and changed name', (done) => {
         agent
            .put('/api/User/2')
            .send({'lastName': 'Married'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });

      it('results in 400 with forbiddenField error for id and terms', (done) => {
         agent
            .put('/api/User/2')
            .send({'id': 15, 'email': 'not@allowed', 'termsAccepted': new Date()})
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'forbiddenField');
               res.body[0].params[0].should.be.eql('id');
               res.body[1].should.have.property('tag', 'forbiddenField');
               res.body[1].params[0].should.be.eql('email');
               res.body[2].should.have.property('tag', 'forbiddenField');
               res.body[2].params[0].should.be.eql('termsAccepted');
               done();
            });
      });

      it('results in 400 with forbiddenField error for passHash', (done) => {
         agent
            .put('/api/User/2')
            .send({'passHash': 'thiswouldbebad'})
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'forbiddenField');
               res.body[0].params[0].should.be.eql('passHash');
               done();
            });
      });
   });

   describe('/PUT/:id own role with AU - student', () => {
      it('results in 400 with badValue tag', (done) => {
         agent
            .put('/api/User/2')
            .send({'role': 1})
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'badValue');
               res.body[0].params[0].should.be.eql('role');
               done();
            });
      });
   });

   describe('/PUT/:id own password with AU - student', () => {
      it('results in 400 with noOldPassword tag', (done) => {
         agent
            .put('/api/User/2')
            .send({'password': 'test'})
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'noOldPassword');
               should.not.exist(res.body[0].params);
               done();
            });
      });

      it('results in 400 with oldPasswordMismatch', (done) => {
         agent
            .put('/api/User/2')
            .send({'password': 'test', 'oldPassword': 'wrong'})
            .end((err, res) => {
               res.should.have.status(400);
               res.body[0].should.have.property('tag', 'oldPasswordMismatch');
               should.not.exist(res.body[0].params);
               done();
            });
      });

      it('results in 200 and updated password', (done) => {
         agent
            .put('/api/User/2')
            .send({'password': 'newPasswordA', 'oldPassword': 'passwordA'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/PUT/:id other with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .put('/api/User/1')
            .send({'firstName': 'Imposter'})
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id other with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .delete('/api/User/1')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id own with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .delete('/api/User/2')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id invalid with AU - student', () => {
      it('results in 403', (done) => {
         agent
            .delete('/api/User/0')
            .end((err, res) => {
               res.should.have.status(403);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/GET/:id own - admin', () => {
      before('login admin', (done) => {
         agent.post('/api/Session')
            .send({'email': 'admin@example.com', 'password': 'password'})
            .end((err, res) => {
               res.should.have.status(200);
               done();
            });
      });

      it('results in 200 and returns the single user', (done) => {
         agent
            .get('/api/User/1')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body[0].should.have.property('id', 1);
               res.body[0].should.have.property('firstName', 'Joe');
               res.body[0].should.have.property('lastName', 'Admin');
               res.body[0].should.have.property('email','admin@example.com');
               res.body[0].should.have.property('role', 1);
               done();
            });         
      });
   });

   describe('/GET/:id other - admin', () => {
      it('results in 200 and returns the single user', (done) => {
         agent
            .get('/api/User/2')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body[0].should.have.property('id', 2);
               res.body[0].should.have.property('firstName', 'FirstA');
               res.body[0].should.have.property('lastName', 'Married');
               res.body[0].should.have.property('email','UserA@domainA');
               res.body[0].should.have.property('role', 0);
               done();
            });
      });
   });

   describe('/GET/:id invalid - admin AU', () => {
      it('results in 404', (done) => {
         agent
            .get('/api/User/0')
            .end((err, res) => {
               res.should.have.status(404);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/POST admin with admin AU', () => {
      let user = {
         'email': 'admin2@test',
         'firstName': 'Bob',
         'lastName': 'Admin',
         'role': 1,
         'termsAccepted': true
      };

      it('results in 200 and a new user created', (done) => {
         agent
            .post('/api/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(200);
               res.header.location.should.be.eql('/User/3');
               done();
            });
      });
   });

   describe('/GET with AU - admin', () => {
      it('reuslts in 200 and returns all users', (done) => {
         agent
            .get('/api/User')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.should.have.lengthOf(3);
               res.body[0].should.have.property('id');
               res.body[0].should.have.property('firstName');
               res.body[0].should.have.property('lastName');
               res.body[0].should.have.property('email');
               res.body[0].should.have.property('role');
               done();
            });
      });

      it('results in 200 and returns 2 admin users', (done) => {
         agent
            .get('/api/User?email=admin')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.have.length(2);
               done();
            });
      });
   });

   describe('/PUT/:id own with AU - admin', () => {
      it('results in 200 and changed name', (done) => {
         agent
            .put('/api/User/1')
            .send({'firstName': 'Bobby'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/PUT/:id own missing oldPswd with AU - admin', () => {
      after('Reset admin pass', (done) => {
         agent
            .put('/api/User/1')
            .send({'password': 'password'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
      it('results in 200 and password updated', (done) => {
         agent
            .put('/api/User/1')
            .send({'password': 'missingold'})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;

               chai.request(server)
                  .post('/api/Session')
                  .send({'email': 'admin@example.com', 'password': 'missingold'})
                  .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
            });
      });
   });

   describe('/PUT/:id other with AU - admin', () => {
      it('results in 200', (done) => {
         agent
            .put('/api/User/3')
            .send({'password': 'nonblocking', 'role': 0})
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;

               chai.request(server)
                  .post('/api/Session')
                  .send({'email': 'admin2@test', 'password': 'nonblocking'})
                  .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
            });
      });
   });

   describe('/PUT/:id invalid with AU - admin', () => {
      it('results in 404', (done) => {
         agent
            .put('/api/User/0')
            .send({'firstName': 'Invalid'})
            .end((err, res) => {
               res.should.have.status(404);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id with AU - admin', () => {
      it('results in 200 and empty body', (done) => {
         agent
            .delete('/api/User/3')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id invalid with AU - admin', () => {
      it('results in 404', (done) => {
         agent
            .delete('/api/User/0')
            .end((err, res) => {
               res.should.have.status(404);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/PUT/:id without AU', () => {
      it('results in 401 and empty body', (done) => {
         chai.request(server)
            .put('/api/User/1')
            .send({'firstName': 'Guest'})
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.empty;
               done();
            });
      });
   });

   describe('/DELETE/:id without AU', () => {
      it('results in 401 and empty body', (done) => {
         chai.request(server)
            .delete('/api/User/1')
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.empty;
               done();
            });
      });
   });
});