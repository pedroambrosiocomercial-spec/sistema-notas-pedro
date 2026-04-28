"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { z } from "zod"

const notaSchema = z.object({
  cliente: z.string().min(3, "Nome muito curto"),
  cnpj: z.string().min(14, "CNPJ precisa de 14 dígitos"),
  valor: z.number().min(1, "Valor inválido")
})

export default function Home() {
  const [cliente, setCliente] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [valor, setValor] = useState("")
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [historico, setHistorico] = useState<any[]>([])

  const buscarNotas = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("notas").select("*").eq("user_id", user.id).order("id", { ascending: false })
    if (data) setHistorico(data)
  }, [])

  useEffect(() => { buscarNotas() }, [buscarNotas])

  async function emitir(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const dados = notaSchema.parse({ cliente, cnpj, valor: Number(valor) })
      const { error } = await supabase.from("notas").insert([{ ...dados, user_id: user?.id }])
      if (error) throw error
      setMensagem("✅ Sucesso!")
      setCliente(""); setCnpj(""); setValor("");
      buscarNotas()
    } catch (err: any) {
      setMensagem("❌ Erro nos dados")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl w-full max-w-2xl mb-8">
        <h1 className="text-2xl font-bold text-black mb-6">Emissão de Notas</h1>
        <form onSubmit={emitir} className="space-y-4">
          <input className="w-full p-3 border rounded-xl text-black" placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full p-3 border rounded-xl text-black" placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />
            <input className="w-full p-3 border rounded-xl text-black" placeholder="Valor" type="number" value={valor} onChange={e => setValor(e.target.value)} />
          </div>
          <button className="w-full py-4 bg-black text-white rounded-xl font-bold">{loading ? "Processando..." : "Emitir Nota"}</button>
          {mensagem && <p className="text-center text-black font-bold mt-2">{mensagem}</p>}
        </form>
      </motion.div>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Histórico</h2>
        <div className="space-y-3">
          {historico.map((n) => (
            <div key={n.id} className="bg-zinc-900 p-4 rounded-xl flex justify-between border border-zinc-800">
              <span className="text-white font-medium">{n.cliente}</span>
              <span className="text-green-400 font-bold text-lg">R$ {n.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}