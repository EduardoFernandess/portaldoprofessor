import { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Loader } from '../components/Loader';
import { getAlunos, createAluno, updateAluno, deleteAluno, Aluno } from '../api/alunos';
import { getTurmas } from '../api/turmas';
import './Alunos.css';

const Alunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [turmas, setTurmas] = useState<string[]>([]);
  
  // Estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Ativo' | 'Inativo'>('all');

  const [formData, setFormData] = useState<Omit<Aluno, 'id'>>({
    nome: '',
    email: '',
    turma: '',
    status: 'Ativo',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [alunosData, turmasData] = await Promise.all([getAlunos(), getTurmas()]);
      // Garante que os dados são atualizados corretamente
      setAlunos([...alunosData]);
      setTurmas(turmasData.map((t: { nome: string }) => t.nome));
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAlunos = useCallback(() => {
    let filtered = [...alunos];

    // Busca por nome ou e-mail
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtra por turma
    if (filterTurma) {
      filtered = filtered.filter((a) => a.turma === filterTurma);
    }

    // Filtra por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    setFilteredAlunos(filtered);
  }, [alunos, searchTerm, filterTurma, filterStatus]);

  useEffect(() => {
    filterAlunos();
  }, [filterAlunos]);

  const handleOpenModal = (aluno?: Aluno) => {
    if (aluno) {
      setEditingId(aluno.id);
      setFormData({
        nome: aluno.nome,
        email: aluno.email,
        turma: aluno.turma,
        status: aluno.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        turma: '',
        status: 'Ativo',
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      email: '',
      turma: '',
      status: 'Ativo',
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      if (editingId) {
        await updateAluno(editingId, formData);
        setSuccess('Aluno atualizado com sucesso!');
      } else {
        await createAluno(formData);
        setSuccess('Aluno criado com sucesso!');
      }
      await loadData();
      // Dispara evento para atualizar o Dashboard
      window.dispatchEvent(new CustomEvent('aluno-changed'));
      handleCloseModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar aluno. Tente novamente.');
      console.error(err);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este aluno?')) {
      return;
    }
    try {
      setError('');
      await deleteAluno(id);
      await loadData();
      // Dispara evento para atualizar o Dashboard
      window.dispatchEvent(new CustomEvent('aluno-changed'));
    } catch (err) {
      setError('Erro ao remover aluno. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="alunos-page">
      <div className="page-header">
        <div>
          <h1>Alunos</h1>
          <p className="page-subtitle">Gerencie os alunos do sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Novo Aluno</Button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {/* Busca e Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterTurma}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterTurma(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as turmas</option>
            {turmas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as 'all' | 'Ativo' | 'Inativo')}
            className="filter-select"
          >
            <option value="all">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      {filteredAlunos.length > 0 ? (
        <Table headers={['Nome', 'E-mail', 'Turma', 'Status', 'Ações']}>
          {filteredAlunos.map((a) => (
            <tr key={a.id}>
              <td><strong>{a.nome}</strong></td>
              <td>{a.email}</td>
              <td>{a.turma}</td>
              <td>
                <span className={`status-badge status-${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleOpenModal(a)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleRemove(a.id)}>
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <div className="empty-state">
          <p>{searchTerm || filterTurma || filterStatus !== 'all' ? 'Nenhum aluno encontrado com os filtros aplicados.' : 'Nenhum aluno cadastrado.'}</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={openModal}
        title={editingId ? 'Editar Aluno' : 'Novo Aluno'}
        onClose={handleCloseModal}
      >
        <Input
          label="Nome"
          value={formData.nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div className="input-group">
          <label>Turma</label>
          <select
            value={formData.turma}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, turma: e.target.value })}
            required
            className={formData.turma ? '' : 'input-error'}
          >
            <option value="">Selecione uma turma</option>
            {turmas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button onClick={handleSave}>Salvar</Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Alunos;
