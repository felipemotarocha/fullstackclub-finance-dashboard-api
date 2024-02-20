import { notFound } from './http.js'

export const userNotFoundResponse = () =>
    notFound({ message: 'User not found.' })
