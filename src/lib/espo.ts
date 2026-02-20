export async function createEspoEntity(
  entity: string,
  payload: Record<string, any>
) {
  const baseUrl = process.env.ESPO_URL
  const apiKey = process.env.ESPO_API_KEY_TICKETS

  if (!baseUrl) {
    throw new Error("Missing ESPO_URL")
  }

  if (!apiKey) {
    throw new Error("Missing ESPO_API_KEY_TICKETS")
  }

  const response = await fetch(
    `${baseUrl}/api/v1/${entity}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey
      },
      body: JSON.stringify(payload)
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Espo error: ${text}`)
  }

  return response.json()
}

