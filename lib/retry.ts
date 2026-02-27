export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 4, backoff = 2000): Promise<Response> {
  try {
    const response = await fetch(url, options)


    if (!response.ok) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff))
        return fetchWithRetry(url, options, retries - 1, backoff * 2)
      } else {
        throw new Error(`Request failed`)
      }
    }

    return response
  } catch (error) {

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff))
      return fetchWithRetry(url, options, retries - 1, backoff * 2)
    } else {
      throw error
    }
  }
}