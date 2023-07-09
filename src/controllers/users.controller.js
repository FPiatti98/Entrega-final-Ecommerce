import Userrepository from '../service/repositories/users.repository.js'

const controller = new Userrepository

export const deleteUser = async(req, res) => {
    try {
        const deletedUser = await controller.delete(req.params.email)
        req.logger.info('Usuario eliminado')
        res.status(200).send(deletedUser)
    } catch (error) {
        req.logger.error(error)
        return res.status(500).send({status: "error", message : error.message});
    }
}

export const updateUser = async(req, res) => {
    try {
        const updatedUser = await controller.update(req.params.email)
        req.logger.info('usuario promovido a administrador')
        res.status(200).send(updatedUser)
    } catch (error) {
        req.logger.error(error)
        return res.status(500).send({status: "error", message : error.message});
    }
}