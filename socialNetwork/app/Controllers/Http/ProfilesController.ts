 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Application from'@ioc:Adonis/Core/Application'
import Hash from '@ioc:Adonis/Core/Hash';




export default class ProfilesController {
    public async index({ view, params, auth }: HttpContextContract){
        const username = params.username
        const user = await User.query()
        .where('username', username)
        .preload('posts')
        .preload('followings')
        .firstOrFail()

        
        if (auth.user) {
            await auth.user.load('followings');
          }
        const followers = await user.followers()
        return view.render('profile',{ user, followers})
    }

    public async edit({ view }:HttpContextContract){
        return view.render('accounts/edit')
    }

    public async update({ auth, request, response, session }: HttpContextContract){
        const user = auth.user
        if (!user) {
            return response.redirect('/login');
          }
        const avatar = request.file('avatar')
        if(avatar){
        const imageName = new Date().getTime().toString() + `.${avatar.extname}`
        await avatar.move(Application.publicPath('images'),{
            name: imageName
        })
        user.avatar = ` images/${imageName}`
    }
    
        const username = request.input('username');
        const name = request.input('name');
        const newPassword = request.input('new_password');
    const currentPassword = request.input('current_password');
    
    if (newPassword) {
      if (!currentPassword) {
        session.flash('error', 'Current password is required to change the password.');
        return response.redirect('back');
      }
    
      const isPasswordValid = await Hash.verify(user.password, currentPassword);
      if (!isPasswordValid) {
        session.flash('error', 'Incorrect current password.');
        return response.redirect('back');
      }
    
      user.password = newPassword;
      
    }
 
    if (username) {
      user.username = username;
      
      
    }

    if (name) {
      user.name = name;
      
    
    
      
      
    }
    user.details = request.input('details')
        await user?.save()
        return response.redirect().back();
      }
}
