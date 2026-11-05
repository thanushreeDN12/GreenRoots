import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema= mongoose.Schema({
    username: {type: String, required: true, index: true},
    email: {type: String, required: true, index: true},
    password: {type: String, required: true},
    id: {type: String},
    donatedPrograms: [{ type: Schema.Types.ObjectId, ref: 'Program' }],
})

// User is a model/collection
export default mongoose.model('User', userSchema)