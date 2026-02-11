import { useState } from 'react'
import './SubjectList.css'

const ESTADOS = [
  { value: 'todos', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'aprobada', label: 'Aprobadas' },
]

const ANIOS = [
  { value: 0, label: 'Todos los años' },
  { value: 1, label: '1° Año' },
  { value: 2, label: '2° Año' },
  { value: 3, label: '3° Año' },
  { value: 4, label: '4° Año' },
  { value: 5, label: '5° Año' },
]

const estadoLabels = {
  pendiente: 'Pendiente',
  en_curso: 'En curso',
  aprobada: 'Aprobada',
}

const estadoClasses = {
  pendiente: 'badge-pendiente',
  en_curso: 'badge-encurso',
  aprobada: 'badge-aprobada',
}

export default function SubjectList({ subjects, onSelect }) {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroAnio, setFiltroAnio] = useState(0)
  const [busqueda, setBusqueda] = useState('')

  const filtered = subjects.filter((s) => {
    if (filtroEstado !== 'todos' && s.estado !== filtroEstado) return false
    if (filtroAnio !== 0 && s.anio !== filtroAnio) return false
    if (busqueda && !s.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const grouped = {}
  for (const s of filtered) {
    const key = `${s.anio}° Año`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(s)
  }

  return (
    <div className="subject-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar materia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <div className="filter-row">
          <div className="filter-pills">
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                className={`pill ${filtroEstado === e.value ? 'pill-active' : ''}`}
                onClick={() => setFiltroEstado(e.value)}
              >
                {e.label}
              </button>
            ))}
          </div>
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(Number(e.target.value))}
            className="year-select"
          >
            {ANIOS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="no-results">No se encontraron materias.</p>
      ) : (
        Object.entries(grouped).map(([year, subs]) => (
          <div key={year} className="year-group">
            <h3 className="year-title">{year}</h3>
            <div className="subjects-cards">
              {subs.map((s) => (
                <button
                  key={s.id}
                  className="subject-card"
                  onClick={() => onSelect(s)}
                >
                  <div className="subject-top">
                    <span className="subject-name">{s.nombre}</span>
                    <span className={`badge ${estadoClasses[s.estado]}`}>
                      {estadoLabels[s.estado]}
                    </span>
                  </div>
                  <div className="subject-bottom">
                    <span className="subject-cuatri">
                      {s.cuatrimestre === 'Anual'
                        ? 'Anual'
                        : s.cuatrimestre === 'Variable'
                          ? 'Variable'
                          : `${s.cuatrimestre} Cuatrimestre`}
                    </span>
                    {s.nota != null && s.nota > 0 && (
                      <span className="subject-nota">Nota: {s.nota}</span>
                    )}
                    {s.horas && <span className="subject-horas">{s.horas}h</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
