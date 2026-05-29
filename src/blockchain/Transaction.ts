import * as crypto from 'crypto';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature?: string;
  isValid: boolean;
}

export class TransactionValidator {
  public static validateTransaction(transaction: Transaction): boolean {
    if (transaction.amount <= 0) {
      console.log('❌ Transação inválida: montante deve ser maior que 0');
      return false;
    }

    if (!this.isValidAddress(transaction.from)) {
      console.log('❌ Transação inválida: endereço "de" inválido');
      return false;
    }

    if (!this.isValidAddress(transaction.to)) {
      console.log('❌ Transação inválida: endereço "para" inválido');
      return false;
    }

    if (transaction.from === transaction.to) {
      console.log('❌ Transação inválida: não pode enviar para a mesma carteira');
      return false;
    }

    if (transaction.timestamp > Date.now()) {
      console.log('❌ Transação inválida: timestamp no futuro');
      return false;
    }

    return true;
  }

  public static isValidAddress(address: string): boolean {
    return /^0x[a-f0-9]{40}$/.test(address);
  }

  public static generateTransactionId(transaction: Omit<Transaction, 'id' | 'isValid'>): string {
    const data = JSON.stringify({
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      timestamp: transaction.timestamp
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public static calculateTransactionHash(transaction: Transaction): string {
    const data = JSON.stringify({
      id: transaction.id,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      timestamp: transaction.timestamp
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
