import { useState, useCallback, useEffect } from 'react'
import { db } from '../db/database'

export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchServicios = useCallback(async (categoria = null) => {
    try {
      setLoading(true)
      let data = await db.servicios.where('activo').equals(true).toArray()
      if (categoria) {
        data = data.filter(s => s.categoria === categoria)
      }
      setServicios(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllServicios = useCallback(async () => {
    try {
      setLoading(true)
      const data = await db.servicios.toArray()
      setServicios(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createServicio = useCallback(async (data) => {
    try {
      setLoading(true)
      await db.servicios.add(data)
      setError(null)
      await fetchAllServicios()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllServicios])

  const updateServicio = useCallback(async (id, data) => {
    try {
      setLoading(true)
      await db.servicios.update(id, data)
      setError(null)
      await fetchAllServicios()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllServicios])

  const deleteServicio = useCallback(async (id) => {
    try {
      setLoading(true)
      await db.servicios.update(id, { activo: false })
      setError(null)
      await fetchAllServicios()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAllServicios])

  useEffect(() => {
    fetchServicios()
  }, [fetchServicios])

  return {
    servicios,
    loading,
    error,
    fetchServicios,
    fetchAllServicios,
    createServicio,
    updateServicio,
    deleteServicio
  }
}
