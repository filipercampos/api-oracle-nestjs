import cnpj from './cnpj-validation';
import cpf from './cpf-validation';

export class CpfCnpjUtil {
  /**
   * Validate CPF
   */
  static isCpf(value: string) {
    return cpf.isValid(value);
  }

  /**
   * Validate CNPJ
   */
  static isCnpj(value: string) {
    return cnpj.isValid(value);
  }

  static removeMaskCpfCnpj(value: string) {
    return value.replace(/[^0-9]+/g, '');
  }

  static removeMaskCpf(cpf: string): string {
    return cpf.replace(/\.|-/gm, '');
  }
}
