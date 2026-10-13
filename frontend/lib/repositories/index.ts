import { envConfig } from "../config";
import {
  HttpConsultationRepository,
  type IConsultationRepository,
} from "./consultation.repository";

export * from "./consultation.repository";

/**
 * Factory untuk membuat instance ConsultationRepository baru.
 * Apabila baseUrl tidak diberikan, baseUrl akan dibaca secara ketat dari envConfig.apiBaseUrl.
 */
export function createConsultationRepository(baseUrl?: string): IConsultationRepository {
  const targetUrl = baseUrl !== undefined ? baseUrl : envConfig.apiBaseUrl;
  return new HttpConsultationRepository(targetUrl);
}

let sharedConsultationRepository: IConsultationRepository | null = null;

/**
 * Singleton getter untuk ConsultationRepository default pada aplikasi.
 */
export function getConsultationRepository(): IConsultationRepository {
  if (!sharedConsultationRepository) {
    sharedConsultationRepository = createConsultationRepository();
  }
  return sharedConsultationRepository;
}
