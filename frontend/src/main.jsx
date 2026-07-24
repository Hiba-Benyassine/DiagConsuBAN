import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, PlusCircle, List, Brain, BookOpen, ShieldCheck, BarChart3,
  Settings, Users, HelpCircle, Search, Bell, ChevronDown, Eye,
  ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';
import './style.css';

const A = '/assets/';

const items = [
  [Home, 'Tableau de bord', true],
  [PlusCircle, 'Nouveau incident'],
  [List, 'Mes incidents'],
  [Brain, 'Recherche IA'],
  [BookOpen, 'Base de connaissances'],
  [ShieldCheck, 'Solutions validées'],
  [BarChart3, 'Rapports & Statistiques'],
];

const incidents = [
  ['INC-2024-057', 'Erreur rapprochement facture AP', 'oracle', 'Accounts Payable', 'Résolu', '24/07/2025'],
  ['INC-2024-056', 'Problème création PO', 'oracle', 'Purchasing', 'En cours', '23/07/2025'],
  ['INC-2024-055', 'Facture non validée Odoo', 'odoo', 'Comptabilité', 'Ouvert', '22/07/2025'],
  ['INC-2024-054', 'Erreur calcul taxes Odoo', 'odoo', 'Ventes', 'Résolu', '21/07/2025'],
];

function Logo({ small = false }) {
  return <img className={small ? 'logo logo-small' : 'logo'} src={A + 'ban-logo.png'} alt="BAN" />;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <Logo />
        <button className="collapse">«</button>
      </div>
      <nav className="menu">
        {items.map(([Icon, label, active]) => (
          <button className={active ? 'menu-item active' : 'menu-item'} key={label}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="separator" />
      <nav className="menu bottom-menu">
        <button className="menu-item"><Settings size={22} /><span>Paramètres</span></button>
        <button className="menu-item"><Users size={22} /><span>Utilisateurs</span></button>
        <button className="menu-item"><HelpCircle size={22} /><span>Aide & Support</span></button>
      </nav>
      <div className="side-profile">
        <div className="initials">AA</div>
        <div>
          <b>Ahmed Ali</b>
          <span>Consultant</span>
          <em>● En ligne</em>
        </div>
        <ChevronDown size={19} />
      </div>
      <p className="copy">© BAN - DiagConsu IA 2024</p>
    </aside>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="welcome">
        <div className="user-dot">●</div>
        <div>
          <h1>Bienvenue, <strong>Ahmed Ali !</strong></h1>
          <p>Assistant intelligent pour le support ERP</p>
        </div>
      </div>
      <Logo small />
      <div className="actions">
        <label className="search-box">
          <Search size={20} />
          <input placeholder="Rechercher..." />
          <Search size={22} />
        </label>
        <button className="bell"><Bell size={24} /><span>3</span></button>
        <img className="avatar-img" src={A + 'profile-avatar.png'} alt="profil" />
        <ChevronDown size={22} />
      </div>
    </header>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <article className="stat-card">
      <img className="stat-img" src={A + icon} alt={label} />
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
        <b className={color}>{sub}</b>
      </div>
    </article>
  );
}

function IncidentForm() {
  return (
    <section className="card form-card">
      <div className="section-title">
        <Sparkles size={32} />
        <div>
          <h2>Créer un nouvel incident</h2>
          <p>Décrivez votre problème, l'IA analysera et proposera des solutions adaptées.</p>
        </div>
      </div>
      <div className="form-grid">
        <label>ERP concerné
          <select defaultValue="Oracle E-Business Suite">
            <option>Oracle E-Business Suite</option>
            <option>Odoo</option>
          </select>
          <img className="select-logo oracle-select" src={A + 'oracle-logo.png'} alt="Oracle" />
        </label>
        <label>Module
          <select defaultValue="Accounts Payable (AP)"><option>Accounts Payable (AP)</option></select>
        </label>
        <label>Niveau de criticité
          <select defaultValue="Moyen"><option>● Moyen</option><option>● Élevé</option></select>
        </label>
      </div>
      <label>Titre du problème
        <input defaultValue="Impossible d'annuler une facture Oracle AP" />
      </label>
      <label>Description / Message d'erreur
        <textarea defaultValue="Le système indique que la facture est rapprochée d'une commande définitivement fermée..." />
      </label>
      <button className="primary-btn"><Brain size={20} />Analyser avec l'IA</button>
      <img className="robot-main" src={A + 'robot-main.png'} alt="robot IA" />
    </section>
  );
}

function Assistant() {
  return (
    <section className="card assistant-card">
      <div className="assistant-head">
        <div><h2><span></span>Assistant IA</h2><p>En ligne</p></div>
        <img src={A + 'robot-small.png'} alt="assistant robot" />
      </div>
      <div className="chat-line">
        <img src={A + 'robot-small.png'} alt="assistant robot" />
        <p>Bonjour Ahmed,<br />J'ai analysé votre problème. Voici les causes probables et les étapes recommandées.</p>
      </div>
      <ul className="check-list">
        <li><CheckCircle2 />Vérifier le statut de la commande (PO)</li>
        <li><CheckCircle2 />Vérifier les lignes et expéditions</li>
        <li><CheckCircle2 />Vérifier les distributions rapprochées</li>
        <li><CheckCircle2 />Proposer la requête SQL adaptée</li>
      </ul>
      <button className="primary-btn full">Voir la solution complète <ArrowRight size={18} /></button>
    </section>
  );
}

function QuickAccess() {
  const q = [
    ['⌕', 'Recherche IA', 'Rechercher un incident', 'blue'],
    ['+', 'Nouvel incident', 'Créer un incident', 'green'],
    ['▯', 'Base de connaissances', 'Consulter la KB', 'purple'],
    ['✓', 'Solutions validées', 'Voir toutes les solutions', 'sky'],
  ];
  return (
    <section className="card quick-card">
      <h2>Accès rapides</h2>
      <div className="quick-grid">
        {q.map(([icon, title, text, color]) => (
          <button key={title}><span className={'quick-icon ' + color}>{icon}</span><p><b>{title}</b><em>{text}</em></p></button>
        ))}
      </div>
    </section>
  );
}

function Solutions() {
  const data = [
    ['Procédure annulation facture Oracle AP', '24/07/2025'],
    ['Correction erreur rapprochement PO', '23/07/2025'],
    ['Résolution problème création facture Odoo', '22/07/2025'],
  ];
  return (
    <section className="card solutions-card">
      <h2>Dernières solutions validées <a>Voir tout</a></h2>
      {data.map(([title, date]) => <p key={title}><CheckCircle2 size={18} /><span>{title}</span><time>{date}</time></p>)}
    </section>
  );
}

function ErpLogo({ type }) {
  if (type === 'oracle') return <img className="erp-logo oracle" src={A + 'oracle-logo.png'} alt="Oracle" />;
  return <img className="erp-logo odoo" src={A + 'odoo-logo.png'} alt="Odoo" />;
}

function IncidentsTable() {
  return (
    <section className="card table-card">
      <h2>Mes derniers incidents</h2>
      <table>
        <thead><tr><th>#</th><th>Titre</th><th>ERP</th><th>Module</th><th>Statut</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>
          {incidents.map(([id, title, erp, module, status, date]) => (
            <tr key={id}>
              <td>{id}</td><td>{title}</td><td><ErpLogo type={erp} /></td><td>{module}</td>
              <td><b className={'status ' + status.replace(' ', '-').toLowerCase()}>{status}</b></td><td>{date}</td><td><Eye className="eye" size={19} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <a className="more">Voir tous mes incidents <ArrowRight size={17} /></a>
    </section>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="stats-grid">
          <StatCard icon="icon-open.png" label="Incidents ouverts" value="24" sub="+12 ce mois" color="blue" />
          <StatCard icon="icon-resolved.png" label="Incidents résolus" value="56" sub="+18 ce mois" color="green" />
          <StatCard icon="icon-solutions.png" label="Solutions validées" value="128" sub="+22 ce mois" color="purple" />
          <StatCard icon="icon-pending.png" label="En attente" value="7" sub="+3 ce mois" color="orange" />
          <StatCard icon="icon-rate.png" label="Taux de résolution" value="92%" sub="Excellente" color="green" />
        </section>
        <section className="page-grid">
          <div className="left-col"><IncidentForm /><IncidentsTable /></div>
          <div className="right-col"><Assistant /><QuickAccess /><Solutions /></div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
