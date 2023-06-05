 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import Application from'@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post'
import {schema,rules} from '@ioc:Adonis/Core/Validator'
import Drive from '@ioc:Adonis/Core/Drive'


export default class PostsController {
    public async index ({}: HttpContextContract){

    }
    public async create ({ view }: HttpContextContract){
        return view.render('posts/create')
    }
    public async store ({ request, auth, response}: HttpContextContract){
        const req = await request.validate({schema:schema.create({
            caption: schema.string({}),
            image: schema.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg'],
        })
           
        }), 
        messages:{
            'caption.required': 'Caption is required to upload ',
            'image.required': 'Image is required to upload',
            
        }
        
        })
    
        const imageName = new Date().getTime().toString() + `.${req.image.extname}`
        await req.image.move(Application.publicPath('images'),{
            name: imageName
        })
        const post= new Post()
        post.image = ` images/${imageName}`
        post.caption = req.caption
        post.userId = auth.user.id
        post.save()
        return response.redirect(`/${auth.user.username}`)
    
}
    public async show ({}: HttpContextContract){
        
    }
    public async edit ({}: HttpContextContract){
        
    }
    public async update ({}: HttpContextContract){
        
    }
    public async destroy({ params, response, view }: HttpContextContract) {
        const postId = params.id;
        const post = await Post.findOrFail(postId);
    
        return view.render('posts/destroy', { post });
      }
    
      public async delete({ params, response }: HttpContextContract) {
        const postId = params.id;
        const post = await Post.findOrFail(postId);
    
        const imagePath = Application.publicPath(post.image);
        await Drive.delete(imagePath);
    
        await post.delete();
    
        return response.redirect('/');
      }
    }
