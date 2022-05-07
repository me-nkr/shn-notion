import { Router } from 'express';
import { addSubGoal, init, createGoal, deleteGoal, getGoal, getGoals, removeSubGoal, updateGoal, verify } from './controllers/index.js';

const router = Router();

router.get('/verify/:database', verify);
router.post('/init/:database', init);

router.get('/database/:dataase', getGoals);

router.get('/goals/:goal', getGoal);
router.post('/goals/', createGoal);
router.patch('/goals/:goal', updateGoal);
router.delete('/goals/:goal', deleteGoal);

router.post('/goals/subgoal/:subgoal', addSubGoal);
router.patch('/goals/subgoal/:subgoal', removeSubGoal);

export default router;