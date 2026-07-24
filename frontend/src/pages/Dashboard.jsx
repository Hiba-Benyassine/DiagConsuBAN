import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getStats, getIncidents, analyzeWithAI } from '../services/api';

const MOCK_USER = { nom: 'Ahmed', prenom: 'Ali', role: 'Consultant' };

const ERP_MODULES = {
  Oracle: ['Accounts Payable (AP)', 'Accounts Receivable (AR)', 'General Ledger (GL)', 'Purchasing (PO)', 'Inventory (INV)', 'Fixed Assets (FA)', 'Cash Management (CE)'],
  Odoo:   ['Comptabilité', 'Achats', 'Ventes', 'Inventaire', 'CRM', 'RH', 'Projets'],
};

const PRIORITIES = ['Faible', 'Moyenne', 'Haute', 'Critique'];

const MOCK_INCIDENTS = [
  { _id: '1', numRef: 'INC-2024-057', titre: 'Erreur rapprochement facture AP', erp: 'Oracle', module: 'Accounts Payable', status: 'Résolu',   createdAt: '2025-07-24' },
  { _id: '2', numRef: 'INC-2024-056', titre: 'Problème création PO',            erp: 'Oracle', module: 'Purchasing',       status: 'En cours', createdAt: '2025-07-23' },
  { _id: '3', numRef: 'INC-2024-055', titre: 'Facture non validée Odoo',         erp: 'Odoo',   module: 'Comptabilité',     status: 'Ouvert',   createdAt: '2025-07-22' },
  { _id: '4', numRef: 'INC-2024-054', titre: 'Erreur calcul taxes Odoo',         erp: 'Odoo',   module: 'Ventes',           status: 'Résolu',   createdAt: '2025-07-21' },
];

const MOCK_SOLUTIONS = [
  { titre: 'Procédure annulation facture Oracle AP', date: '24/07/2025' },
  { titre: 'Correction erreur rapprochement PO',     date: '23/07/2025' },
  { titre: 'Résolution problème création facture Odoo', date: '22/07/2025' },
];

const MOCK_AI_CHECKS = [
  'Vérifier le statut de la commande (PO)',
  'Vérifier les lignes et expéditions',
  'Vérifier les distributions rapprochées',
  'Proposer la requête SQL adaptée',
];

function StatusBadge({ status }) {
  const map = {
    'Résolu':   'badge badge-resolu',
    'En cours': 'badge badge-encours',
    'Ouvert':   'badge badge-ouvert',
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
}

function ErpBadge({ erp }) {
  return (
    <span className={erp === 'Oracle' ? 'badge-erp-oracle' : 'badge-erp-odoo'}>
      {erp === 'Oracle' ? '🔴' : '🔵'} {erp}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]         = useState({ incidentsOuverts: 24, incidentsResolus: 56, solutionsValidees: 128, incidentsEnCours: 7, tauxResolution: 92 });
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [loadingStats, setLoadingStats] = useState(true);

  // Form state
  const [form, setForm] = useState({ erp: 'Oracle', module: '', priorite: 'Moyenne', titre: '', description: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult]   = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(true);

  useEffect(() => {
    // Fetch real stats
    getStats()
      .then(res => setStats(res.data))
      .catch(() => {}) // keep mock on error
      .finally(() => setLoadingStats(false));

    // Fetch incidents
    getIncidents({ limit: 5 })
      .then(res => { if (res.data?.length) setIncidents(res.data); })
      .catch(() => {});
  }, []);

  const modules = ERP_MODULES[form.erp] || [];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'erp' ? { module: '' } : {}) }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.description || !form.module) {
      alert('Veuillez remplir la description et le module.');
      return;
    }
    setAnalyzing(true);
    try {
      const res = await analyzeWithAI({
        erp: form.erp,
        module: form.module,
        titre: form.titre,
        description: form.description,
        priorite: form.priorite,
      });
      setAiResult(res.data);
    } catch {
      setAiResult({ causesProbables: MOCK_AI_CHECKS, etapesResolution: MOCK_AI_CHECKS });
    } finally {
      setAnalyzing(false);
    }
  };

  const prioriteColor = { Faible: 'var(--color-success)', Moyenne: 'var(--color-warning)', Haute: 'var(--color-danger)', Critique: 'var(--prio-critique)' };

  return (
    <div className="app-layout">
      <Sidebar user={MOCK_USER} />

      <div className="main-content">
        <Topbar user={MOCK_USER} />

        <div className="page-body animate-fade-up">

          {/* ── Stat Cards ── */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap blue">📋</div>
              <div className="stat-info">
                <div className="stat-value">{stats.incidentsOuverts}</div>
                <div className="stat-label">Incidents ouverts</div>
                <div className="stat-trend">+12 ce mois</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap green">✅</div>
              <div className="stat-info">
                <div className="stat-value">{stats.incidentsResolus}</div>
                <div className="stat-label">Incidents résolus</div>
                <div className="stat-trend success">+18 ce mois</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap purple">📖</div>
              <div className="stat-info">
                <div className="stat-value">{stats.solutionsValidees}</div>
                <div className="stat-label">Solutions validées</div>
                <div className="stat-trend">+22 ce mois</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap orange">⏳</div>
              <div className="stat-info">
                <div className="stat-value">{stats.incidentsEnCours}</div>
                <div className="stat-label">En attente</div>
                <div className="stat-trend warning">+3 ce mois</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap cyan">📈</div>
              <div className="stat-info">
                <div className="stat-value">{stats.tauxResolution}%</div>
                <div className="stat-label">Taux de résolution</div>
                <div className="stat-trend success">Excellente</div>
              </div>
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div className="dashboard-grid">

            {/* LEFT */}
            <div className="dashboard-left">

              {/* Create Incident Card */}
              <div className="card form-card-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="card-header">
                  <span className="card-icon">✨</span>
                  <div>
                    <h3>Créer un nouvel incident</h3>
                    <p style={{ fontSize: '11px', color: 'var(--ban-gray-500)', fontWeight: 400 }}>
                      Décrivez votre problème, l'IA analysera et proposera des solutions adaptées.
                    </p>
                  </div>
                </div>

                {/* Robot illustration */}
                <div style={{
                  position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
                  fontSize: '80px', opacity: 0.12, pointerEvents: 'none', userSelect: 'none'
                }}>🤖</div>

                <div className="card-body">
                  <form onSubmit={handleAnalyze}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">ERP concerné</label>
                        <select name="erp" className="form-control" value={form.erp} onChange={handleFormChange}>
                          <option value="Oracle">Oracle E-Business Suite</option>
                          <option value="Odoo">Odoo</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Module</label>
                        <select name="module" className="form-control" value={form.module} onChange={handleFormChange}>
                          <option value="">-- Sélectionner --</option>
                          {modules.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{ maxWidth: '140px' }}>
                        <label className="form-label">Niveau de criticité</label>
                        <select name="priorite" className="form-control" value={form.priorite} onChange={handleFormChange}>
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Titre du problème</label>
                      <input
                        name="titre"
                        className="form-control"
                        placeholder="Impossible d'annuler une facture Oracle AP"
                        value={form.titre}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Description / Message d'erreur</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={3}
                        placeholder="Le système indique que la facture est rapprochée d'une commande définitivement fermée..."
                        value={form.description}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => navigate('/incidents/new')}
                      >
                        📝 Formulaire complet
                      </button>
                      <button
                        id="analyze-btn-dashboard"
                        type="submit"
                        className="btn btn-cyan"
                        disabled={analyzing}
                      >
                        {analyzing ? <><span className="loading-spinner" /> Analyse en cours...</> : '🤖 Analyser avec l\'IA'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Last Incidents Table */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📋</span>
                  <h3>Mes derniers incidents</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>ERP</th>
                        <th>Module</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map((inc, i) => (
                        <tr key={inc._id || i}>
                          <td>
                            <span className="incident-id">
                              {inc.numRef || `INC-2024-0${50 + i}`}
                            </span>
                          </td>
                          <td>
                            <span className="table-title">{inc.titre || inc.title}</span>
                          </td>
                          <td><ErpBadge erp={inc.erp || 'Oracle'} /></td>
                          <td style={{ color: 'var(--ban-gray-600)', fontSize: '12px' }}>{inc.module}</td>
                          <td><StatusBadge status={inc.status || 'Ouvert'} /></td>
                          <td style={{ color: 'var(--ban-gray-500)', fontSize: '12px' }}>
                            {inc.createdAt ? new Date(inc.createdAt).toLocaleDateString('fr-FR') : '—'}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline btn-sm btn-icon"
                              title="Voir"
                              onClick={() => navigate(`/incidents/${inc._id}`)}
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '14px 20px', borderTop: '1px solid var(--ban-gray-100)' }}>
                  <span
                    className="see-all-link"
                    onClick={() => navigate('/incidents')}
                  >
                    Voir tous mes incidents →
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="dashboard-right">

              {/* AI Assistant Panel */}
              <div className="ai-panel">
                <div className="ai-panel-header">
                  <div>
                    <div className="ai-status">
                      <div className="ai-status-dot" />
                      <span className="ai-status-text">Assistant IA</span>
                    </div>
                    <div className="ai-status-sub">En ligne</div>
                  </div>
                  <div className="ai-robot-icon">🤖</div>
                </div>

                <div className="ai-response-box">
                  <div className="ai-message">
                    <div className="ai-msg-avatar">🤖</div>
                    <div className="ai-msg-bubble">
                      {aiResult ? (
                        <>
                          <p><strong>Analyse terminée.</strong> Voici les causes probables :</p>
                          {(aiResult.causesProbables || []).slice(0, 4).map((c, i) => (
                            <div key={i} className="ai-check-item">
                              <span className="ai-check-icon">✅</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <p>Bonjour {MOCK_USER.nom},<br />J'ai analysé votre problème. Voici les causes probables et les étapes recommandées.</p>
                          {MOCK_AI_CHECKS.map((c, i) => (
                            <div key={i} className="ai-check-item">
                              <span className="ai-check-icon">✅</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '14px 20px' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/incidents/new')}
                  >
                    Voir la solution complète →
                  </button>
                </div>
              </div>

              {/* Quick Access */}
              <div className="card">
                <div className="card-header">
                  <h3>Accès rapides</h3>
                </div>
                <div className="card-body">
                  <div className="quick-access-grid">
                    <div className="quick-access-btn" onClick={() => navigate('/search')}>
                      <div className="qa-icon blue">🔍</div>
                      <div className="qa-text">
                        <div className="qa-title">Recherche IA</div>
                        <div className="qa-sub">Rechercher un incident</div>
                      </div>
                    </div>
                    <div className="quick-access-btn" onClick={() => navigate('/incidents/new')}>
                      <div className="qa-icon green">➕</div>
                      <div className="qa-text">
                        <div className="qa-title">Nouvel incident</div>
                        <div className="qa-sub">Créer un incident</div>
                      </div>
                    </div>
                    <div className="quick-access-btn" onClick={() => navigate('/knowledge')}>
                      <div className="qa-icon purple">📚</div>
                      <div className="qa-text">
                        <div className="qa-title">Base de connaissances</div>
                        <div className="qa-sub">Consulter la KB</div>
                      </div>
                    </div>
                    <div className="quick-access-btn" onClick={() => navigate('/solutions')}>
                      <div className="qa-icon cyan">✅</div>
                      <div className="qa-text">
                        <div className="qa-title">Solutions validées</div>
                        <div className="qa-sub">Voir toutes les solutions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Validated Solutions */}
              <div className="card">
                <div className="card-header">
                  <h3>Dernières solutions validées</h3>
                  <span className="see-all-link" onClick={() => navigate('/solutions')}>Voir tout</span>
                </div>
                <div className="card-body" style={{ paddingTop: '10px' }}>
                  {MOCK_SOLUTIONS.map((sol, i) => (
                    <div key={i} className="solution-item">
                      <div className="solution-check">✓</div>
                      <div className="solution-info">
                        <div className="solution-title">{sol.titre}</div>
                        <div className="solution-date">{sol.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
