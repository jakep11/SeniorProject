
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('User Management', () => {
   // let studentCookie;
   // let adminCookie;
   // let defaultAdminCookie;

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

   describe('/GET User no AU', () => {
      it('should return 401', (done) => {
         chai.request(server)
            .get('/User')
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.eql('');
               done();
            });
      });
   });

   describe('/GET User normal AU', () => {
      it('should work', (done) => {
         chai.request(server)
            .get('User')
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(1);
            });
      });
   });

});
