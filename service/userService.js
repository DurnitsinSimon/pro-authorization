const User = require('../models/User')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')
const Role = require('../models/Role')

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest('User with the same email already exists')
        }
        const defaultRole = await Role.findOne({value: 'USER'})
        const hashedPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        const user = await User.create({ email, password: hashedPassword, activationLink, roles: [defaultRole.value] })
        await mailService.sendAcivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await User.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Uncorrect activation link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await User.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('User is not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Login or password are uncorrect')

        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto}) 
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
    
    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnathorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
    
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await User.find()
        return users
    }

    async updateToAdmin (email) {
        const user = await User.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('Server got uncorrect id')
        }
        const adminRole = await Role.findOne({value: 'ADMIN'})
        if(user.roles.includes(adminRole.value)) {
            throw ApiError.BadRequest('This User is already admin')
        }
        user.roles.push(adminRole.value)
        await user.save()
        const userDto = new UserDto(user)
        return {
           userData: userDto
        }
    }
}


module.exports = new UserService();