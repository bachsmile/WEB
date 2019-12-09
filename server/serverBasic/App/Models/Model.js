const {Model} = require('objection');//thư vienj 
const Knex = require('knex');//thu vien
const knex = Knex({
    client: 'mysql',
    connection: {
      host:     'localhost',
      database: 'sanpham',
      user:     'root',
      password: '1234'
    },
    //tu tim hieu pool
    pool: {
      min: 2,
      max: 10
    },
})
Model.knex(knex);
module.exports = Model;