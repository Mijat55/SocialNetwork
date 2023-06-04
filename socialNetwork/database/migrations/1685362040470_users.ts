import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name',30).notNullable()
      table.string('email',50).index().notNullable()
      table.string('username',30).index().notNullable()
      table.string('avatar').nullable()
      table.string('details',300).nullable()
      table.dateTime('email_verified_at').nullable()
      table.string('password').nullable()
      table.string('provider').nullable()
      table.string('provider_id').nullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
