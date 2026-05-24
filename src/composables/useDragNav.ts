import { ref } from 'vue'

export function useDragNav(onPrev: () => void, onNext: () => void, threshold = 50) {
  const startX = ref<number | null>(null)
  let didDrag = false

  function onPointerDown(e: PointerEvent) {
    startX.value = e.clientX
    didDrag = false
  }

  function onPointerUp(e: PointerEvent) {
    if (startX.value === null) return
    const delta = startX.value - e.clientX
    if (Math.abs(delta) >= threshold) {
      if (delta > 0) onNext()
      else onPrev()
      didDrag = true
    }
    startX.value = null
  }

  function onPointerCancel() {
    startX.value = null
    didDrag = false
  }

  // click.capture 로 사용: 드래그 후 발생하는 click 이벤트를 차단
  function onClickCapture(e: MouseEvent) {
    if (didDrag) {
      e.stopPropagation()
      didDrag = false
    }
  }

  // 빠른 연속 스크롤 방지용 throttle
  let lastWheelTime = 0
  function onWheel(e: WheelEvent) {
    const now = Date.now()
    if (now - lastWheelTime < 300) return
    lastWheelTime = now
    if (e.deltaY > 0) onNext()
    else onPrev()
  }

  return { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel }
}
