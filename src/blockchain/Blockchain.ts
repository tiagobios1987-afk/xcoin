import * as crypto from 'crypto';

export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

export class Blockchain {
  private chain: Block[] = [];
  private difficulty: number = 4;
  private chainId: string;

  constructor() {
    this.chainId = crypto.randomBytes(16).toString('hex');
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      data: { message: 'Genesis Block - XCOIN Cryptocurrency' },
      previousHash: '0',
      hash: '',
      nonce: 0
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
    console.log('✅ Genesis Block criado!');
  }

  private calculateHash(block: Block): string {
    const blockString = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce
    });
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  public addBlock(data: any): Block {
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      data: data,
      previousHash: this.chain[this.chain.length - 1].hash,
      hash: '',
      nonce: 0
    };

    // Proof of Work
    console.log('⏳ Minerando bloco...');
    const startTime = Date.now();
    
    while (!newBlock.hash.startsWith('0'.repeat(this.difficulty))) {
      newBlock.nonce++;
      newBlock.hash = this.calculateHash(newBlock);
    }
    
    const miningTime = Date.now() - startTime;
    console.log(`✅ Bloco minerado em ${miningTime}ms`);

    this.chain.push(newBlock);
    return newBlock;
  }

  public getChain(): Block[] {
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

  public isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}
