import { Transaction, TransactionValidator } from '../src/blockchain/Transaction';

describe('Transaction Validator', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = {
      id: 'test-id',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      amount: 100,
      timestamp: Date.now(),
      isValid: false
    };
  });

  describe('Validate Transaction', () => {
    it('deve validar uma transação válida', () => {
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(true);
    });

    it('deve rejeitar transação com montante <= 0', () => {
      transaction.amount = 0;
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });

    it('deve rejeitar transação com montante negativo', () => {
      transaction.amount = -50;
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });

    it('deve rejeitar endereço "de" inválido', () => {
      transaction.from = '0xinvalid';
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });

    it('deve rejeitar endereço "para" inválido', () => {
      transaction.to = 'invalid-address';
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });

    it('deve rejeitar se endereços são iguais', () => {
      transaction.from = '0x1234567890123456789012345678901234567890';
      transaction.to = '0x1234567890123456789012345678901234567890';
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });

    it('deve rejeitar timestamp no futuro', () => {
      transaction.timestamp = Date.now() + 10000;
      transaction.isValid = true;
      const result = TransactionValidator.validateTransaction(transaction);
      expect(result).toBe(false);
    });
  });

  describe('Address Validation', () => {
    it('deve validar endereço correto', () => {
      const validAddress = '0x1234567890123456789012345678901234567890';
      expect(TransactionValidator.isValidAddress(validAddress)).toBe(true);
    });

    it('deve rejeitar endereço sem 0x', () => {
      const invalidAddress = '1234567890123456789012345678901234567890';
      expect(TransactionValidator.isValidAddress(invalidAddress)).toBe(false);
    });

    it('deve rejeitar endereço com comprimento errado', () => {
      const invalidAddress = '0x123456789';
      expect(TransactionValidator.isValidAddress(invalidAddress)).toBe(false);
    });

    it('deve rejeitar endereço com caracteres inválidos', () => {
      const invalidAddress = '0xGGGG567890123456789012345678901234567890';
      expect(TransactionValidator.isValidAddress(invalidAddress)).toBe(false);
    });
  });

  describe('Transaction ID Generation', () => {
    it('deve gerar ID consistente para mesma transação', () => {
      const txData = {
        from: transaction.from,
        to: transaction.to,
        amount: transaction.amount,
        timestamp: 1000000,
        signature: undefined
      };

      const id1 = TransactionValidator.generateTransactionId(txData);
      const id2 = TransactionValidator.generateTransactionId(txData);

      expect(id1).toBe(id2);
    });

    it('deve gerar IDs diferentes para transações diferentes', () => {
      const tx1Data = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        amount: 100,
        timestamp: Date.now(),
        signature: undefined
      };

      const tx2Data = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        amount: 200,
        timestamp: Date.now(),
        signature: undefined
      };

      const id1 = TransactionValidator.generateTransactionId(tx1Data);
      const id2 = TransactionValidator.generateTransactionId(tx2Data);

      expect(id1).not.toBe(id2);
    });
  });
});
