/**
 * XCOIN - Criptomoeda Universal
 * Ponto de entrada da aplicação
 */

import { Blockchain } from './blockchain/Blockchain';
import { Wallet } from './wallet/Wallet';
import { Miner } from './mining/Miner';

class XCOINNode {
  private blockchain: Blockchain;
  private wallet: Wallet;
  private miner: Miner;

  constructor() {
    this.blockchain = new Blockchain();
    this.wallet = new Wallet();
    this.miner = new Miner(this.blockchain);
  }

  public start(): void {
    console.log('\n🚀 ================================');
    console.log('🚀 XCOIN Cryptocurrency Node');
    console.log('🚀 ================================\n');
    
    console.log('📊 Informações da Blockchain:');
    console.log('   ID da Chain:', this.blockchain.getChainId());
    console.log('   Blocos:', this.blockchain.getChain().length);
    console.log('   Válida:', this.blockchain.isValid() ? '✅ Sim' : '❌ Não');
    
    console.log('\n💼 Sua Carteira:');
    console.log('   Endereço:', this.wallet.getAddress());
    console.log('   Saldo:', this.wallet.getBalance(), 'XCOIN');
    
    console.log('\n⛏️ Mineração:');
    console.log('   Dificuldade:', this.blockchain.getDifficulty());
    
    // Exemplo: Adicionar um bloco
    console.log('\n📝 Adicionando novo bloco...');
    const novoBloco = this.blockchain.addBlock({
      transacao: `Transferência para endereço ${this.wallet.getAddress()}`,
      valor: 10,
      timestamp: new Date().toISOString()
    });
    console.log('   Bloco adicionado com sucesso!');
    console.log('   Hash:', novoBloco.hash);
    console.log('   Nonce:', novoBloco.nonce);
    
    console.log('\n✅ Node iniciado com sucesso!\n');
  }
}

// Iniciar o nó
const node = new XCOINNode();
node.start();

export { XCOINNode };
