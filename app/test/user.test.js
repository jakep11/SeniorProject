
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
  // beforeEach((done) => { });
  /*
    * Test the /GET route
    */
  describe('/GET User no AU', () => {
    it('it should return 401', (done) => {
      chai.request(server)
        .get('/User')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.eql('');
          done();
        });
    });
  });

  describe('/GET User admin AU', () => {
    it('should ')
  })

});
