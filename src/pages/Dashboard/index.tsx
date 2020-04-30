import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      api.get('transactions').then(response => {
        const { transactions, balance } = response.data;
        const transactionsWithFormattedData = transactions.map(
          (transaction: Transaction) => {
            const formattedDate = format(
              new Date(transaction.created_at),
              'dd/MM/yyyy',
            );
            let formattedValue;
            if (transaction.type === 'income') {
              formattedValue = `${formatValue(transaction.value)}`;
            } else {
              formattedValue = `${formatValue(transaction.value)}`;
            }

            transaction.formattedDate = formattedDate;
            transaction.formattedValue = formattedValue;
            return transaction;
          },
        );
        setTransactions(transactionsWithFormattedData);
        setBalance(balance);
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              R$ {formatValue(Number(balance.income))}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              R$ {formatValue(Number(balance.outcome))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              R$ {formatValue(Number(balance.total))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transation => {
                return (
                  <tr key={transation.id}>
                    <td className="title">{transation.title}</td>
                    {transation.type === 'income' ? (
                      <td className="income">{transation.formattedValue}</td>
                    ) : (
                      <td className="outcome">- {transation.formattedValue}</td>
                    )}

                    <td>{transation.category.title}</td>
                    <td>{transation.formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
