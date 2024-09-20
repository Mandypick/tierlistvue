<script setup>
</script>

<template>
  <main class="bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 h-screen w-full overflow-auto">
      <header class="p-10 w-full flex">
        <div class="mx-auto space-x-2 flex items-center">
          <img class="h-10 w-10" src="@/assets/list-square-2-svgrepo-com.svg">
          <p class="text-white text-4xl text-center font-medium">TierList Demo</p>
        </div>  
      </header>
      <div class="flex">
        <div class="divide-x-2 divide-gray-900 mx-auto flex items-center">
          <router-link class="w-28 bg-gray-600 rounded" to="/">
              <p class="h-6 text-center leading-5">Inicio</p>
          </router-link>
          <router-link class="w-28 bg-gray-600 rounded" to="/acerca">
              <p class="h-6 text-center leading-5">Acerca</p>
          </router-link>  
        </div> 
      </div>
    <RouterView />
  </main>  
</template>

<style>
p{
  color:aliceblue;
}
</style>
