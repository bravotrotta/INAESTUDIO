import { useState, useCallback, useEffect } from 'react'
import { db } from '../db/database'

export function useProfesionales() {
  const [profesionales, setProfesionales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProfesionales = useCallback(async () => {
    try {
      setLoading(true)
      const data = await db.profesionales.where('activo').equals(true).toArray()
      setProfesionales(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllProfesionales = useCallback(async () => {
    try {
      setLoading(true)
      const data = await db.profesionales.toArray()
      setProfesionales(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfesional = useCallback(async (data) => {
    try {
      setLoading(true)
      await db.profesionales.add(data)
      setError(null)
      await fetchAllProfesionales()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllProfesionales])

  const updateProfesional = useCallback(async (id, data) => {
    try {
      setLoading(true)
      await db.profesionales.update(id, data)
      setError(null)
      await fetchAllProfesionales()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllProfesionales])

  const deleteProfesional = useCallback(async (id) => {
    try {
      setLoading(true)
      await db.profesionales.update(id, { activo: false })
      setError(null)
      await fetchAllProfesionales()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllProfesionales])

  useEffect(() => {
    fetchProfesionales()
  }, [fetchProfesionales])

  return {
    profesionales,
    loading,
    error,
    fetchProfesionales,
    fetchAllProfesionales,
    createProfesional,
    updateProfesional,
    deleteProfesional
  }
}
