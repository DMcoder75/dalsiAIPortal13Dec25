// This is the handleGoogleProfileSubmit function to add to AuthModal.jsx
const handleGoogleProfileSubmit = async (profileData) => {
  console.log('📝 [AUTH_MODAL] Submitting Google profile setup...')
  setIsProcessingGoogle(true)
  try {
    const response = await fetch('https://api.neodalsi.com/api/auth/register-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profileData.email,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        company_name: profileData.companyName || null,
        google_id: googleData.sub,
        profile_picture: googleData.picture,
        email_verified: true // IMPORTANT: Mark as verified since Google verified it
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    if (!data.success || !data.token || !data.user) {
      throw new Error('Invalid response from server')
    }

    console.log('✅ [AUTH_MODAL] Google registration successful')

    // Store JWT token and user info
    localStorage.setItem('jwt_token', data.token)
    localStorage.setItem('user_info', JSON.stringify(data.user))
    localStorage.setItem('user_type', 'registered')

    // Migrate guest conversations
    console.log('🔄 [AUTH_MODAL] Starting guest conversation migration...')
    try {
      const migrationResult = await migrateGuestConversations(data.user.id, data.token)
      if (migrationResult.success && migrationResult.migratedCount > 0) {
        console.log('✅ [AUTH_MODAL] Migrated conversations:', migrationResult.migratedCount)
      }
    } catch (migrationError) {
      console.error('⚠️ [AUTH_MODAL] Error migrating guest conversations:', migrationError)
    }

    // Create initial free tier subscription
    try {
      await subscriptionManager.createInitialSubscription(data.user.id)
      console.log('✅ [AUTH_MODAL] Initial subscription created')
    } catch (subError) {
      console.error('⚠️ [AUTH_MODAL] Error creating subscription:', subError)
    }

    // Initialize rate limit tracker
    try {
      updateTrackerTier(data.user.subscription_tier || 'free')
      console.log('✅ [AUTH_MODAL] Rate limit tracker initialized')
    } catch (rateLimitError) {
      console.error('⚠️ [AUTH_MODAL] Error initializing rate limits:', rateLimitError)
    }

    setSuccessMessage('Account created successfully! Redirecting...')
    if (onSuccess) onSuccess()
    onClose()

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error('❌ [AUTH_MODAL] GOOGLE PROFILE ERROR:', error)
    setError(error.message || 'Registration failed. Please try again.')
    setIsProcessingGoogle(false)
  }
}
