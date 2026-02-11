import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSubjects, importStudyPlan, hasSubjects } from '../../firebase/firestore'
import studyPlan from '../../data/studyPlan'
import SubjectList from '../SubjectList/SubjectList'
import SubjectModal from '../SubjectModal/SubjectModal'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)

  const loadSubjects = useCallback(async () => {
    try {
      const data = await getSubjects(user.uid)
      data.sort((a, b) => {
        if (a.anio !== b.anio) return a.anio - b.anio
        const order = { '1°': 1, Anual: 2, '2°': 3, Variable: 4 }
        return (order[a.cuatrimestre] || 5) - (order[b.cuatrimestre] || 5)
      })
      setSubjects(data)
    } catch {
      setError('Error al cargar las materias.')
    } finally {
      setLoading(false)
    }
  }, [user.uid])

  useEffect(() => {
    async function init() {
      const has = await hasSubjects(user.uid)
      if (!has) {
        setImporting(true)
        try {
          await importStudyPlan(user.uid, studyPlan)
        } catch {
          setError('Error al importar el plan de estudio.')
        } finally {
          setImporting(false)
        }
      }
      await loadSubjects()
    }
    init()
  }, [user.uid, loadSubjects])

  async function handleImport() {
    setImporting(true)
    setError('')
    try {
      await importStudyPlan(user.uid, studyPlan)
      await loadSubjects()
    } catch {
      setError('Error al importar el plan.')
    } finally {
      setImporting(false)
    }
  }

  function handleSubjectUpdated() {
    setSelectedSubject(null)
    loadSubjects()
  }

  if (loading || importing) {
    return (
      <div className="dashboard-loading">
        {importing ? 'Importando plan de estudio...' : 'Cargando materias...'}
      </div>
    )
  }

  const aprobadas = subjects.filter((s) => s.estado === 'aprobada')
  const enCurso = subjects.filter((s) => s.estado === 'en_curso')
  const pendientes = subjects.filter((s) => s.estado === 'pendiente')
  const total = subjects.length
  const porcentaje = total > 0 ? Math.round((aprobadas.length / total) * 100) : 0

  const notasValidas = aprobadas.filter((s) => s.nota != null && s.nota > 0)
  const promedio =
    notasValidas.length > 0
      ? (notasValidas.reduce((sum, s) => sum + s.nota, 0) / notasValidas.length).toFixed(2)
      : null

  const horasAprobadas = aprobadas.reduce((sum, s) => sum + (s.horas || 0), 0)
  const horasTotal = subjects.reduce((sum, s) => sum + (s.horas || 0), 0)

  return (
    <div className="dashboard">
      {error && <p className="dashboard-error">{error}</p>}

      <div className="summary-section">
        <h2 className="section-title">Resumen de Progreso</h2>
        <div className="stats-grid">
          <div className="stat-card stat-progress">
            <span className="stat-number">{porcentaje}%</span>
            <span className="stat-label">Completado</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
            </div>
          </div>
          <div className="stat-card stat-aprobadas">
            <span className="stat-number">{aprobadas.length}</span>
            <span className="stat-label">Aprobadas</span>
          </div>
          <div className="stat-card stat-encurso">
            <span className="stat-number">{enCurso.length}</span>
            <span className="stat-label">En curso</span>
          </div>
          <div className="stat-card stat-pendientes">
            <span className="stat-number">{pendientes.length}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          {promedio && (
            <div className="stat-card stat-promedio">
              <span className="stat-number">{promedio}</span>
              <span className="stat-label">Promedio</span>
            </div>
          )}
          <div className="stat-card stat-horas">
            <span className="stat-number">
              {horasAprobadas}/{horasTotal}
            </span>
            <span className="stat-label">Horas</span>
          </div>
        </div>
      </div>

      <div className="actions-bar">
        <button onClick={handleImport} className="btn-import" disabled={importing}>
          {importing ? 'Importando...' : 'Re-importar plan'}
        </button>
      </div>

      <SubjectList subjects={subjects} onSelect={setSelectedSubject} />

      {selectedSubject && (
        <SubjectModal
          subject={selectedSubject}
          uid={user.uid}
          onClose={() => setSelectedSubject(null)}
          onSaved={handleSubjectUpdated}
        />
      )}
    </div>
  )
}
