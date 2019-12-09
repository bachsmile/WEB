const Model = require('./Model');//ket csdl 

class UserModel extends Model{
    constructor(){
        super();
    }
    static get tableName(){
        return 'users';
    }
}

module.exports = UserModel;