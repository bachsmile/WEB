
exports.up = async function(knex) {
    return await knex.schema.createTable('users',(table)=>{
        table.increments();
        table.string('name',100);
        table.string('username').unique();//.index() tao record, query nhanh hon nhung insert cham hon
        table.string('password');
        table.timestamps(true,true);
    })
};

exports.down = function(knex) {
  
};
