// ecommerce backend server setup 
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConnection');
// database connect 
connectDB();
const PORT = process.env.PORT || 5000;
// main route for testing server 
app.get("/",(req,res)=>{
    res.send("Main route")
})
// outlining server port startup
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
