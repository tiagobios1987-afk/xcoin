import { Blockchain } from '../blockchain/Blockchain';

export class Miner {
  private blockchain: Blockchain;
  private isMining: boolean = false;
  private minedBlocks: number = 0;
  private totalReward: number = 0;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
  }

  public mine(data: any): boolean {
    if (this.isMining) {
      console.log('⚠️ Mineração já em progresso');
      return false;
    }

    this.isMining = true;
    console.log('⛏️ Iniciando mineração...');

    try {
      const startTime = Date.now();
      const newBlock = this.blockchain.addBlock(data);
      const miningTime = Date.now() - startTime;

      this.minedBlocks++;
      const reward = 10; // Recompensa em XCOIN
      this.totalReward += reward;

      console.log(`✅ Bloco minerado com sucesso!`);
      console.log(`   Tempo de mineração: ${miningTime}ms`);
      console.log(`   Recompensa: ${reward} XCOIN`);
      console.log(`   Total minerado: ${this.minedBlocks} blocos`);

      return true;
    } catch (error) {
      console.error('❌ Erro durante a mineração:', error);
      return false;
    } finally {
      this.isMining = false;
    }
  }

  public getMinedBlocks(): number {
    return this.minedBlocks;
  }

  public getTotalReward(): number {
    return this.totalReward;
  }

  public increaseDifficulty(): void {
    const currentDifficulty = this.blockchain.getDifficulty();
    this.blockchain.setDifficulty(currentDifficulty + 1);
    console.log(`📈 Dificuldade aumentada para: ${currentDifficulty + 1}`);
  }

  public decreaseDifficulty(): void {
    const currentDifficulty = this.blockchain.getDifficulty();
    if (currentDifficulty > 1) {
      this.blockchain.setDifficulty(currentDifficulty - 1);
      console.log(`📉 Dificuldade reduzida para: ${currentDifficulty - 1}`);
    }
  }
}
