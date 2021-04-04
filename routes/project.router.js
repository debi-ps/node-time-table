const { Router } = require('express');
const projectController = require('../controllers/project.controller');

const router = Router();

router.get('/', projectController.project_list_get);
router.get('/owned', projectController.project_owned_list_get);
router.post('/', projectController.project_create_post);
router.put('/:id', projectController.project_update_put);
router.get('/:id', projectController.project_details);
router.delete('/:id', projectController.project_delete);

module.exports = router;
