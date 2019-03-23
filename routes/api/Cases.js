const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const projection = { _id: 0, managers: 1 }
const stripe = require('stripe')('sk_test_Tc2FlJG0ovXrM6Zt7zuK1O6f002jC3hcT0')
const Case = require('../../models/Cases')
const fun = require('./Cases_func')
const validator = require('../../validations/caseValidations')




global.revenues159 = 51
global.revenues72 = 100
global.debt159 = 5
global.debt72 = 6



// show case
router.get('/', async (req, res) => {
    try {
        const Cases = await Case.find()
        res.json({ data: Cases })
    }
    catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const Cases = await Case.findById(id)
    res.json({ data: Cases })
})

router.get('/ViewBoardOfDirectorsEng/:english_name', async (req, res) => {
    const english_na = req.params.english_name;
    var query = { english_name: english_na };
    const Cases = await Case.find(query, projection);
    if (Cases === null) {
        res.json({ msg: 'Can not find company' })
    }
    else {
        res.json({ data: Cases })
    }
})

router.get('/ViewBoardOfDirectorsID/:id', async (req, res) => {
    const id = req.params.id;
    const Cases = await Case.findById(id, projection);
    if (Cases === null) {
        res.json({ msg: 'Can not find company' })
    }
    else {
        res.json({ data: Cases })
    }
})




router.post('/charge', async (req, res) => {
    const id = req.params.id
    const invID = '5c77c2b0c5973856f492f33e' //get this from login token
    const CaseID = '5c93c8fb1692ea457895901c' //get this from frontend 

    const myCase = await Case.findById(CaseID)
    console.log(myCase.investorID)
    if (myCase.investorID == invID) {
        stripe.tokens.create({
            card: {
                "number": req.body.name,
                "exp_month": req.body.month,
                "exp_year": req.body.year,
                "cvc": req.body.cvc
            }
        }, function (err, token) {
            if (err) console.log(err)
            else {
                console.log(token)
                var chargeAmount = 30000
                var charge = stripe.charges.create({
                    amount: chargeAmount,
                    currency: "usd",
                    source: token.id
                }, function (err) {
                    if (err)
                        console.log('your card is declined')
                    else
                        console.log('payment successful')
                })

            }


        })

    }
    else console.log('you cannot pay fees for a form that is not yours')



    console.log(req.body)
        ;
})





// Create a case
router.post('/', async (req, res) => {
    try {
        // const isValidated = validator.createValidation(req.body)
        // if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
        const newCase = await Case.create(req.body)
        res.json({ msg: 'Case was created successfully', data: newCase })
        console.log(newCase._id)
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})




router.post('/FillForm/:id', async (req, res) => {
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    // console.log(req)
    //console.log(req.body.form_type)
    try {

        const id = req.params.id
        const investor = await Investor.findById(id)
        if (!investor) {
            const lawyer = await Staff.findById(id)
            if (!lawyer) return res.status(404).send({ error: 'you r not allowed to fill a form, u r neither a lawyer nor an investor' })

            if (lawyer.Type === 'Lawyer') {
                var temp = "Lawyer"
                //var temp={ "form_type": 1,"regulated_law":1,"arabic_name": 1,"english_name": 1,"government": 1, "city": 1,"hq_address": 1,"hq_city":1,"main_center_phone":1,"main_center_fax":1,"currency":1,"equality_capital":1, "caseStatus":"Lawyer","caseOpenSince":0,"caseClosedDate":0,"reviewerID":0,"lawyerID":0,"investorID":0}
                /* onst newForm = await Case.create(form_type=req.body.form_type,
                 "regulated_law"=req.body.regulated_law,
                 "arabic_name"=req.body,arabic_name,
                 "english_name"
                 )*/
            }
            else { return res.status(404).send({ error: 'you r not allowed to fill a form, u r neither a lawyer nor an investor' }) }

        }
        else { var temp = "Investor" }
        // var temp={ "form_type": 1,"regulated_law":1,"arabic_name": 1,"english_name": 1,"government": 1, "city": 1,"hq_address": 1,"hq_city":1,"main_center_phone":1,"main_center_fax":1,"currency":1,"equality_capital":1, "caseStatus":"Investor","caseOpenSince":0,"caseClosedDate":0,"reviewerID":0,"lawyerID":0,"investorID":0}  



        const newForm = await Case.create(req.body)
        console.log('llllllllllllllllllllllllllllllllllllllllllll')
        console.log(newForm)
        //console.log(newForm.id)
        const casecreated = await Case.findByIdAndUpdate(newForm.id, { "caseStatus": temp })
        console.log("000000000000000000000000000000")
        console.log(newForm)
        console.log("000000000000000000000000000000")
        console.log(casecreated)






        //newForm.caseStatus=temp

        res.json({ msg: 'Form was created successfully', data: newForm })
        // console.log('llllllllllllllllllllllllllllllllllllllllllll')
    }

    catch (error) {
        // We will be handling the error later
        console.log(error)
    }

})








// Update a case
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const Cases = await Case.findById(id)
        if (!Cases) return res.status(404).send({ error: 'Cases does not exist' })
        //  const isValidated = validator.updateValidation(req.body)
        //  if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
        const updatedCase = await Case.findByIdAndUpdate(id, req.body)
        res.json({ msg: 'Case updated successfully', data: updatedCase })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})



// delete a case
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const deletedCase = await Case.findByIdAndRemove(id)
        res.json({ msg: 'Case was deleted successfully', data: deletedCase })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})

router.get('/CmpViewing/:id', async (req, res) => {

    try {
        const id = req.params.id
        var Case = await Cases.findById(id)
        if (Case.caseStatus === "published") {

            const idf = "5c77c2b0c5973856f492f33e"
            const Invs = await Investor.findById(idf)
            const stf = await Staff.findById(idf)
            if (stf) {
                var proj1 = { "reviewerID": 0, "lawyerID": 0, "InvestorID": 0 }

            } else if (Invs) {
                var proj1 = { "reviewerID": 0, "lawyerID": 0, "InvestorID": 0, "equality_capital": 0, "currency": 0 }
            } else {
                var proj1 = { "_id": 0, "arabic_name": 1, "english_name": 1, "government": 1, "city": 1, "hq_address": 1, "hq_city": 1, "hq_state": 1, "main_center_phone": 1, "main_center_fax": 1 };
            }
            Case = await Cases.findById(id, proj1)
            res.json({ data: Case })
        }
        else {
            res.json({ msg: 'Case was not published' })

        }
    }
    catch (error) {
        console.log(error)
    }
})



//Assign Lawyer
router.put('/AssignLawyer/:id/:id1', async (req, res) => {
    //check if I am admin
    try {

        //  var admin= await Staff.findById("5c94da8a60697b45f0949cd9")
        // if(admin.Type ==="Admin"){
        const id = req.params.id
        const id1 = req.params.id1
        console.log(id)
        const Cases = await Case.findById(id)
        const staff = await Staff.findById(id1)
        // if(Cases.lawyerID != null )
        // res.json({msg: 'Case already assigned to a lawyer'})
        //else{
        if (staff.Type === "Lawyer") {
            const updatedCase = await Case.updateOne({ _id: id }, { $set: { lawyerID: id1 } });

            res.json({ msg: 'Case updated successfully', data: updatedCase })
        }
        else
            res.json({ msg: 'Please select a valid lawyer' })

        //}
        //  }
        //  else
        //  res.json({msg:"Only Admins can perform this action"})
    }


    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})




//Assign Reviewer

router.put('/AssignReviewer/:id/:id1', async (req, res) => {
    //check if I am admin
    try {
        const id = req.params.id
        const id1 = req.params.id1
        console.log(id)
        const Cases = await Case.findById(id)
        const staff = await Staff.findById(id1)
        console.log(staff)
        // if(Cases.reviewerID >= null )
        //res.json({msg: 'Case already assigned to a reviewer'})
        // else{
        if (staff.Type === "Reviewer") {
            const updatedCase = await Case.updateOne({ _id: id }, { $set: { reviewerID: id1 } });

            res.json({ msg: 'Case updated successfully', data: updatedCase })
        }
        else
            res.json({ msg: 'Please select a valid reviewer' })

        //}
    }
    catch (error) {
        // We will be handling the error later kkkkkk
        console.log(error)
    }


})


// Fady M updates
router.put('/calc_fees/:id', async (req, res) => {
    try {
        const id = req.params.id
        const Cases = await Case.findById(id);


        var type = Cases.regulated_law;
        if (type === "Law 159") {
            var x = Cases.equality_capital
            var gafi = .001 * x;
            var notary = .0025 * x;
            if (gafi < 100) {
                gafi = 100;
            }
            if (gafi > 1000) {
                gafi = 1000;
            }
            if (notary < 10) {
                notary = 10;
            }
            if (notary > 1000) {
                notary = 1000;
            }
            var fee = global.revenues159 + global.debt159 + gafi + notary;
            const updatedCase = await Case.findByIdAndUpdate(id, { "fees": fee })
            res.json({ msg: 'Fees calculated', data: "Fees : " + fee })
        }
        else if (type === "Law 72") {
            var fee = global.revenues72 + global.debt72
            const updatedCase = await Case.findByIdAndUpdate(id, { "fees": fee })
            console.log("GOT")
            res.json({ msg: 'Fees calculated', data: "Fees : " + fee })
        }
        else {
            res.json({ msg: 'not correct law', data: updatedCase })
        }
    }

    catch (error) {
        console.log(error)
    }

})


router.get('/track_case/:id', async (req, res) => {
    try {
        const id = req.params.id
        const Cases = await Case.findById(id);
        var x = Cases.caseStatus
        res.json({ msg: 'Your case is at', data: x })
    }

    catch (error) {
        console.log(error)
    }

})

router.put('/admin_assign_lawyer/:caseId/:lawyerId', async (req, res) => {
    try {
        const caseId = req.params.caseId
        const lawyerId = req.params.lawyerId
        fun.admin_assign_lawyer(caseId, lawyerId)
        res.json({ msg: 'A case is assigned successfully' })
    }

    catch (error) {
        console.log(error)
    }

})

router.put('/admin_assign_reviewer/:caseId/:reviewerId', async (req, res) => {
    try {
        const caseId = req.params.caseId
        const reviewerId = req.params.reviewerId
        fun.admin_assign_lawyer(caseId, reviewerId)
        res.json({ msg: 'A case is assigned successfully' })
    }

    catch (error) {
        console.log(error)
    }

})
router.put('/system_assign_lawyer/:caseId', async (req, res) => {
    try {
        const caseId = req.params.caseId
        fun.system_assign_lawyer(caseId)
        res.json({ msg: 'A case is assigned successfully' })
    }

    catch (error) {
        console.log(error)
    }

})

router.put('/system_assign_reviewer/:caseId', async (req, res) => {
    try {
        const caseId = req.params.caseId
        fun.admin_assign_lawyer(caseId)
        res.json({ msg: 'A case is assigned successfully' })
    }

    catch (error) {
        console.log(error)
    }

})


router.post('/charge', async (req, res) => {
    const id = req.params.id
    const invID = '5c77c2b0c5973856f492f33e' //get this from login token
    const CaseID = '5c93c8fb1692ea457895901c' //get this from frontend 

    const myCase = await Case.findById(CaseID)
    if (myCase.investorID === invID) {
        stripe.tokens.create({
            card: {
                "number": req.body.name,
                "exp_month": req.body.month,
                "exp_year": req.body.year,
                "cvc": req.body.cvc
            }
        }, function (err, token) {
            if (err) console.log(err)
            else {
                console.log(token)
                var chargeAmount = 30000
                var charge = stripe.charges.create({
                    amount: chargeAmount,
                    currency: "usd",
                    source: token.id
                }, function (err) {
                    if (err)
                        console.log('your card is declined')
                    else
                        console.log('payment successful')
                })

            }


        })

    }
    else console.log('you cannot pay fees for a form that is not yours')



    console.log(req.body)
        ;
})

module.exports = router