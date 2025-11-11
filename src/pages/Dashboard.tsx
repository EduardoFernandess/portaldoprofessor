import { useEffect, useState } from 'react';
import { Table } from '../components/Table';
import { Loader } from '../components/Loader';
import { getAlunos } from '../api/alunos';
import { getTurmas } from '../api/turmas';
import './Dashboard.css';

interface SummaryData {
  totalAlunos: number;
  totalTurmas: number;
  proximasAvaliacoes: {
    id: number;
    turma: string;
    data: string;
    descricao: string;
  }[];
}

const Dashboard = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alunos, turmas] = await Promise.all([getAlunos(), getTurmas()]);
      
      setData({
        totalAlunos: alunos.length,
        totalTurmas: turmas.length,
        proximasAvaliacoes: [
          { id: 1, turma: 'Turma A', data: '2025-11-15', descricao: 'Prova 1 - Matemática' },
          { id: 2, turma: 'Turma B', data: '2025-11-20', descricao: 'Trabalho de História' },
          { id: 3, turma: 'Turma C', data: '2025-11-25', descricao: 'Avaliação Final - Ciências' },
        ],
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Atualiza o dashboard quando dados são modificados
    const handleDataChange = () => {
      fetchData();
    };
    
    // Escuta eventos customizados de mudança de dados
    window.addEventListener('aluno-changed', handleDataChange);
    window.addEventListener('turma-changed', handleDataChange);
    
    // Atualiza quando a página recebe foco
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('aluno-changed', handleDataChange);
      window.removeEventListener('turma-changed', handleDataChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) return <Loader />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Visão geral do sistema acadêmico</p>
      </div>

      {/* Resumo em Cards */}
      <div className="dashboard-summary">
        <div className="summary-card card-students">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h2>{data?.totalAlunos || 0}</h2>
            <p>Total de Alunos</p>
          </div>
        </div>
        <div className="summary-card card-classes">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h2>{data?.totalTurmas || 0}</h2>
            <p>Total de Turmas</p>
          </div>
        </div>
      </div>

      {/* Próximas Avaliações */}
      <div className="dashboard-section">
        <h2 className="section-title">Próximas Avaliações</h2>
        {data?.proximasAvaliacoes && data.proximasAvaliacoes.length > 0 ? (
          <Table headers={['Turma', 'Data', 'Descrição']}>
            {data.proximasAvaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id}>
                <td><strong>{avaliacao.turma}</strong></td>
                <td>{formatDate(avaliacao.data)}</td>
                <td>{avaliacao.descricao}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="empty-state">
            <p>Nenhuma avaliação agendada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


