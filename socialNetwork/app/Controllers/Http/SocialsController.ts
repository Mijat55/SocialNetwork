import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class SocialsController {
    public redirect({ ally }: HttpContextContract){
        return ally.use('google').redirect()

     }
    public async callback ({ ally, auth, session, response }: HttpContextContract){

        const google = ally.use('google')
        if(google.accessDenied()){
            session.flash({
                notification: {
                    type: 'error',
                    message: 'Acces was denied.',
                },
            })
            return response.redirect('/login')
        }

        if(google.stateMisMatch()){
            session.flash({
                notification: {
                    type: 'error',
                    message: 'Request expired. Retry again.',
                },
            })
            return response.redirect('/login')
        }
        if(google.hasError()){
            session.flash({
                notification: {
                    type: 'error',
                    message: google.getError(),
                },
            })
            return response.redirect('/login')
        }
        const googleUser = await google.user()
        

        const user = await User.firstOrCreate({
            email: googleUser.email!, 
        },
        {
            name: googleUser.name,
            provider: 'google',
            provider_Id: googleUser.id,
        })
        await auth.login(user)

        return response.redirect('/')
    }
}
