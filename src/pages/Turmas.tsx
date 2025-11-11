import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Loader } from '../components/Loader';
import { getTurmas, createTurma, updateTurma, deleteTurma, Turma } from '../api/turmas';
import { getAlunos, updateAluno, Aluno } from '../api/alunos';
import './Turmas.css';

const Turmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openAssociateModal, setOpenAssociateModal] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<Turma, 'id' | 'alunos'>>({
    nome: '',
    capacidade: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [turmasData, alunosData] = await Promise.all([getTurmas(), getAlunos()]);
      setTurmas(turmasData);
      setAlunos(alunosData);
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (turma?: Turma) => {
    if (turma) {
      setEditingId(turma.id);
      setFormData({
        nome: turma.nome,
        capacidade: turma.capacidade,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: 0,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      capacidade: 0,
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      if (editingId) {
        await updateTurma(editingId, formData);
        setSuccess('Turma atualizada com sucesso!');
      } else {
        await createTurma(formData);
        setSuccess('Turma criada com sucesso!');
      }
      await loadData();
      // Dispara evento para atualizar o Dashboard
      window.dispatchEvent(new CustomEvent('turma-changed'));
      handleCloseModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar turma. Tente novamente.');
      console.error(err);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover esta turma?')) {
      return;
    }
    try {
      setError('');
      await deleteTurma(id);
      await loadData();
    } catch (err) {
      setError('Erro ao remover turma. Tente novamente.');
      console.error(err);
    }
  };

  const handleOpenAssociate = (turma: Turma) => {
    setSelectedTurma(turma);
    setOpenAssociateModal(true);
  };

  const handleAssociateStudent = async (alunoId: number) => {
    if (!selectedTurma) return;
    try {
      setError('');
      const aluno = alunos.find(a => a.id === alunoId);
      if (aluno) {
        await updateAluno(alunoId, { turma: selectedTurma.nome });
        await loadData();
      }
      setOpenAssociateModal(false);
      setSelectedTurma(null);
    } catch (err) {
      setError('Erro ao associar aluno. Tente novamente.');
      console.error(err);
    }
  };

  const alunosSemTurma = alunos.filter(a => !a.turma || a.turma === '');
  const alunosNaTurma = selectedTurma
    ? alunos.filter(a => a.turma === selectedTurma.nome)
    : [];

  if (loading) return <Loader />;

  return (
    <div className="turmas-page">
      <div className="page-header">
        <div>
          <h1>Turmas</h1>
          <p className="page-subtitle">Gerencie as turmas do sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Nova Turma</Button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {turmas.length > 0 ? (
        <Table headers={['Nome', 'Capacidade', 'Alunos', 'Ocupação', 'Ações']}>
          {turmas.map((t) => {
            const ocupacao = t.capacidade > 0 ? Math.round((t.alunos / t.capacidade) * 100) : 0;
            return (
              <tr key={t.id}>
                <td><strong>{t.nome}</strong></td>
                <td>{t.capacidade}</td>
                <td>{t.alunos}</td>
                <td>
                  <div className="ocupacao-bar">
                    <div
                      className="ocupacao-fill"
                      style={{ width: `${ocupacao}%`, backgroundColor: ocupacao >= 100 ? '#f5576c' : ocupacao >= 80 ? '#ffc107' : '#28a745' }}
                    />
                    <span className="ocupacao-text">{ocupacao}%</span>
                  </div>
                </td>
                <td>
                  <Button variant="secondary" onClick={() => handleOpenAssociate(t)}>
                    Associar Alunos
                  </Button>
                  <Button variant="secondary" onClick={() => handleOpenModal(t)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(t.id)}>
                    Remover
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <div className="empty-state">
          <p>Nenhuma turma cadastrada.</p>
        </div>
      )}

      {/* Modal de Criar/Editar */}
      <Modal
        open={openModal}
        title={editingId ? 'Editar Turma' : 'Nova Turma'}
        onClose={handleCloseModal}
      >
        <Input
          label="Nome da Turma"
          value={formData.nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
        <Input
          label="Capacidade"
          type="number"
          min="1"
          value={formData.capacidade}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
          required
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button onClick={handleSave}>Salvar</Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Modal de Associar Alunos */}
      <Modal
        open={openAssociateModal}
        title={`Associar Alunos - ${selectedTurma?.nome}`}
        onClose={() => {
          setOpenAssociateModal(false);
          setSelectedTurma(null);
        }}
      >
        <div className="associate-section">
          <h4>Alunos na Turma ({alunosNaTurma.length})</h4>
          {alunosNaTurma.length > 0 ? (
            <div className="alunos-list">
              {alunosNaTurma.map((a) => (
                <div key={a.id} className="aluno-item">
                  <span>{a.nome}</span>
                  <span className="aluno-email">{a.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">Nenhum aluno associado a esta turma.</p>
          )}
        </div>

        {alunosSemTurma.length > 0 && (
          <div className="associate-section">
            <h4>Alunos sem Turma ({alunosSemTurma.length})</h4>
            <div className="alunos-list">
              {alunosSemTurma.map((a) => (
                <div key={a.id} className="aluno-item">
                  <span>{a.nome}</span>
                  <span className="aluno-email">{a.email}</span>
                  <Button
                    variant="secondary"
                    onClick={() => handleAssociateStudent(a.id)}
                    style={{ marginLeft: 'auto' }}
                  >
                    Associar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {alunosSemTurma.length === 0 && (
          <p className="empty-text">Todos os alunos já estão associados a uma turma.</p>
        )}
      </Modal>
    </div>
  );
};

export default Turmas;
