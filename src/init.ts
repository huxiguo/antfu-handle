import { accpetCollecting, markEnd, markStart, meta, pauseTimer, roundupData } from './storage'
import { answer, dayNo, daySince, isFinished, isPassed, key, showHelp } from './state'
import { t } from './i18n'
import { sendAnalytics } from './service/analytics'
import { getRoundup } from './service/roundup'

useTitle(computed(() => `${t('name')} - ${t('description')}`))

// show answer in console
watchEffect(() => {
  // eslint-disable-next-line no-console
  console.log(`D${dayNo.value}`, { are: { you: { sure: { to: { cheat: { '?': answer.value.word } } } } } })
}, { flush: 'post' })

watchEffect(() => {
  if (isPassed.value)
    meta.value.passed = true
})

watch(daySince, (n, o) => {
  // on day changed
  if (o === dayNo.value && isFinished.value)
    dayNo.value = n
})

watchEffect(() => {
  if (!key) {
    showHelp.value = true
  }
  else {
    getRoundup({ key }).then(({ data }) => {
      roundupData.value = data
    }).catch((e) => { console.error(e) })
  }
})

watch([isFinished, meta], () => {
  if (isFinished.value) {
    markEnd()
    sendAnalytics()
  }
}, { flush: 'post' })

const visible = useDocumentVisibility()

let leaveTime = 0
const REFRESH_TIME = 1000 * 60 * 60 * 3 // 3 hours
watchEffect(() => {
  if (visible.value === 'visible') {
    // left for a long while, refresh the page for updates
    if (leaveTime && Date.now() - leaveTime > REFRESH_TIME)
      location.reload()

    // restart timer
    if (meta.value.duration)
      markStart()
  }
  else if (visible.value === 'hidden') {
    leaveTime = Date.now()
    pauseTimer()
  }
}, { flush: 'post' })

nextTick(() => {
  if (accpetCollecting.value)
    sendAnalytics()
})
