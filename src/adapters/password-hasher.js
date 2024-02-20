import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    execute(password) {
        return bcrypt.hash(password, 10)
    }
}
