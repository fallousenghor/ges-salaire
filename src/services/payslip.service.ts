
import prisma from "../config/db";
import { CreatePayslipDto, UpdatePayslipDto } from "../type/payslip.types";
import { PaginationParams } from "../type/pagination.types";
import { paginateResults } from "../utils/pagination.utils";

export class PayslipService {

  async getAllPayslipsPaginated(entrepriseId: number | undefined, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where = entrepriseId ? {
      employe: {
        entrepriseId
      }
    } : undefined;

    const [items, total] = await Promise.all([
      prisma.payslip.findMany({
        where,
        include: {
          employe: true,
          payrun: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.payslip.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      items,
      total,
      page,
      totalPages,
      hasMore
    };
  }

  async getAllPayslips(entrepriseId?: number) {
    return prisma.payslip.findMany({
      where: entrepriseId ? {
        employe: {
          entrepriseId
        }
      } : undefined,
      include: {
        employe: true,
        payrun: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getPayslipsByEmployePaginated(employeId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [payslips, total] = await Promise.all([
      prisma.payslip.findMany({ where: { employeId }, skip, take: limit }),
      prisma.payslip.count({ where: { employeId } })
    ]);
    return { payslips, total, page, limit };
  }

  async updatePayslipStatus(id: number, statut: string) {
    // Cast statut to Prisma enum
    return prisma.payslip.update({ where: { id }, data: { statut: statut as any } });
  }

  // Utilitaires pour PDF
  async getEmployeById(id: number) {
    return prisma.employe.findUnique({ where: { id } });
  }

  async getEntrepriseById(id: number) {
    return prisma.entreprise.findUnique({ where: { id } });
  }

  async createPayslip(data: CreatePayslipDto) {
    return prisma.payslip.create({ data });
  }

  async getPayslipsByEmploye(employeId: number) {
    return prisma.payslip.findMany({ where: { employeId } });
  }

  async getPayslipsByPayrun(payrunId: number, pagination?: PaginationParams) {
    const total = await prisma.payslip.count({
      where: { payrunId }
    });

    const items = await prisma.payslip.findMany({
      where: { payrunId },
      include: { employe: true },
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit,
      orderBy: { createdAt: 'desc' }
    });

    return pagination ? paginateResults(items, total, pagination) : items;
  }

  async getPayslipById(id: number) {
    return prisma.payslip.findUnique({ where: { id } });
  }

  async updatePayslip(id: number, data: UpdatePayslipDto) {
    return prisma.payslip.update({ where: { id }, data });
  }

  async payPayslip(id: number) {
    // Set statut to 'PAYE' to mark as paid
    return prisma.payslip.update({ where: { id }, data: { statut: 'PAYE' } });
  }

  async deletePayslip(id: number) {
    return prisma.payslip.delete({ where: { id } });
  }
}
