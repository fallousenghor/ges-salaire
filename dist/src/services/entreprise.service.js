"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepriseService = void 0;
const entreprise_repository_1 = require("../repositories/entreprise.repository");
class EntrepriseService {
    constructor() {
        this.entrepriseRepository = new entreprise_repository_1.EntrepriseRepository();
    }
    async createEntreprise(data) {
        return this.entrepriseRepository.create(data);
    }
    async getEntrepriseById(id) {
        return this.entrepriseRepository.findById(id);
    }
    async getAllEntreprises(pagination) {
        return this.entrepriseRepository.findAll(pagination);
    }
    async updateEntreprise(id, data) {
        return this.entrepriseRepository.update(id, data);
    }
    async deleteEntreprise(id) {
        return this.entrepriseRepository.delete(id);
    }
}
exports.EntrepriseService = EntrepriseService;
