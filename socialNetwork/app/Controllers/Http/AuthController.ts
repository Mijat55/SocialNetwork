 
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import User from 'App/Models/User'
 import Login from 'App/Validators/LoginValidator'
 import Signup from 'App/Validators/SignupValidator'
 

 



export default class AuthController {
    public async signup({request, response}:HttpContextContract){
        const req = await request.validate(Signup)


        const user = new User()
        user.name = req.name
        user.email = req.email
        user.username = req.username
        user.password = req.password
        await user.save();


       user?.sendVerificationEmail()

        return response.redirect('/')
    }


    public async login({ request, auth, response }: HttpContextContract) {
const req = await request.validate(Login)

const email= req.email
const password = req.password
const user = await auth.attempt(email,password)



return response.redirect(`/${user.username}`)




    }
     public async logout({ auth, response }:HttpContextContract){
        await auth.logout()
        return response.redirect('/')
     }

}
