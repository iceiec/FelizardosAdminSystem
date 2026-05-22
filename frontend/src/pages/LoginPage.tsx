import { use, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

      try { 
      const response = await fetch ('/api/auth/login', {
        method : 'POST',
        headers :{ 'Content-Type' : 'application/json' },
        body: JSON.stringify ({email, password}),
      })

      const data = await response.json()

      if (!response.ok){
        throw new Error (data.message || 'Login failed ')
      }
      localStorage.setItem ('auth_token', data.token)
      localStorage.setItem ('user', JSON.stringify(data.user))

      toast.success('Login successful!')

      navigate('/')
    } catch (error) {
      toast.error('Login failed')
    } finally{ 
      setIsLoading(false)
    }   
  }
    

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ padding: '3rem 2.5rem' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>F</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.5rem', color: '#1f2937', margin: 0 }}>
              Felizardos
            </h1>
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
              Facility Management Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  width: '93%',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  color: '#1f2937',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#22c55e'
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  width: '93%',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  color: '#1f2937',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#22c55e'
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: isLoading ? '#a3e635' : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.8 : 1,
                transition: 'all 0.3s ease',
                marginTop: '0.5rem',
              }}
              
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 8px 16px rgba(34, 197, 94, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
              
            >
          
              {isLoading ?  'Signing in...' : 'Sign In'}

  
            </Button>
          </form>

          <div
            style={{
              marginTop: '2rem',
              padding: '1.25rem',
              background: '#f0fdf4',
              borderRadius: '10px',
              fontSize: '0.8125rem',
              color: '#4b5563',
              border: '1px solid #dcfce7',
            }}
          >
            <p style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#15803d', marginTop: 0 }}>Demo Credentials:</p>
            <p style={{ margin: 0, marginBottom: '0.25rem' }}>📧 demo@example.com</p>
            <p style={{ margin: 0 }}>🔐 any password</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
