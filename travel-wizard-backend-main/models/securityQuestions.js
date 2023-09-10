const mongoose = require('mongoose');
const SecurityQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        unique:true
    }
});
module.exports = mongoose.model("SecurityQuestions",SecurityQuestionsSchema);