import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Context'
function Signup() {
  const {username,setUsername}=useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('register')
  const [error, setError] = useState('')
  const [captchaSvg, setCaptchaSvg] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:3000/captcha', {
        credentials: 'include',
      })
      const data = await res.text()
      setCaptchaSvg(data)
      setCaptchaInput('')
      setCaptchaVerified(false)
    } catch (err) {
      console.error('Failed to fetch captcha', err)
    }
  }

  const handleVerifyCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:3000/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userCaptcha: captchaInput }),
      })

      const result = await res.json()
      if (result.success) {
        alert('entered captcha matched')
        setCaptchaVerified(true)
        setError('')
      } else {
        setError('CAPTCHA does not match')
        setCaptchaVerified(false)
        fetchCaptcha()
      }
    } catch (err) {
      console.error('Error verifying captcha', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
  
    if (!username || !email || !password || !confirmPassword || !role) {
      setError('All fields are required')
      return
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
  
    if (!captchaVerified) {
      setError('Please complete CAPTCHA verification')
      return
    }
  
    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      })
  
      const result = await res.json()
  
      if (res.ok) {
        alert(`Account created as ${role} successfully!`)
        navigate('/login')
      } else {
        setError(result.error || 'Signup failed')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please try again.')
    }
  }
  

  return (
    <div className="w-[400px] mx-auto bg-gray-500 border rounded-lg shadow-md p-8">
      <h2 className="text-2xl text-white font-bold text-center mb-6">Create an Account</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-2 rounded border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-4 py-2 rounded border"
          />
        </div>

        {/* Role selection */}
        <div>
          <label className="text-sm font-medium text-white">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          >
            <option value="register">Register</option>
            <option value="handler">Handler</option>
          </select>
        </div>

        {/* SVG CAPTCHA */}
        <div className="text-center mt-4">
          <div
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
            className="mb-2 inline-block bg-white p-2 rounded"
          />
          <button type="button" onClick={fetchCaptcha} className="text-blue-400 text-sm underline">
            Refresh CAPTCHA
          </button>
          <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full mt-2 px-4 py-2 rounded border"
          />
          <button
            type="button"
            onClick={handleVerifyCaptcha}
            className="w-full mt-2 bg-green-500 text-white rounded py-1"
          >
            Verify CAPTCHA
          </button>
        </div>

        <button
          type="submit"
          disabled={!captchaVerified}
          className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-white">
        Already have an account?{' '}
        <a href="/login" className="text-blue-400 hover:underline">
          Login
        </a>
      </p>
    </div>
  )
}

export default Signup
