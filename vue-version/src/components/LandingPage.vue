<template>
  <main class="flex-1 flex flex-col justify-center items-center px-4">
    <div class="w-full max-w-md mx-auto text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">Parenting Moments</h1>
      <p class="text-lg text-gray-700 mb-8">
        Build your confidence and skills with real-life parenting scenarios. Make choices, see outcomes, and get expert
        guidance.
      </p>
      <button
        class="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
        @click="$emit('start')">
        Start
      </button>
    </div>
  </main>
</template>