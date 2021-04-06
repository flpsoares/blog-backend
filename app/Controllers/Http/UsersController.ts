import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const user = await User.all()

    return response.json({ data: user })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['username', 'password', 'email'])

    const user = await User.create(data)

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
