import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        // pegar o access token do header
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]
        if (!accessToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        // verificar se o access token é válido
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )
        if (!decodedToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        request.userId = decodedToken.userId
        // se for válido, eu deixo a requisição prosseguir
        next()
    } catch (error) {
        console.error(error)
        return response.status(401).send({ message: 'Unauthorized' })
    }
}
