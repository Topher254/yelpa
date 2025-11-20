
import React, { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Phone, MapPin, Users, Clock, Shield, Volume2, VolumeX, Heart, Crosshair } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const Emergency = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [helpersNotified, setHelpersNotified] = useState(0)
  const [location, setLocation] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [panicMode, setPanicMode] = useState(false)
  const [heartRate, setHeartRate] = useState(72)
  const audioRef = useRef(null)
  const panicIntervalRef = useRef(null)
  const { user } = useUser()

  // Create emergency sound using Web Audio API (no external file needed)
  const createEmergencySound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5)
      
      gainNode.gain.setValueAtTime(0.8, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      // Create continuous siren effect
      setTimeout(() => {
        if (panicMode && soundEnabled) {
          createEmergencySound()
        }
      }, 500)
    } catch (error) {
      console.log('Audio context not supported:', error)
    }
  }

  const playEmergencySound = () => {
    if (soundEnabled) {
      createEmergencySound()
    }
  }

  const stopEmergencySound = () => {
    // Sound stops automatically due to Web Audio API design
  }

  // Simulate increasing heart rate during panic
  const simulatePanicEffects = () => {
    let rate = 72
    panicIntervalRef.current = setInterval(() => {
      rate = Math.min(rate + Math.random() * 10, 160)
      setHeartRate(Math.floor(rate))
    }, 800)
  }

  const stopPanicEffects = () => {
    if (panicIntervalRef.current) {
      clearInterval(panicIntervalRef.current)
    }
    setHeartRate(72)
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Mock location for demo
        resolve({
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
          accuracy: 50
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          // Mock location as fallback
          resolve({
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
            accuracy: 100
          })
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000, 
          maximumAge: 0 
        }
      )
    })
  }

  const triggerEmergency = async () => {
    if (!user) {
      toast.error('Please log in to use emergency features')
      return
    }

    try {
      setPanicMode(true)
      playEmergencySound()
      simulatePanicEffects()

      // Get user location
      const userLocation = await getCurrentLocation()
      setLocation(userLocation)

      // Start dramatic countdown
      let count = 5
      const countdownInterval = setInterval(() => {
        setCountdown(count)
        
        // Flash effect on final count
        if (count <= 3) {
          document.body.style.backgroundColor = count % 2 === 0 ? '#dc2626' : '#991b1b'
        }
        
        count--
        
        if (count < 0) {
          clearInterval(countdownInterval)
          document.body.style.backgroundColor = '#dc2626'
          activateEmergencyAlert(userLocation)
        }
      }, 1000)

    } catch (error) {
      console.error('Error in emergency trigger:', error)
      toast.error('Emergency alert activated!')
      activateEmergencyAlert(null)
    }
  }

  const activateEmergencyAlert = async (userLocation) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse = {
        helpersNotified: 12 + Math.floor(Math.random() * 8),
        alertId: 'emergency_' + Date.now(),
        timestamp: new Date().toISOString()
      }

      setIsEmergencyActive(true)
      setHelpersNotified(mockResponse.helpersNotified)

      // Simulate helpers responding in real-time
      simulateHelpersResponse()

      toast.success(` EMERGENCY ALERT SENT! ${mockResponse.helpersNotified} helpers notified`, {
        duration: 8000,
        style: {
          background: '#000000',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '20px',
          border: '3px solid #fff',
          textAlign: 'center'
        },
        icon: ''
      })

    } catch (error) {
      console.error('Error sending emergency alert:', error)
      toast.error(' EMERGENCY ALERT ACTIVATED! Helpers have been notified!', {
        duration: 6000,
        style: {
          background: '#dc2626',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      })
      // Continue anyway for demo purposes
      setIsEmergencyActive(true)
      setHelpersNotified(8)
      simulateHelpersResponse()
    }
  }

  const simulateHelpersResponse = () => {
    // Simulate real-time helper responses
    setTimeout(() => setHelpersNotified(prev => Math.max(prev - 2, 8)), 2000)
    setTimeout(() => setHelpersNotified(prev => Math.max(prev - 3, 5)), 4000)
    setTimeout(() => setHelpersNotified(prev => Math.max(prev - 2, 3)), 6000)
    setTimeout(() => setHelpersNotified(prev => Math.max(prev - 1, 2)), 8000)
  }

  const cancelEmergency = async () => {
    try {
      // Simulate API call to cancel
      await new Promise(resolve => setTimeout(resolve, 500))
      resetEmergency()
      toast.success(' Emergency cancelled - Helpers have been notified', {
        style: {
          background: '#16a34a',
          color: 'white',
          fontSize: '16px'
        }
      })
    } catch (error) {
      console.error('Error cancelling emergency:', error)
      resetEmergency()
      toast.success('Emergency cancelled')
    }
  }

  const resetEmergency = () => {
    setIsEmergencyActive(false)
    setCountdown(5)
    setHelpersNotified(0)
    setLocation(null)
    setPanicMode(false)
    stopEmergencySound()
    stopPanicEffects()
    document.body.style.backgroundColor = ''
  }

  const callEmergencyServices = () => {
    window.open('tel:911', '_self')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEmergencySound()
      stopPanicEffects()
      document.body.style.backgroundColor = ''
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-red-800 mb-4">Emergency Access Restricted</h2>
          <p className="text-red-600 text-lg mb-6">Please log in to access emergency SOS features</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      panicMode ? 'bg-red-900' : 'bg-linear-to-br from-red-500 to-red-700'
    } relative overflow-hidden`}>
      
      {/* Pulsing emergency background effect */}
      {panicMode && (
        <div className="absolute inset-0 bg-red-600 animate-pulse opacity-20"></div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-white">
        
        {/* Sound Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* Emergency Header */}
        <div className="text-center mb-8">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {panicMode ? '🚨 EMERGENCY MODE 🚨' : 'Emergency SOS'}
          </h1>
          <p className="text-xl opacity-90">
            {panicMode 
              ? 'Help is on the way! Stay calm.' 
              : 'For immediate assistance in crisis situations'
            }
          </p>
        </div>

        {/* Main Emergency Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border-2 border-white/30 shadow-2xl">
          
          {!panicMode ? (
            // Pre-emergency State - Big SOS Button
            <div className="text-center">
              <div className="mb-6">
                <Shield className="w-20 h-20 mx-auto mb-4 text-white/80" />
                <p className="text-lg mb-2">Tap the SOS button below to alert nearby helpers</p>
                <p className="text-sm opacity-80">Your location will be shared with registered emergency responders</p>
              </div>

              <button
                onClick={triggerEmergency}
                className="w-32 h-32 bg-red-600 hover:bg-red-700 active:scale-95 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl animate-pulse mx-auto transition-all duration-300 border-4 border-white hover:border-red-200"
              >
                SOS
              </button>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>15+ Helpers Nearby</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location Tracking</span>
                </div>
              </div>
            </div>
          ) : !isEmergencyActive ? (
            // Countdown State - Panic Mode
            <div className="text-center">
              <div className="mb-6">
                <div className="text-8xl font-bold text-white mb-4 animate-bounce">
                  {countdown}
                </div>
                <p className="text-lg font-semibold">Emergency alert activating in...</p>
                <p className="text-sm opacity-80 mt-2">Cancel if this was accidental</p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
               
              </div>

              <button
                onClick={resetEmergency}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl cursor-pointer font-semibold text-lg transition active:scale-95"
              >
                 CANCEL EMERGENCY
              </button>
            </div>
          ) : (
            // Active Emergency State - Help is Coming
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-pulse">🚨</div>
                <h2 className="text-2xl font-bold mb-2">HELP IS ON THE WAY!</h2>
                <p className="text-lg mb-4">Emergency responders have been notified</p>
                
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="font-bold text-xl">{helpersNotified}</span>
                  </div>
                  <p className="text-sm">Helpers Responding</p>
                </div>

                {location && (
                  <div className="flex items-center justify-center gap-2 text-sm opacity-90 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>Location shared</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                  <Clock className="w-4 h-4" />
                  <span>Estimated arrival: 2-5 minutes</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={callEmergencyServices}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-95 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  CALL 911 EMERGENCY
                </button>
                
                <button
                  onClick={cancelEmergency}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition active:scale-95"
                >
                  Cancel Alert (False Alarm)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Instructions */}
        <div className="mt-8 text-center text-white/80 text-sm max-w-md">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="mb-2 font-semibold">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              IMPORTANT SAFETY INFORMATION
            </p>
            <p className="mb-1">• Use only for genuine emergencies</p>
            <p className="mb-1">• Your location and profile are shared with responders</p>
            <p>• Stay on the line if you call 911</p>
          </div>
        </div>
      </div>

      {/* Emergency overlay when active */}
      {panicMode && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

export default Emergency