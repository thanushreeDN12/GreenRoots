import {Router} from 'express'
import { addProgramIdToUser, getUser, getLeaderboard, getUserImpact } from '../controllers/programs.js'
import { sendImpactEmail } from '../controllers/impactEmail.js'
import authentication from '../middleware/authentication.js'


const router= Router()

router.get('/me/impact', authentication, getUserImpact)
router.post('/addProgramIdToUser', addProgramIdToUser)
router.get('/getUser/:id',getUser)
router.get('/leaderboard', getLeaderboard)
router.get('/me/send-impact-email', authentication, async (req, res) => {
    await sendImpactEmail(req.userid);
    res.json({ message: "Email triggered." });
});
export default router