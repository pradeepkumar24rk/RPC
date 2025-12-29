const CustomerServices = require("../services/customer-service")

module.exports = (app) =>{
    const service = new CustomerServices();
    
    app.use('/app-events',async(req,res)=>{
        const {payload} = req.body;
        service.SubscribeEvent(payload);
        console.log(payload);
        res.json(payload);
    })
}