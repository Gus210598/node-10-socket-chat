const mongoose = require('mongoose');



const dbConnection = async() => {

    try {

        mongoose.set("strictQuery", false);
        await mongoose.connect( process.env.MONGODB_CNN);
    
        console.log('||===>> Base de datos online || Los cuescos Arriba todo Ok DBase... ||');
        console.log('')

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}



module.exports = {
    dbConnection
}
