export const requestLogger = (req, res, next) => {
    console.log("--------------- Request Log Start ---------------");
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    
    if (req.params && Object.keys(req.params).length > 0) {
        console.log("Params:", JSON.stringify(req.params, null, 2));
    }
    
    if (req.query && Object.keys(req.query).length > 0) {
        console.log("Query:", JSON.stringify(req.query, null, 2));
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Body:", JSON.stringify(req.body, null, 2));
    }
    console.log("--------------- Request Log End -----------------");
    
    next();
};
