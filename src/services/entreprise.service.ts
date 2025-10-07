import { EntrepriseRepository } from '../repositories/entreprise.repository';
import { CreateEntrepriseDto, UpdateEntrepriseDto } from '../type/entreprise.type';
import { PaginationParams } from '../type/pagination.types';

export class EntrepriseService {
  private entrepriseRepository: EntrepriseRepository;

  constructor() {
    this.entrepriseRepository = new EntrepriseRepository();
  }

  async createEntreprise(data: CreateEntrepriseDto) {
    return this.entrepriseRepository.create(data);
  }

  async getEntrepriseById(id: number) {
    return this.entrepriseRepository.findById(id);
  }

  async getAllEntreprises(pagination?: PaginationParams) {
    return this.entrepriseRepository.findAll(pagination);
  }

  async updateEntreprise(id: number, data: UpdateEntrepriseDto) {
    return this.entrepriseRepository.update(id, data);
  }

  async deleteEntreprise(id: number) {
    return this.entrepriseRepository.delete(id);
  }
}
