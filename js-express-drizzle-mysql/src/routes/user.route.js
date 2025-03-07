import express from 'express'
import { createUser, getAllUsers, getSingleUser, updateUser, UserQueries } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/', createUser)
// userRouter.get('/', getAllUsers)
userRouter.get('/', UserQueries)
userRouter.get('/:id', getSingleUser)
userRouter.put('/', updateUser)

export default userRouter;