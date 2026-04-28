"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [cliente, setCliente] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [valor, setValor] = useState("")
  const [mensagem, setMensagem] = useState("")

  // Verifica se existe alguém logado assim que o site abre
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    checkUser()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setMensagem("Verificando...")
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setMensagem("❌ Acesso negado: " + error.message)
    else window.location.reload()
  }

  async function handleEmitir(e: React.FormEvent) {
    e.preventDefault()
    if (!cliente || !cnpj || !valor) return setMensagem("⚠️ Preencha tudo!")
    
    setMensagem("Processando...")
    const { error } = await supabase.from("notas").insert([
      { cliente, cnpj, valor: Number(valor), user_id: user.id }
    ])

    if (error) setMensagem("❌ Erro no Banco: " + error.message)
    else {
      setMensagem("✅ Nota emitida com sucesso!")
      setCliente(""); setCnpj(""); setValor("");
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!user ? (
          // TELA DE LOGIN
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl w-full max-w-sm text-black shadow-2xl"
          >
            <h1 className="text-3xl font-black mb-2 tracking-tighter">PH TECH</h1>
            <p className="text-gray-500 mb-6 text-sm">Entre para gerenciar suas notas</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" placeholder="Seu e-mail" 
                className="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-black"
                onChange={e => setEmail(e.target.value)} 
              />
              <input 
                type="password" placeholder="Sua senha" 
                className="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-black"
                onChange={e => setSenha(e.target.value)} 
              />
              <button className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all">
                Acessar Sistema
              </button>
              {mensagem && <p className="text-center text-xs font-bold mt-2">{mensagem}</p>}
            </form>
          </motion.div>
        ) : (
          // TELA DO EMISSOR
          <motion.div 
            key="emissor"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl"
          >
            <div className="bg-white p-8 rounded-3xl text-black shadow-2xl mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter">EMITIR NOTA</h2>
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Painel do Consultor</p>
                </div>
                <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="text-xs font-bold text-red-500">Sair</button>
              </div>

              <form onSubmit={handleEmitir} className="space-y-4">
                <input 
                  placeholder="Nome do Cliente" value={cliente}
                  className="w-full p-4 bg-gray-100 rounded-2xl border-none"
                  onChange={e => setCliente(e.target.value)} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="CNPJ" value={cnpj}
                    className="w-full p-4 bg-gray-100 rounded-2xl border-none"
                    onChange={e => setCnpj(e.target.value)} 
                  />
                  <input 
                    placeholder="Valor R$" value={valor} type="number"
                    className="w-full p-4 bg-gray-100 rounded-2xl border-none"
                    onChange={e => setValor(e.target.value)} 
                  />
                </div>
                <button className="w-full bg-black text-white p-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform">
                  FINALIZAR EMISSÃO
                </button>
                {mensagem && <p className="text-center font-bold text-sm mt-2">{mensagem}</p>}
              </form>
            </div>
            
            <p className="text-center text-zinc-500 text-xs">PH Tech &copy; 2026 - Imperatriz, MA</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}