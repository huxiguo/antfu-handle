<script setup lang="ts">
import { key } from '~/state'
import { t } from '~/i18n'
// import { START_DATE } from '~/logic'
import { updateRoundup } from '~/service/roundup'
import { meta, tries } from '~/storage'

// const ms = computed(() => 86400000 - (+now.value - +START_DATE) % 86400000)
// const formatted = computed(() => {
//   const h = Math.floor((ms.value % 86400000) / 3600000)
//   const m = Math.floor((ms.value % 3600000) / 60000)
//   const s = Math.floor((ms.value % 60000) / 1000)
//   return t('time-format', h, m, s)
// })
function reset() {
  tries.value = []
  meta.value = {}
}
async function roundup() {
  if (!key) return
  const { status, data } = await updateRoundup({ key })
  // eslint-disable-next-line no-console
  console.log(status, data)
  if (status === 200) {
    reset()
    window.location.reload()
  }
}

</script>

<template>
  <div flex gap-5 py8>
    <div flex="~ col center" relative w-38>
      <button btn tracking-widest p="x4 y2" @click="roundup()">
        {{ t('roundup') }}
      </button>
    </div>

    <div w-1px border="l base" />

    <div flex="~ col gap-4" items-center>
      <ShareButton />
      <ExportImage />
    </div>
  </div>
</template>
