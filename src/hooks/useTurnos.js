import { useState, useCallback, useEffect } from 'react'
import { db } from '../db/database'
import { startOfDay, endOfDay } from 'date-fns'

export function useTurnos() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTurnos = useCallback(async (fecha = new Date()) => {
    try {
      setLoading(true)
      const start = startOfDay(fecha)
      const end = endOfDay(fecha)
      const data = await db.turnos
        .where('fecha')
        .between(start.toISOString(), end.toISOString(), true, true)
        .toArray()
      setTurnos(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTurno = useCallback(async (turnoData) => {
    try {
      setLoading(true)
      const precioServicio = parseFloat(turnoData.precio)
      const porcentajeProf = parseFloat(turnoData.porcentajeProf)
      const montoProf = (precioServicio * porcentajeProf) / 100
      const porcentajeCaja = 100 - porcentajeProf
      const montoCaja = (precioServicio * porcentajeCaja) / 100

      const nuevoTurno = {
        ...turnoData,
        precio: precioServicio,
        porcentajeProf,
        montoProf,
        porcentajeCaja,
        montoCaja,
        gastos: parseFloat(turnoData.gastos || 0),
        propina: parseFloat(turnoData.propina || 0),
        createdAt: new Date().toISOString()
      }

      const id = await db.turnos.add(nuevoTurno)
      setError(null)
      return { success: true, id }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTurno = useCallback(async (id, turnoData) => {
    try {
      setLoading(true)
      const precioServicio = parseFloat(turnoData.precio)
      const porcentajeProf = parseFloat(turnoData.porcentajeProf)
      const montoProf = (precioServicio * porcentajeProf) / 100
      const porcentajeCaja = 100 - porcentajeProf
      const montoCaja = (precioServicio * porcentajeCaja) / 100

      const actualizado = {
        ...turnoData,
        precio: precioServicio,
        porcentajeProf,
        montoProf,
        porcentajeCaja,
        montoCaja,
        gastos: parseFloat(turnoData.gastos || 0),
        propina: parseFloat(turnoData.propina || 0)
      }

      await db.turnos.update(id, actualizado)
      setError(null)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTurno = useCallback(async (id) => {
    try {
      setLoading(true)
      await db.turnos.delete(id)
      setError(null)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTurnos()
  }, [fetchTurnos])

  return {
    turnos,
    loading,
    error,
    fetchTurnos,
    createTurno,
    updateTurno,
    deleteTurno
  }
}
