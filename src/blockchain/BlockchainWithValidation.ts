import * as crypto from 'crypto';
import { Transaction, TransactionValidator } from './Transaction';

export interface ValidatedBlock {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  validatedTransactionCount: number;
}

export class BlockchainWithValidation {
  private chain: ValidatedBlock[] = [];
  private difficulty: number = 4;
  private chainId: string;
  private pendingTransactions: Transaction[] = [];
  private transactionPool: Map<string, Transaction> = new Map();

  constructor() {
    this.chainId = crypto.randomBytes(16).toString('hex');
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: ValidatedBlock = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: '',
      nonce: 0,
      validatedTransactionCount: 0
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
    console.log('✅ Genesis Block criado!');
  }

  public addTransaction(transaction: Omit<Transaction, 'id' | 'isValid'>): boolean {
    const transactionId = TransactionValidator.generateTransactionId(transaction);
    
    const fullTransaction: Transaction = {
      ...transaction,
      id: transactionId,
      isValid: false
    };

    if (!TransactionValidator.validateTransaction(fullTransaction)) {
      console.log('❌ Transação rejeitada - validação falhou');
      return false;
    }

    fullTransaction.isValid = true;
    
    this.transactionPool.set(transactionId, fullTransaction);
    this.pendingTransactions.push(fullTransaction);
    
    console.log(`✅ Transação validada e adicionada ao pool`);
    console.log(`   ID: ${transactionId.substring(0, 16)}...`);
    console.log(`   Valor: ${transaction.amount} XCOIN`);
    
    return true;
  }

  public mineBlock(): ValidatedBlock | null {
    if (this.pendingTransactions.length === 0) {
      console.log('⚠️  Nenhuma transação para minerar');
      return null;
    }

    const validatedTransactions = this.pendingTransactions.filter(tx => tx.isValid);
    
    if (validatedTransactions.length === 0) {
      console.log('❌ Nenhuma transação validada para minerar');
      return null;
    }

    console.log(`\n⛏️  Minerando bloco com ${validatedTransactions.length} transações validadas...`);

    const newBlock: ValidatedBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: validatedTransactions,
      previousHash: this.chain[this.chain.length - 1].hash,
      hash: '',
      nonce: 0,
      validatedTransactionCount: validatedTransactions.length
    };

    const startTime = Date.now();
    while (!newBlock.hash.startsWith('0'.repeat(this.difficulty))) {
      newBlock.nonce++;
      newBlock.hash = this.calculateHash(newBlock);
    }
    const miningTime = Date.now() - startTime;

    console.log(`✅ Bloco minerado em ${miningTime}ms`);
    console.log(`   Índice: ${newBlock.index}`);
    console.log(`   Hash: ${newBlock.hash}`);
    console.log(`   Transações validadas incluídas: ${newBlock.validatedTransactionCount}`);

    this.chain.push(newBlock);
    
    this.pendingTransactions = [];
    validatedTransactions.forEach(tx => {
      this.transactionPool.delete(tx.id);
    });

    return newBlock;
  }

  private calculateHash(block: ValidatedBlock): string {
    const blockString = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions.map(tx => ({
        id: tx.id,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        isValid: tx.isValid
      })),
      previousHash: block.previousHash,
      nonce: block.nonce
    });
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  public isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        console.log(`❌ Hash inválido no bloco ${i}`);
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log(`❌ PreviousHash inválido no bloco ${i}`);
        return false;
      }

      for (const transaction of currentBlock.transactions) {
        if (!TransactionValidator.validateTransaction(transaction)) {
          console.log(`❌ Transação inválida no bloco ${i}`);
          return false;
        }
      }
    }
    return true;
  }

  public getChain(): ValidatedBlock[] {
    return this.chain;
  }

  public getChainId(): string {
    return this.chainId;
  }

  public getDifficulty(): number {
    return this.difficulty;
  }

  public setDifficulty(difficulty: number): void {
    if (difficulty > 0) {
      this.difficulty = difficulty;
    }
  }

  public getLatestBlock(): ValidatedBlock {
    return this.chain[this.chain.length - 1];
  }

  public getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }

  public getTransactionPool(): Map<string, Transaction> {
    return this.transactionPool;
  }

  public getStats(): any {
    const totalValidatedTransactions = this.chain.reduce(
      (sum, block) => sum + block.validatedTransactionCount,
      0
    );

    return {
      chainId: this.chainId,
      totalBlocks: this.chain.length,
      totalValidatedTransactions: totalValidatedTransactions,
      pendingTransactions: this.pendingTransactions.length,
      difficulty: this.difficulty,
      isValid: this.isValid()
    };
  }
}
