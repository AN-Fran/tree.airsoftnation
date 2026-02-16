export async function createEspoEntity(
  entity: string,
  payload: Record<string, any>
) {
  const response = await fetch(
    `${process.env.ESPO_URL}/api/v1/${entity}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.ESPO_API_KEY as string
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
