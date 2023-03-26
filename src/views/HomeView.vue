<script setup lang="ts">
</script>

<template>
  <main>
    <v-container>
      <v-btn
        @click="$router.push('/task/new')"
        class="mb-4"
        color="indigo-darken-3"
      >Добавить задачу</v-btn>
      <v-card>
        <v-card-title>Нет задач</v-card-title>
        <v-card-text>
          Чтобы добавить задачу нажмите "Добавить задачу"
        </v-card-text>
      </v-card>
    </v-container>
  </main>
</template>
