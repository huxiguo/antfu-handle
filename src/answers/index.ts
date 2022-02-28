import seedrandom from 'seedrandom'
import DATA from '../data/idioms.json'
import SIMPLE_DATA from '../data/smiple_dict.json'
import type { Roundup } from '../logic'
import { getHint } from '../logic'
import { answers } from './list'
import { RANDOM_SEED } from '~/logic'

const DATA_SET = DATA.length
const SIMPLE_DATA_SET = SIMPLE_DATA.length

export function getAnswerOfDay(day: number) {
  let [word = '', hint = ''] = answers[day] || []
  if (!word) {
    const rng = seedrandom(RANDOM_SEED)
    for (let i = 0; i <= day; i++)
      rng()
    word = DATA[Math.floor(rng() * DATA_SET - 1)][0]
  }
  if (!hint)
    hint = getHint(word)
  return {
    word,
    hint,
  }
}

export function getAnswerOfRoundup(roundupData: Roundup) {
  const k = parseInt(`${roundupData.id}${roundupData.roundup}`, 10) * 100
  const word = SIMPLE_DATA[k % SIMPLE_DATA_SET][0]
  const hint = getHint(word)
  return { word, hint }
}
