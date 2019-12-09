const AuthService = require('../../Service/AuthService');
class AuthController{
    constructor(){
        this.authService = AuthService;
    }
    
    async login({req,res,next}){
        const {body} = req;
        const result = await this.authService.login(body);
        return res.json(result);
    }

    // async register({req,res,next}){
    //     const {body} = req;
    //     const result = await this.authService.register(body);
    //     return res.json(result);
    // }
    // async login({req,res,next}){
    //     const{body} = req;
    //     //pw and user required
    //     if(!body.username || !body.password){
    //         return res.json({
    //             message: 'username or password is required',
    //             data: null
    //         })
    //     }
    //     //check userin db
    //     const user = await this.userModel.query().where('username',body.username).first();
    //     if(!user){
    //         res.json({
    //             message: 'user_not_found',
    //             data:null
    //         })
    //     }
    //     const userC = await this.userModel.query().where('username',body.username)
    //     .where('password',body.password).first();
    //     console.log(userC);
    //     if(!userC){
    //         res.json({
    //             message: 'wrong_username_or_password',
    //             data:null
    //         })
    //     }
    //     let token = jwt.encode(Env.APP_KEY,{
    //         id:user.id,
    //         timestamp: new Date().getTime()
    //     });
    //     const dataTokenUpdate = {
    //         user_id: user.id,
    //         token: token.value,
    //         status: 1
    //     };
    //     console.log(dataTokenUpdate);
    //     const uToken = await this.tokenModel.query().update(dataTokenUpdate).where('user_id',user.id).first();

    //     res.json({
    //         message:'update_success'
    //     })
    // }
}
module.exports = new AuthController();