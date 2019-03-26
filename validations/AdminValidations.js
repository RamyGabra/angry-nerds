const Joi = require('joi')

module.exports = {
    createValidation: request => {
        const createSchema = {
            FName: Joi.string().min(3).max(100).required(),
            MName: Joi.string().min(3).max(100).required(),
            LName: Joi.string().min(3).max(100).required(),
            ssid: Joi.number().min(0).max(3000).required(),
            Nationality:Joi.string().required(),
            gender:Joi.string().min(4).max(6),
            birthdate: Joi.number().integer().min(1900).max(2013),
            Type:Joi.required(),
            Address:Joi.string().required(),
            fax:Joi.number().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            telephone_number:Joi.number().required(),
            email: Joi.string().email({ minDomainAtoms: 2 })

        }

        return Joi.validate(request, createSchema)
    },

    updateValidation: request => {
        const updateSchema = {
            FName: Joi.string().min(3).max(100).required(),
            MName: Joi.string().min(3).max(100).required(),
            LName: Joi.string().min(3).max(100).required(),
            ssid: Joi.number().min(0).max(3000).required(),
            Nationality:Joi.string().required(),
            gender:Joi.string().min(4).max(6),
            birthdate: Joi.number().integer().min(1900).max(2013),
            Type:Joi.required(),
            Address:Joi.string().required(),
            fax:Joi.number().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            telephone_number:Joi.number().required(),
            email: Joi.string().email({ minDomainAtoms: 2 })

        }

        return Joi.validate(request, updateSchema)
    }, 
}
