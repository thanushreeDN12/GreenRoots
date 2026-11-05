import mongoose from 'mongoose'

const ProgramSchema= mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    id: {type: String},
    targetAmount: {type: Number, default: 0},
    raisedAmount: {type: Number, default: 0},
    donationCost: {type: Number, default: 500},
    location: {type: String, default: ''},
    state: {type: String, default: ''},
    donatedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

// User is a model/collection
export default mongoose.model('Program', ProgramSchema)