"use function" // Aviso: no Next.js usamos "use client" para telas interativas
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [modoLogin, setModoLogin] = useState(true) // Alterna entre Entrar e Cadastrar

  // Função que o botão vai chamar quando clicado
  async function acessarSistema(e: any) {
    e.preventDefault() // Evita que a página recarregue do zero
    setLoading(true)

    if (modoLogin) {
      // Tentar Entrar
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      })
      if (error) alert("Erro ao entrar: " + error.message)
      else alert("Bem-vindo de volta! Login feito com sucesso.")
    } else {
      // Tentar Cadastrar
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
      })
      if (error) alert("Erro ao cadastrar: " + error.message)
      else alert("Cadastro realizado! O cofre foi criado para este e-mail.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Cabeçalho da Tela */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {modoLogin ? "Acesse sua Conta" : "Crie sua Conta"}
          </h1>
          <p className="text-gray-500 text-sm">
            O sistema de emissão de notas mais seguro do mercado.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={acessarSistema} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha de Acesso</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Autenticando..." : (modoLogin ? "Entrar no Sistema" : "Finalizar Cadastro")}
          </button>
        </form>

        {/* Botão de alternar entre Login e Cadastro */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setModoLogin(!modoLogin)}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            {modoLogin ? "Ainda não tem conta? Cadastre-se." : "Já tem conta? Clique aqui para entrar."}
          </button>
        </div>

      </div>
    </div>
  )
}