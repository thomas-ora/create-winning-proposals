export interface APIKey {
  id: string
  name: string
  key_hash: string
  is_active: boolean
  created_at: string
  last_used?: string
}

export interface RateLimitState {
  requests: number
  windowStart: number
}

const rateLimitWindows = new Map<string, RateLimitState>()

export class AuthUtils {
  /**
   * Validate API key and return key data if valid
   */
  static async validateAPIKey(apiKey: string, supabaseClient: any): Promise<APIKey | null> {
    if (!apiKey) return null

    try {
      // Hash the provided API key
      const encoder = new TextEncoder()
      const keyData = encoder.encode(apiKey)
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Look up in database
      const { data, error } = await supabaseClient
        .from('api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return null
      }

      return data as APIKey
    } catch (error) {
      console.error('API key validation error:', error)
      return null
    }
  }

  /**
   * Check rate limit for API key (100 requests per minute)
   */
  static checkRateLimit(apiKeyId: string): { allowed: boolean; remainingRequests: number } {
    const now = Date.now()
    const windowDuration = 60 * 1000 // 1 minute in milliseconds
    const maxRequests = 100

    const existing = rateLimitWindows.get(apiKeyId)
    
    // If no existing window or window has expired, create new one
    if (!existing || (now - existing.windowStart) >= windowDuration) {
      rateLimitWindows.set(apiKeyId, {
        requests: 1,
        windowStart: now
      })
      return { allowed: true, remainingRequests: maxRequests - 1 }
    }

    // Check if within rate limit
    if (existing.requests >= maxRequests) {
      return { allowed: false, remainingRequests: 0 }
    }

    // Increment request count
    existing.requests += 1
    rateLimitWindows.set(apiKeyId, existing)

    return { 
      allowed: true, 
      remainingRequests: maxRequests - existing.requests 
    }
  }

  /**
   * Update the last_used timestamp for an API key
   */
  static async updateLastUsed(apiKeyId: string, supabaseClient: any): Promise<void> {
    try {
      await supabaseClient
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('id', apiKeyId)
    } catch (error) {
      console.error('Failed to update last_used:', error)
    }
  }

  /**
   * Extract API key from Authorization header
   */
  static extractAPIKey(authHeader: string | null): string | null {
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  /**
   * Log API key usage for monitoring
   */
  static logAPIKeyUsage(apiKey: APIKey, endpoint: string, success: boolean, metadata?: any): void {
    console.log('API Key Usage:', {
      keyId: apiKey.id,
      keyName: apiKey.name,
      endpoint,
      success,
      timestamp: new Date().toISOString(),
      metadata
    })
  }
}