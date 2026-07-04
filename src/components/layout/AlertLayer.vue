<script setup lang="ts">
import { state } from '../../composables/useAlert'
import Button from '../commons/Button.vue'

const btnRef = ref()
const isExpanded = ref(false)

watch(state, state => {
  if (state) {
    isExpanded.value = false
    nextTick().then(() => btnRef.value?.focus())
  }
})

const onConfirm = (clicked?: boolean) => {
  if (!state.value) return
  if (state.value?.readonly && !clicked) return

  state.value.resolve()
  state.value = null
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === 'Escape') onConfirm()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="alert-fade">
      <div v-if="state" class="fixed inset-0 z-9999 flex items-center justify-center" @keydown="onKeydown">
        <div class="absolute inset-0 bg-black/40" @click="onConfirm()" />

        <div
          class="relative z-10 flex max-h-[80vh] w-88 flex-col overflow-hidden rounded-2xl bg-white px-4 pt-3 pb-4 shadow-2xl"
          @click.stop
        >
          <div class="shrink-0">
            <div class="mb-5 flex justify-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg class="h-10 w-10" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5" />
                  <path d="M14 14L26 26M26 14L14 26" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </div>
            </div>

            <h3 v-if="state.title" class="mb-2 text-center text-lg font-bold text-gray-900">
              {{ state.title }}
            </h3>

            <p class="text-center leading-relaxed whitespace-pre-wrap text-gray-500">
              {{ state.message }}
            </p>
          </div>

          <div v-if="state.detail" class="mt-3 flex min-h-0 flex-col" :class="isExpanded ? 'flex-1' : 'shrink-0'">
            <pre
              class="rounded-lg bg-gray-50 px-3 py-2.5 font-mono text-xs leading-relaxed text-gray-600"
              :class="isExpanded ? 'min-h-0 flex-1 overflow-y-auto' : 'line-clamp-1 overflow-hidden'"
              >{{ state.detail }}</pre
            >
            <button
              class="m-2 shrink-0 text-right text-xs text-blue-500 transition-colors hover:text-blue-700"
              @click="isExpanded = !isExpanded"
            >
              {{ $t(isExpanded ? '접기' : '펼치기') }}
            </button>
          </div>

          <div class="mt-6 shrink-0">
            <Button
              ref="btnRef"
              :label="state.confirmLabel || $t('확인')"
              variant="primary"
              class="w-full py-4"
              @click="onConfirm(true)"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
