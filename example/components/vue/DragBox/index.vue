<template>
  <div id="outerContainer" ref="outerContainerRef">
    <div class="container" ref="containerRef" :style="containerStyle">
      <slot></slot>
    </div>
    <div class="controls">
      <button @click="rotateLeft">↶ 左旋</button>
      <button @click="resetTransform">还原</button>
      <button @click="rotateRight">右旋 ↷</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const outerContainerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const transform = reactive({
  scale: 1,
  translateX: 0,
  translateY: 0,
  rotate: 0,
  transition: 'none'
})

const containerStyle = computed(() => ({
  transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
  transformOrigin: 'center center',
  cursor: 'grab', // Indicate it's draggable
  transition: transform.transition, // Only animate rotation
}))

// --- Mouse Panning ---
let isPanning = false
let panStartX = 0
let panStartY = 0
let initialPanX = 0
let initialPanY = 0

const onMouseDown = (event: MouseEvent) => {
  transform.transition = 'none'
  if (event.button !== 0) return // Only left click
  isPanning = true
  panStartX = event.clientX
  panStartY = event.clientY
  initialPanX = transform.translateX
  initialPanY = transform.translateY
  if (containerRef.value) {
    containerRef.value.style.cursor = 'grabbing'
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

let animationFrameId: number | null = null

const onMouseMove = (event: MouseEvent) => {
  transform.transition = 'none'
  if (!isPanning) return

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  const dx = event.clientX - panStartX
  const dy = event.clientY - panStartY

  animationFrameId = requestAnimationFrame(() => {
    transform.translateX = initialPanX + dx
    transform.translateY = initialPanY + dy
  })
}

const onMouseUp = () => {
  transform.transition = 'none'
  isPanning = false
  if (containerRef.value) {
    containerRef.value.style.cursor = 'grab'
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// --- Mouse Wheel Zoom ---
const onWheel = (event: WheelEvent) => {
  transform.transition = 'none'
  event.preventDefault()
  if (!outerContainerRef.value || !containerRef.value) return
  const zoomFactor = 0.1
  const oldScale = transform.scale
  let newScale = oldScale
  if (event.deltaY < 0) { // Zoom in
    newScale = oldScale * (1 + zoomFactor)
  } else { // Zoom out
    newScale = oldScale * (1 - zoomFactor)
  }
  newScale = Math.max(0.5, Math.min(newScale, 3)) // Clamp scale
  transform.scale = newScale
}

// --- Touch Interactions ---
let initialTouches: TouchList | null = null
let initialPinchDistance = 0


const getDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}




const onTouchStart = (event: TouchEvent) => {
  transform.transition = 'none'
  if (!outerContainerRef.value || !containerRef.value) return
  // event.preventDefault(); // Prevent default only if interacting with the container

  initialTouches = event.touches
  if (initialTouches.length === 1) { // Pan
    isPanning = true
    panStartX = initialTouches[0].clientX
    panStartY = initialTouches[0].clientY
    initialPanX = transform.translateX
    initialPanY = transform.translateY
  } else if (initialTouches.length === 2) { // Pinch zoom (rotation removed)
    isPanning = false; // Stop panning if it was active
    initialPinchDistance = getDistance(initialTouches)
    // initialAngle = getAngle(initialTouches); // Removed
  }
}

const onTouchMove = (event: TouchEvent) => {
  transform.transition = 'none'
  if (!initialTouches || !outerContainerRef.value || !containerRef.value) return

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  const currentTouches = event.touches

  animationFrameId = requestAnimationFrame(() => {
    if (currentTouches.length === 1 && isPanning) { // Pan
      const dx = currentTouches[0].clientX - panStartX
      const dy = currentTouches[0].clientY - panStartY
      transform.translateX = initialPanX + dx
      transform.translateY = initialPanY + dy
    } else if (currentTouches.length === 2 && initialTouches && initialTouches.length === 2) { // Pinch zoom (rotation removed)
      const currentPinchDistance = getDistance(currentTouches)

      // Zoom
      const oldScale = transform.scale
      const newScale = oldScale * (currentPinchDistance / initialPinchDistance)
      transform.scale = Math.max(0.5, Math.min(newScale, 3)) // Clamp scale

      // Update for next move
      initialPinchDistance = currentPinchDistance
    }
  })
}

const onTouchEnd = (event: TouchEvent) => {
  transform.transition = 'none'
  if (event.touches.length < 2) {
    initialTouches = null
    initialPinchDistance = 0
  }
  if (event.touches.length < 1) {
    isPanning = false
  }
  if (event.touches.length === 1 && initialTouches && initialTouches.length === 2) {
    isPanning = true;
    panStartX = event.touches[0].clientX;
    panStartY = event.touches[0].clientY;
    initialPanX = transform.translateX;
    initialPanY = transform.translateY;
  }
  initialTouches = event.touches.length > 0 ? event.touches : null;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}


onMounted(() => {
  const el = containerRef.value
  const outerEl = outerContainerRef.value
  if (el) {
    el.addEventListener('mousedown', onMouseDown)
    // Touch events are added to the outer container to capture gestures starting outside the inner one
    // but still intended for it, or to handle multi-touch better.
  }
  if (outerEl) {
    outerEl.addEventListener('wheel', onWheel, { passive: false }) // passive: false to allow preventDefault
    outerEl.addEventListener('touchstart', onTouchStart, { passive: false })
    outerEl.addEventListener('touchmove', onTouchMove, { passive: false })
    outerEl.addEventListener('touchend', onTouchEnd)
    outerEl.addEventListener('touchcancel', onTouchEnd)
  }
})

onUnmounted(() => {
  const el = containerRef.value
  const outerEl = outerContainerRef.value
  if (el) {
    el.removeEventListener('mousedown', onMouseDown)
  }
  if (outerEl) {
    outerEl.removeEventListener('wheel', onWheel)
    outerEl.removeEventListener('touchstart', onTouchStart)
    outerEl.removeEventListener('touchmove', onTouchMove)
    outerEl.removeEventListener('touchend', onTouchEnd)
    outerEl.removeEventListener('touchcancel', onTouchEnd)
  }
  // Clean up document listeners if any were left (e.g., mousemove/mouseup)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

// --- Button Controls ---

const rotateLeft = () => {
  transform.transition = 'transform 0.3s ease'
  transform.rotate -= 90 // Rotate 90 degrees left
}

const rotateRight = () => {
  transform.transition = 'transform 0.3s ease'
  transform.rotate += 90 // Rotate 90 degrees right
}

const resetTransform = () => {
  transform.scale = 1
  transform.translateX = 0
  transform.translateY = 0
  transform.rotate = 0
  transform.transition = 'none'
}

</script>

<style scoped lang="scss">
#outerContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Crucial: clips the inner container */
  background-color: #f0f0f0;
  /* So we can see the bounds */
  position: relative;
  /* For positioning context if needed */
  touch-action: none;
  /* Prevents default browser touch actions like scrolling or pinch-zoom on the page itself */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 20;
  /* Ensure buttons are above the mask */
}

.controls button {
  padding: 5px 20px;
  cursor: pointer;
  border: none;
  background-color: dodgerblue;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:nth-child(2) {
    background-color: grey;

    &:hover {
      background-color: rgb(85, 85, 85);
    }
  }

  &:hover {
    background-color: rgb(0, 122, 245);
  }
}

.container {
  width: 90%;
  /* Example fixed width */
  height: fit-content;
  /* Example fixed height */
  // background-color: lightblue;
  // border: 10px solid blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  user-select: none;
  will-change: transform;
  transform: translateZ(0);

  p {
    margin: 10px;
    font-size: 1.2em;
  }
}
</style>
