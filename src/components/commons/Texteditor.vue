<script setup lang="ts">
import 'quill/dist/quill.snow.css'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

import Quill from 'quill'
import TableUp, {
  defaultCustomSelect,
  TableAlign,
  TableMenuContextmenu,
  TableResizeLine,
  TableResizeScale,
  TableSelection,
  TableVirtualScrollbar
} from 'quill-table-up'
import { onMounted, ref, watch } from 'vue'

defineProps<{ rows?: number }>()

const model = defineModel<string>()
const el = ref<HTMLElement>()
let quill: Quill

onMounted(() => {
  Quill.register({ [`modules/${TableUp.moduleName}`]: TableUp }, true)

  quill = new Quill(el.value!, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ [TableUp.toolName]: [] }],
        ['clean']
      ],
      [TableUp.moduleName]: {
        customSelect: defaultCustomSelect,
        fullSwitch: false,
        modules: [
          { module: TableVirtualScrollbar },
          { module: TableAlign },
          { module: TableResizeLine },
          { module: TableResizeScale },
          { module: TableSelection },
          { module: TableMenuContextmenu }
        ]
      }
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
      border: 1px solid var(--color-gray-300);
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
