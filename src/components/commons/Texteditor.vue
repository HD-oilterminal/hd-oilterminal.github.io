<script setup lang="ts">
import 'quill/dist/quill.snow.css'

import Quill from 'quill'
import { onMounted, ref, watch } from 'vue'

defineProps<{ rows?: number }>()

const model = defineModel<string>()
const el = ref<HTMLElement>()
let quill: Quill

onMounted(() => {
  quill = new Quill(el.value!, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    }
  })

  if (model.value) quill.clipboard.dangerouslyPasteHTML(model.value, 'silent')

  quill.on('text-change', () => {
    model.value = quill.getText().trim() ? quill.root.innerHTML : ''
  })
})

watch(model, value => {
  if (!quill || (value ?? '') === quill.root.innerHTML) return

  quill.setContents(quill.clipboard.convert({ html: value ?? '' }), 'silent')
})
</script>

<template>
  <div class="texteditor" @click.prevent>
    <div ref="el" :style="{ height: `calc(${rows ?? 3} * 1rem + 24px)` }" />
    <textarea :value="model" tabindex="-1" aria-hidden="true" @focus="quill?.focus()" />
  </div>
</template>

<style>
.texteditor {
  flex: 1;
  position: relative;

  &:hover .ql-toolbar.ql-snow,
  &:focus-within .ql-toolbar.ql-snow {
    opacity: 1;
  }

  .ql-toolbar.ql-snow {
    border: 0;
    padding: 0;
    opacity: 0.4;

    .ql-formats {
      margin-right: 0;
    }

    & + .ql-container.ql-snow {
      border: 1px var(--tw-border-style) var(--color-gray-300);
      border-radius: var(--radius-md);
    }
  }
}

.texteditor textarea {
  position: absolute;
  inset: auto 0 0 0;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
