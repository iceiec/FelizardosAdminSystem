import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

    if (!fullName.trim()) {
      toast.error('Full name is required')
      return
    }

    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address')
      return
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters and include letters and numbers')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, fullName)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eefdf3 100%)',
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
          border: '1px solid #dbe7dd',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -18px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div style={{ padding: '3rem 2.5rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem', textAlign: 'center', color: '#1f2937' }}>
            Create Account
          </h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '0' }}>
            Create a system account for facility management
          </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
              style={{ width: '93%', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#1f2937', fontSize: '0.875rem' }}
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              style={{ width: '93%', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#1f2937', fontSize: '0.875rem' }}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{ width: '93%', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#1f2937', fontSize: '0.875rem' }}
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{ width: '93%', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#1f2937', fontSize: '0.875rem' }}
            />

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
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </Card>
    </div>
  )
}