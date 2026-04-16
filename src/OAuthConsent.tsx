// React SPA example at path /oauth/consent

// src/pages/OAuthConsent.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from './supabaseClient.ts'

export default function OAuthConsent() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authorizationId = searchParams.get('authorization_id')

  const [authDetails, setAuthDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAuthDetails() {
      console.log("Loading authorization details for ID:", authorizationId);
      if (!authorizationId) {
        setError('Missing authorization_id')
        setLoading(false)
        return
      }

      // Check if user is authenticated
      console.log("Checking user authentication status...");
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("User authentication status:", user ? "Authenticated" : "Not authenticated");

      if (!user) {
        console.log("User not authenticated, redirecting to login with redirect back to consent");
        navigate(`/login?redirect=${encodeURIComponent(`/oauth/consent?authorization_id=${authorizationId}`)}`)
        return
      }

      // Get authorization details using the authorization_id
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)
      console.log("Authorization details fetched:", data);

      if (error) {
        console.log("Error fetching authorization details:", error);
        setError(error.message)
      } else {
        console.log("Authorization details set in state:", data);
        setAuthDetails(data)
      }

      setLoading(false)
    }

    loadAuthDetails()
  }, [authorizationId, navigate])

  async function handleApprove() {
    if (!authorizationId) return

    const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId)

    if (error) {
      console.log("Error approving authorization:", error);
      setError(error.message)
    } else {
      console.log("Authorization approved, redirecting to:", data.redirect_url);
      // Redirect to client app - approved
      window.location.href = data.redirect_url
    }
  }

  async function handleDeny() {
    if (!authorizationId) return

    const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId)

    if (error) {
      console.log("Error denying authorization:", error);
      setError(error.message)
    } else {
      console.log("Authorization denied, redirecting to:", data.redirect_url);
      // Redirect to client app - denied
      window.location.href = data.redirect_url
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!authDetails) return <div>No authorization request found</div>

  return (
    <div>
      <h1>Authorize {authDetails.client.name}</h1>
      <p>This application wants to access your account.</p>

      <div>
        <p>
          <strong>Client:</strong> {authDetails.client.name}
        </p>
        <p>
          <strong>Redirect URI:</strong> {authDetails.redirect_uri}
        </p>
        {authDetails.scope && authDetails.scope.trim() && (
          <div>
            <strong>Requested permissions:</strong>
            <ul>
              {authDetails.scope.split(' ').map((scopeItem: string) => (
                <li key={scopeItem}>{scopeItem}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleDeny}>Deny</button>
      </div>
    </div>
  )
}
