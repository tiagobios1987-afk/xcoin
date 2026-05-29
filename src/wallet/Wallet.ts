import * as crypto from 'crypto';

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

export class Wallet {
  private address: string;
  private balance: number = 1000; // Saldo inicial em XCOIN
  private transactions: Transaction[] = [];
  private privateKey: string;

  constructor() {
    this.privateKey = crypto.randomBytes(32).toString('hex');
    this.address = this.generateAddress();
  }

  private generateAddress(): string {
    const hash = crypto.createHash('sha256');
    hash.update(this.privateKey);
    return '0x' + hash.digest('hex').substring(0, 40);
  }

  public getAddress(): string {
    return this.address;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(amount: number): void {
    if (amount >= 0) {
      this.balance = amount;
    }
  }

  public addBalance(amount: number): void {
    this.balance += amount;
  }

  public subtractBalance(amount: number): boolean {
    if (amount > this.balance) {
      console.log('❌ Saldo insuficiente');
      return false;
    }
    this.balance -= amount;
    return true;
  }

  public sendTransaction(to: string, amount: number): boolean {
    if (!this.subtractBalance(amount)) {
      return false;
    }

    const transaction: Transaction = {
      from: this.address,
      to: to,
      amount: amount,
      timestamp: Date.now()
    };

    this.transactions.push(transaction);
    console.log(`✅ Transação realizada: ${amount} XCOIN para ${to}`);
    return true;
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getTransactionCount(): number {
    return this.transactions.length;
  }

  public getPrivateKey(): string {
    return this.privateKey;
  }
}
