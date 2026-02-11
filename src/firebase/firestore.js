import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'

function subjectsCollection(uid) {
  return collection(db, 'users', uid, 'subjects')
}

function subjectDoc(uid, subjectId) {
  return doc(db, 'users', uid, 'subjects', subjectId)
}

export async function getSubjects(uid) {
  const snapshot = await getDocs(subjectsCollection(uid))
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateSubject(uid, subjectId, data) {
  await updateDoc(subjectDoc(uid, subjectId), data)
}

export async function importStudyPlan(uid, subjects) {
  const batch = writeBatch(db)
  for (const subject of subjects) {
    const ref = subjectDoc(uid, subject.id)
    const existing = await getDoc(ref)
    if (!existing.exists()) {
      batch.set(ref, {
        nombre: subject.nombre,
        anio: subject.anio,
        cuatrimestre: subject.cuatrimestre,
        horas: subject.horas || null,
        correlativas: subject.correlativas || [],
        estado: 'pendiente',
        nota: null,
        fechaAprobacion: null,
      })
    }
  }
  await batch.commit()
}

export async function hasSubjects(uid) {
  const snapshot = await getDocs(subjectsCollection(uid))
  return !snapshot.empty
}
