#!/usr/bin/env node
// Simple smoke test for Pavilion endpoints
// Usage:
//   API_URL=http://localhost:5000/api node tests/smoke_pavilion.js
// To run protected tests, set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars.

const API_BASE = process.env.API_URL || 'http://localhost:5000/api'

const log = (...args) => console.log('[smoke]', ...args)

async function jsonOrText(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

(async function run() {
  try {
    log('API base:', API_BASE)

    // 1) Public GET /pavilion
    log('GET /pavilion')
    let res = await fetch(`${API_BASE}/pavilion`)
    let body = await jsonOrText(res)
    log('GET status', res.status)
    console.log(body)

    // If credentials provided, run protected sequence
    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD
    let token = null
    if (email && password) {
      log('Logging in with TEST_USER_EMAIL')
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      body = await jsonOrText(res)
      if (!res.ok) throw new Error('Login failed: ' + JSON.stringify(body))
      token = body.token || body.accessToken || body.data?.token
      if (!token) throw new Error('No token in login response: ' + JSON.stringify(body))
      log('Obtained token (trimmed):', token.slice(0, 20) + '...')

      // Create pavilion
      log('POST /pavilion (protected)')
      const payload = { name: `Smoke Pavilion ${Date.now()}`, capacity: 10, location: 'Smoke Test', hourlyRate: 100 }
      res = await fetch(`${API_BASE}/pavilion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      body = await jsonOrText(res)
      log('CREATE status', res.status)
      console.log(body)
      if (!res.ok) throw new Error('Create failed')
      const createdId = body.id || body.data?.id || body[0]?.id

      // Update pavilion
      if (createdId) {
        log('PUT /pavilion/:id (protected)')
        res = await fetch(`${API_BASE}/pavilion/${createdId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: `Updated Pavilion ${Date.now()}` }),
        })
        body = await jsonOrText(res)
        log('UPDATE status', res.status)
        console.log(body)

        // Delete
        log('DELETE /pavilion/:id (protected)')
        res = await fetch(`${API_BASE}/pavilion/${createdId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        body = await jsonOrText(res)
        log('DELETE status', res.status)
        console.log(body)
      }
    } else {
      log('Skipping protected tests — set TEST_USER_EMAIL and TEST_USER_PASSWORD to run them')
    }

    log('Smoke test completed')
    process.exit(0)
  } catch (err) {
    console.error('[smoke] ERROR', err)
    process.exit(2)
  }
})()
