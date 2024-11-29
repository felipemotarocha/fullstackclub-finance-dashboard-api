import jwt from 'jsonwebtoken'

export class TokenVerifierAdapter {
    execute(token, secret) {
        return jwt.verify(token, secret)
    }
}
