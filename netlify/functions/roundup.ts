import type { Handler } from '@netlify/functions'
import { supabase } from '../supabase'

export const handler: Handler = async(event) => {
  const { action, key } = JSON.parse(event.body || '{}')

  if (action === 'create') {
    const { error, data } = await supabase.from('roundup').insert({ key })
    if (error?.code === '23505') return { statusCode: 200, body: 'key already exists' }
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) }
    return { statusCode: 200, body: JSON.stringify(data) }
  }

  if (action === 'roundup') {
    const { error: queryError, data } = await supabase.from('roundup').select('*').eq('key', key).limit(1)
    if (queryError) return { statusCode: 400, body: JSON.stringify({ queryError }) }
    if (!data) return { statusCode: 404, body: 'roundup not found' }
    const current = data[0]
    current.roundup = current.roundup + 1
    current.updated_at = new Date()
    const { error: updateError } = await supabase.from('roundup').update(current).match({ key })
    if (updateError) return { statusCode: 400, body: JSON.stringify({ updateError }) }
    return { statusCode: 200, body: JSON.stringify(data) }
  }

  if (action === 'query') {
    const { error, data } = await supabase.from('roundup').select('*').eq('key', key).limit(1)
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) }
    if (!data) return { statusCode: 404, body: 'roundup not found' }
    const current = data[0]
    return { statusCode: 200, body: JSON.stringify(current) }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'invalid action' }),
  }
}
