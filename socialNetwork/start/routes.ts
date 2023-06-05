

import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'


Route.get('/','HomeController.index')
Route.on('/signup').render('auth/signup').middleware('guest')
Route.on('/login').render('auth/login').middleware('guest')

Route.post('/verify-email', 'EmailVerifiesController.index').middleware('auth')
Route.get('/verify-email/:email', 'EmailVerifiesController.confirm').as('verifyEmail')
Route.post('/signup','AuthController.signup')



Route.post('/login','AuthController.login')
Route.post('/logout','AuthController.logout')

Route.get('/login/google', 'SocialsController.redirect')
Route.get('/login/google/callback', 'SocialsController.callback')

Route.get('/posts/create','PostsController.create').middleware('auth')
Route.post('/posts/create','PostsController.store').middleware('auth')

Route.get('/posts/:id/destroy', 'PostsController.destroy').middleware('auth')
Route.delete('/posts/:id/destroy', 'PostsController.delete').middleware('auth')



Route.post('/follow/:userid','FollowsController.store').middleware('auth')
Route.delete('/follow/:userid','FollowsController.destroy').middleware('auth')

Route.get('/accounts/edit','ProfilesController.edit').middleware('auth')
Route.post('/accounts/edit','ProfilesController.update').middleware('auth')


Route.get('/:username','ProfilesController.index').middleware('auth')


