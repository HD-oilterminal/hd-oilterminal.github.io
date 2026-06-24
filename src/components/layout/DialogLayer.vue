<script setup lang="ts">
import { _dialogState } from '../../composables/useDialog'
import Button from '../commons/Button.vue'

const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()
const cancelBtnRef = ref<HTMLButtonElement>()

watch(_dialogState, async state => {
  if (state?.type === 'prompt') {
    inputValue.value = state.defaultValue ?? ''
    await nextTick()
    inputRef.value?.focus()
  } else if (state?.type === 'confirm') {
    await nextTick()
    cancelBtnRef.value?.focus()
  }
})

function onConfirm() {
  const state = _dialogState.value
  if (!state) return
  if (state.type === 'confirm') {
    state.resolve(true)
  } else {
    state.resolve(inputValue.value)
  }
  _dialogState.value = null
}

function onCancel() {
  const state = _dialogState.value
  if (!state) return
  if (state.type === 'confirm') {
    state.resolve(false)
  } else {
    state.resolve(undefined)
  }
  _dialogState.value = null
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && _dialogState.value?.type === 'confirm') onConfirm()
  if (e.key === 'Escape') onCancel()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="_dialogState" class="fixed inset-0 z-9999 flex items-center justify-center" @keydown="onKeydown">
        <div class="absolute inset-0 bg-black/40" @click="onCancel" />

        <div class="relative z-10 w-88 rounded-2xl bg-white px-8 pt-6 pb-8 shadow-2xl" @click.stop>
          <button
            ref="cancelBtnRef"
            class="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            @click="onCancel"
          >
            ✕
          </button>

          <div class="mb-5 flex justify-center">
            <div
              v-if="_dialogState.type === 'confirm'"
              class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50"
            >
              <svg class="h-12 w-12" viewBox="0 0 48 48" fill="none">
                <path d="M24 6L4 42h40L24 6z" fill="#F59E0B" />
                <path d="M24 6L4 42h40L24 6z" stroke="#D97706" stroke-width="1" stroke-linejoin="round" />
                <rect x="22.5" y="18" width="3" height="13" rx="1.5" fill="white" />
                <rect x="22.5" y="33" width="3" height="3" rx="1.5" fill="white" />
              </svg>
            </div>

            <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <svg class="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>

          <h3 v-if="_dialogState.title" class="mb-2 text-center text-lg font-bold text-gray-900">
            {{ _dialogState.title }}
          </h3>

          <p class="text-center text-sm leading-relaxed whitespace-pre-wrap text-gray-500">
            {{ _dialogState.message }}
          </p>

          <input
            v-if="_dialogState.type === 'prompt'"
            ref="inputRef"
            v-model="inputValue"
            type="text"
            :placeholder="_dialogState.placeholder"
            class="h-control-md mt-4 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            @keydown.enter="onConfirm"
            @keydown.esc="onCancel"
          />

          <div class="mt-6 flex gap-3">
            <Button :label="_dialogState.confirmLabel || $t('확인')" variant="primary" class="flex-1" @click="onConfirm" />
            <Button :label="_dialogState.cancelLabel || $t('확인')" variant="ghost" class="flex-1" @click="onCancel" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
