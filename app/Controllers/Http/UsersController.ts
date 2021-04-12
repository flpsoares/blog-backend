import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from "App/Models/User";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const user = await User.all()

    return response.json({ data: user })
  }

  public async store({request, response}: HttpContextContract) {
    const validatedData = await request.validate({
      schema: schema.create({
        username: schema.string({}, [
          rules.unique({table: 'users', column: 'username'}),
          rules.required()
        ]),
        email: schema.string({}, [
          rules.email(),
          rules.unique({table: 'users', column: 'email'}),
          rules.required()
        ]),
        password: schema.string({}, [
          rules.required()
        ]),
      }),
      messages: {
        required: 'Make sure to enter the field value',
        email: 'Invalid email',
        'username.unique': 'Invalid username',
        'email.unique': 'Invalid email',
      }
    })

    const user = await User.create(validatedData)

    return response.json({ data: user })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = request.only(['username', 'email'])
    
    const user = await User.findOrFail(params.id)

    user.merge(data)
    user.save()

    return response.json({ data: user })
  }

  public async delete ({ params, response }: HttpContextContract ){
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.json({ data: { message: 'Usuário excluído com sucesso!' } })
  }
}
