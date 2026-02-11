import { useState } from 'react'
import { updateSubject } from '../../firebase/firestore'
import './SubjectModal.css'

export default function SubjectModal({ subject, uid, onClose, onSaved }) {
  const [estado, setEstado] = useState(subject.estado)
  const [nota, setNota] = useState(subject.nota ?? '')
  const [fechaAprobacion, setFechaAprobacion] = useState(subject.fechaAprobacion ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = {
        estado,
        nota: nota === '' ? null : Number(nota),
        fechaAprobacion: fechaAprobacion || null,
      }
      await updateSubject(uid, subject.id, data)
      onSaved()
    } catch {
      setError('Error al guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{subject.nombre}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-info">
          <span>{subject.anio}° Año</span>
          <span>
            {subject.cuatrimestre === 'Anual'
              ? 'Anual'
              : subject.cuatrimestre === 'Variable'
                ? 'Variable'
                : `${subject.cuatrimestre} Cuatrimestre`}
          </span>
          {subject.horas && <span>{subject.horas} horas</span>}
        </div>

        {subject.correlativas && subject.correlativas.length > 0 && (
          <div className="modal-correlativas">
            <strong>Correlativas:</strong>
            <ul>
              {subject.correlativas.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label>Estado</label>
            <div className="estado-options">
              {[
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'en_curso', label: 'En curso' },
                { value: 'aprobada', label: 'Aprobada' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`estado-btn estado-${opt.value} ${
                    estado === opt.value ? 'estado-selected' : ''
                  }`}
                  onClick={() => setEstado(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nota">Nota (opcional)</label>
              <input
                id="nota"
                type="number"
                min="1"
                max="10"
                step="1"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="1-10"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fecha">Fecha aprobación (opcional)</label>
              <input
                id="fecha"
                type="date"
                value={fechaAprobacion}
                onChange={(e) => setFechaAprobacion(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
