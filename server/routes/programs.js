import {Router} from 'express'
import {addprogram, fetchprograms, fetchSingleProgram, addProgramIdToUser} from '../controllers/programs.js'
import authentication from '../middleware/authentication.js'


const router= Router()


router.get('/', fetchprograms) // -> /programs/
router.get('/:id',fetchSingleProgram)
router.post('/addprogram', addprogram) // -> /programs/addprogram
router.post('/addProgramIdToUser', addProgramIdToUser)
export default router