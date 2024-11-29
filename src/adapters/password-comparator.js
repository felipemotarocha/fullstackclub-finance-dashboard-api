import bcrypt from 'bcrypt'

export class PasswordComparatorAdapter {
    async execute(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword)
    }
}
