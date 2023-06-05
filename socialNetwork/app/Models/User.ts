import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {column, beforeSave, BaseModel, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import Post from './Post'
import Following from './Following'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string 

  @column()
  public provider: string

  @column()
  public provider_Id: string 

  @column()
  public username: string

  @column()
  public avatar: string

  @column()
  public details: string

  @column.dateTime()
  public email_verified_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=> Post)
  public posts: HasMany<typeof Post>

  @hasMany(()=> Following)
  public followings: HasMany<typeof Following>

  public async followers(){
    const followers = await Following.query().where('following_id',this.id)
    return followers.length
  }
    
  

  @beforeSave()
  

  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async sendVerificationEmail(){
    
    const url = Env.get('APP_URL') + Route.makeSignedUrl('verifyEmail',{
      params:{email:this.email}, expiresIn: '30m', })
    
    Mail.send((message)=> {
      message
      .from('verify@socialnetwrok.com')
      .to(this.email)
      .subject('Please verify your email')
      .htmlView('emails/verify',{ user:this, url })
  })
  }

}
