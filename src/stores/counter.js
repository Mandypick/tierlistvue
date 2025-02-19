import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {

  // data
  const count = ref(4) // string,number, boolean
  const count_ = reactive([]) // objects, arrays
 
  // computed
  const doubleCount = computed(() => count.value * 2)
  
  // methods
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
