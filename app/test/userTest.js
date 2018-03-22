
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
// let should = chai.should();
const agent = chai.request.agent(server);

let sessions = {};

chai.should();
chai.use(chaiHttp);


describe('User Management', () => {
   // let studentCookie;
   // let adminCookie;
   // let defaultAdminCookie;

   describe('/GET /User with no AU', () => {
      it('should return 401', (done) => {
         agent
            .get('/User')
            .end((err, res) => {
               res.should.have.status(401);
               done();
            });
      });
   });

   describe('/GET /User/1 with no AU', () => {
      it('should return 401', (done) => {
         agent
            .get('/User/1')
            .end((err, res) => {
               res.should.have.status(401);
               done();
            });
      });
   });

   describe('Register User A', () => {
      it('should return successfully', (done) => {
         let user = {
            'email': 'UserA@domainA',
            'firstName': 'FirstA',
            'lastName': 'LastA',
            'password': 'passwordA',
            'role': 0,
            'termsAccepted': true
         };

         agent
            .post('/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(200);
               res.header.location.should.not.be.empty;
               done();
            });
      });

      it('should not work if tried again', (done) => {
         let user = {
            'email': 'UserA@domainA',
            'firstName': 'FirstA',
            'lastName': 'LastA',
            'password': 'passwordA',
            'role': 0,
            'termsAccepted': true
         };

         agent
            .post('/User')
            .send(user)
            .end((err, res) => {
               res.should.have.status(400);
               done();
            });
      });
   });

   describe('/GET User normal AU', () => {
      before('login user A', login({email: 'UserA@domainA', password: 'passwordA'}));
      after('logout user A', logout('UserA@domainA'));

      it('should return just the AU', (done) => {
         agent
            .get('/User')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(1);
               done();
            });
      });
   });
});

function login(user) {
   return (done) => {
      agent.post('/Session')
         .send(user)
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            res.should.have.cookie('SPAuth');
            sessions[user.email] = res.header.location.replace('/Session/', '');
            done();
         });
   };
}

function logout(email) {
   return (done) => {
      agent.delete('/Session/' + sessions[email])
         .end((err, res) => {
            res.should.have.status(200);
            done();
         });
   };


}
