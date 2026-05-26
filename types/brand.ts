/**
 * Re-exports del módulo clientes para compatibilidad con importaciones @/types/brand.
 * BrandIntakeFormData es alias de BrandIntakeData para compatibilidad con código externo.
 */
export type { BrandType, BrandIntakeData } from './clientes/brand';
export type { BrandIntakeData as BrandIntakeFormData } from './clientes/brand';
