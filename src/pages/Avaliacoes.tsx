import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { getTurmas } from '../api/turmas';
import './Avaliacoes.css';

interface Criterio {
  id: number;
  nome: string;
  peso: number;
}

const Avaliacoes = () => {
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [turmas, setTurmas] = useState<string[]>([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Omit<Criterio, 'id'>>({ nome: '', peso: 0 });

  useEffect(() => {
    const loadTurmas = async () => {
      try {
        const turmasData = await getTurmas();
        setTurmas(turmasData.map((t: { nome: string }) => t.nome));
        if (turmasData.length > 0) {
          setSelectedTurma(turmasData[0].nome);
        }
      } catch (err) {
        console.error('Erro ao carregar turmas:', err);
      }
    };
    loadTurmas();
  }, []);

  const somaPesos = criterios.reduce((acc, c) => acc + c.peso, 0);
  const isValid = somaPesos === 100;
  const remaining = 100 - somaPesos;

  const handleOpenModal = (criterio?: Criterio) => {
    if (criterio) {
      setEditingId(criterio.id);
      setFormData({ nome: criterio.nome, peso: criterio.peso });
    } else {
      setEditingId(null);
      setFormData({ nome: '', peso: 0 });
    }
    setOpenModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData({ nome: '', peso: 0 });
    setError('');
  };

  const handleSave = () => {
    setError('');
    
    if (!formData.nome.trim()) {
      setError('O nome do critério é obrigatório.');
      return;
    }

    if (formData.peso <= 0) {
      setError('O peso deve ser maior que zero.');
      return;
    }

    const currentSum = editingId
      ? criterios.filter(c => c.id !== editingId).reduce((acc, c) => acc + c.peso, 0)
      : somaPesos;

    if (currentSum + formData.peso > 100) {
      setError(`A soma dos pesos não pode ultrapassar 100%! (Atual: ${currentSum}%, Novo: ${formData.peso}%)`);
      return;
    }

    if (editingId) {
      setCriterios(criterios.map(c => c.id === editingId ? { id: editingId, ...formData } : c));
    } else {
      setCriterios([...criterios, { id: Date.now(), ...formData }]);
    }
    
    handleCloseModal();
  };

  const handleRemove = (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este critério?')) {
      return;
    }
    setCriterios(criterios.filter((c) => c.id !== id));
  };

  const handleUpdatePeso = (id: number, newPeso: number) => {
    if (newPeso < 0 || newPeso > 100) return;
    
    const currentSum = criterios.filter(c => c.id !== id).reduce((acc, c) => acc + c.peso, 0);
    if (currentSum + newPeso > 100) {
      setError(`A soma dos pesos não pode ultrapassar 100%!`);
      return;
    }
    
    setCriterios(criterios.map(c => c.id === id ? { ...c, peso: newPeso } : c));
    setError('');
  };

  return (
    <div className="avaliacoes-page">
      <div className="page-header">
        <div>
          <h1>Configuração de Avaliações</h1>
          <p className="page-subtitle">Configure os critérios de avaliação para cada turma</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Novo Critério</Button>
      </div>

      {turmas.length > 0 && (
        <div className="turma-selector">
          <label htmlFor="turma-select">Selecione a Turma:</label>
          <select
            id="turma-select"
            value={selectedTurma}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTurma(e.target.value)}
            className="turma-select"
          >
            {turmas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {criterios.length > 0 ? (
        <>
          <Table headers={['Nome', 'Peso (%)', 'Ações']}>
            {criterios.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.nome}</strong></td>
                <td>
                  <div className="peso-control">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={c.peso}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdatePeso(c.id, Number(e.target.value))}
                      className="peso-input"
                    />
                    <span>%</span>
                  </div>
                </td>
                <td>
                  <Button variant="secondary" onClick={() => handleOpenModal(c)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(c.id)}>
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </Table>

          <div className="peso-summary">
            <div className={`peso-total ${isValid ? 'peso-valid' : 'peso-invalid'}`}>
              <strong>Total: {somaPesos}%</strong>
              {!isValid && (
                <span className="peso-warning">
                  {remaining > 0 ? `Faltam ${remaining}%` : `Excedeu ${Math.abs(remaining)}%`}
                </span>
              )}
            </div>
            {isValid && (
              <div className="success-message">
                ✅ Configuração válida! A soma dos pesos é 100%.
              </div>
            )}
            {!isValid && (
              <div className="warning-message">
                ⚠️ A soma dos pesos deve ser exatamente 100% para salvar a configuração.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Nenhum critério configurado. Adicione critérios para começar.</p>
        </div>
      )}

      <Modal
        open={openModal}
        title={editingId ? 'Editar Critério' : 'Novo Critério'}
        onClose={handleCloseModal}
      >
        {error && <div className="error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}
        <Input
          label="Nome do Critério"
          placeholder="Ex: Prova 1, Trabalho, Participação"
          value={formData.nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
        <Input
          label="Peso (%)"
          type="number"
          min="1"
          max="100"
          value={formData.peso}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, peso: Number(e.target.value) })}
          required
        />
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

export default Avaliacoes;
