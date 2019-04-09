const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http')

const investorFunctions = {

  InvestorPayFees: async (cardnumber, month1, year1, cvc1) => {
    const charge = await axios({
      method: 'post',
      url: 'http://localhost:3000/InvestorPayFees',
      headers: {},
      data: { //body
        name: cardnumber,
        month: month1,
        year: year1,
        cvc: cvc1
      }
    });
    return charge
  },

    InvViewing: async (id) => {
      const views= await axios.get('http://127.0.0.1:3000/InvViewing/'+id)
      return views
      },
  InvestorViewFees: async (id)=>{
    const Case= await axios({
      method:'get',
      url: 'http://localhost:3000/InvestorViewFees/' + id

    })
    return Case
  }

}

module.exports = investorFunctions