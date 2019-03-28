const validator = require('../../validations/caseValidations')
const stripe = require('stripe')('sk_test_Tc2FlJG0ovXrM6Zt7zuK1O6f002jC3hcT0')
const Case = require('./../models/Cases')
const Lawyer = require('./../models/Lawyer')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')




let LawyerController = {
//write methods here: check InvestorController for example
lawyerFillForm:async(req,res)=>{

    try{ 
        const id = '5c77e91b3fd76231ecbf04ee'
        const lawyer = await Lawyer.findById(id)
        /*console.log(id)
        console.log(lawyer)
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        console.log(Lawyer)*/


        if (!lawyer)
             return res.status(404).send({ error: 'You are not allowed to fill this form' });
    
        const newForm = await Case.create(req.body)
        const casecreated = await Case.findByIdAndUpdate(newForm.id, {  'caseStatus': 'lawyer-investor',
                                                                        'caseOpenSince': new Date(),
                                                                        'lawyerStartDate':new Date(),
                                                                        'lawyerID':lawyer })
        res.json({ msg: 'The form was created successfully' })

    }
    catch (error) {
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        console.log(error)
        return res.status(404).send({ error: 'Form cant be created' })
    }



}









}

module.exports = LawyerController