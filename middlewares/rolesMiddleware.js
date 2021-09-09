
const ApiError = require("../exceptions/apiError")
const tokenService = require("../service/tokenService")

module.exports = function (roles) {
    return (req, res, next) => {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next(ApiError.UnathorizedError())

            }

            const accessToken = authorizationHeader.split(' ')[1]

            if (!accessToken) {
                return next(ApiError.UnathorizedError())

            }

            const userData = tokenService.validateAccessToken(accessToken)

            if (!userData) {
                return next(ApiError.UnathorizedError())

            }

            let hasRole = false

            userData.roles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                throw ApiError.BadRequest('This user has no rights')
            }
            console.log(userData.roles);
            next()
        } catch (e) {
            return next(e)
        }
    }
}