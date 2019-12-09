const jwt = require('json-web-token');

class AuthMiddleware{
    constructor(){
        
    }
    /*
    *description: middleware check authentication
    */
    auth({req,res,next}){
        const {headers} = req;
        const token = headers.authorization;

        //check token exist.
        if(!token){
            return next({
                message:'token invaild',
                data: null
            });
        }

        const dataToken = jwt.decode(Env.APP_KEY, token);
        if(!dataToken.value){
            
            return next({
                message:'token invaild 2',
                data: null
            });
        }
        //Thong tin cua user duoc gan theo request
        console.log('verify thanh cong');
        req.user = dataToken.value;
        next();
    }

    //Su dung vi nhung API login hoac k log in van xai dc
    noAuth(){

    }
}

module.exports = new AuthMiddleware();