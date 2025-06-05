<template>
  <div id="outerContainer" ref="outerContainerRef">
    <div class="container" ref="containerRef" :style="containerStyle">
      <slot></slot>
      <div class="mask"></div>
    </div>
    <div class="controls">
      <button @click="rotateLeft">向左旋转</button>
      <button @click="rotateRight">向右旋转</button>
      <button @click="resetTransform">样式还原</button>
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
})

const containerStyle = computed(() => ({
  transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
  transformOrigin: 'center center',
  cursor: 'grab', // Indicate it's draggable
}))

// --- Mouse Panning ---
let isPanning = false
let panStartX = 0
let panStartY = 0
let initialPanX = 0
let initialPanY = 0

/**
 *
 * @param event
 * @example
 */
const onMouseDown = (event: MouseEvent) => {
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

const onMouseMove = (event: MouseEvent) => {
  if (!isPanning) return
  const dx = event.clientX - panStartX
  const dy = event.clientY - panStartY
  transform.translateX = initialPanX + dx
  transform.translateY = initialPanY + dy
}

const onMouseUp = () => {
  isPanning = false
  if (containerRef.value) {
    containerRef.value.style.cursor = 'grab'
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

// --- Mouse Wheel Zoom ---
const onWheel = (event: WheelEvent) => {
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
  if (!initialTouches || !outerContainerRef.value || !containerRef.value) return
  // event.preventDefault(); // Prevent default only if interacting with the container

  const currentTouches = event.touches

  if (currentTouches.length === 1 && isPanning) { // Pan
    const dx = currentTouches[0].clientX - panStartX
    const dy = currentTouches[0].clientY - panStartY
    transform.translateX = initialPanX + dx
    transform.translateY = initialPanY + dy
  } else if (currentTouches.length === 2 && initialTouches && initialTouches.length === 2) { // Pinch zoom (rotation removed)
    const currentPinchDistance = getDistance(currentTouches)
    // const currentAngle = getAngle(currentTouches); // Removed


    // Zoom
    const oldScale = transform.scale
    const newScale = oldScale * (currentPinchDistance / initialPinchDistance)
    transform.scale = Math.max(0.5, Math.min(newScale, 3)) // Clamp scale

    // Rotate (Removed)
    // const angleDiff = currentAngle - initialAngle;
    // transform.rotate += angleDiff;

    // Update for next move
    initialPinchDistance = currentPinchDistance // Update for continuous scaling

  }
}

const onTouchEnd = (event: TouchEvent) => {
  if (event.touches.length < 2) {
    // If less than 2 touches, reset pinch state (rotation state removed)
    initialTouches = null
    initialPinchDistance = 0
    // initialAngle = 0; // Removed
  }
  if (event.touches.length < 1) {
    isPanning = false
  }
  // If one touch remains, and we were pinching, re-initialize for panning
  if (event.touches.length === 1 && initialTouches && initialTouches.length === 2) {
    isPanning = true;
    panStartX = event.touches[0].clientX;
    panStartY = event.touches[0].clientY;
    initialPanX = transform.translateX;
    initialPanY = transform.translateY;
  }
  initialTouches = event.touches.length > 0 ? event.touches : null;
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
  transform.rotate -= 90 // Rotate 90 degrees left
}

const rotateRight = () => {
  transform.rotate += 90 // Rotate 90 degrees right
}

const resetTransform = () => {
  transform.scale = 1
  transform.translateX = 0
  transform.translateY = 0
  transform.rotate = 0
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
  padding: 8px 15px;
  cursor: pointer;
}

.container {
  width: 50%;
  /* Example fixed width */
  height: 50%;
  /* Example fixed height */
  background-color: lightblue;
  border: 1px solid blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  user-select: none;

  p {
    margin: 10px;
    font-size: 1.2em;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    /* Semi-transparent black */
    cursor: grab;
    /* Indicate it's draggable */
    z-index: 10;
  }
}
</style>
