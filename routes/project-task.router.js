const { Router } = require('express');
const { matchProject } = require('../middleware/project.middleware');
const taskController = require('../controllers/project-task.controller');
const { matchTask } = require('../middleware/project-task.middleware');

const router = Router();

router.get('/list/:type', taskController.task_list_get);
router.post('/', matchProject, taskController.task_create_post);
router.put('/:id', matchTask, taskController.task_update_put);
router.get('/:id', matchTask, taskController.task_details);
router.delete('/:id', matchTask, taskController.task_delete);

router.use('*', async (req, res) => {
	res.status(404).json();
});

module.exports = router;
