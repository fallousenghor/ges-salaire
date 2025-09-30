import { Router } from 'express';
import { UserEntrepriseController } from '../controllers/userEntreprise.controller';

const router = Router();

router.post('/', UserEntrepriseController.addUserToEntreprise);
router.get('/:entrepriseId', UserEntrepriseController.getUsersByEntreprise);
router.delete('/:id', UserEntrepriseController.removeUserFromEntreprise);

export default router;
