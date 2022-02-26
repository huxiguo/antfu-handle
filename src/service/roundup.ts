import axios from 'axios'
import { NETLIFY_FUNCTION_HOST } from '.'

export async function createRoundup({ key }: { key: string }) {
  return await axios.post(
    `${NETLIFY_FUNCTION_HOST}/roundup`,
    {
      action: 'create',
      key,
    })
}

export async function getRoundup({ key }: { key: string }) {
  return await axios.post(
    `${NETLIFY_FUNCTION_HOST}/roundup`,
    {
      action: 'query',
      key,
    })
}

export async function updateRoundup({ key }: { key: string }) {
  return await axios.post(
    `${NETLIFY_FUNCTION_HOST}/roundup`,
    {
      action: 'roundup',
      key,
    })
}
