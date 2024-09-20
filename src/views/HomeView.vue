<script lang="js">
import { defineComponent } from 'vue'
import TierList from '@/components/TierList.vue'

export default defineComponent({
  name:"HomeView",
  components:{ TierList },
  setup(){

  }
})

</script>

<template>
  <main>
    <TierList />
  </main>
</template>
