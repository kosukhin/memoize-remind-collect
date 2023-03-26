<script lang="ts" setup>
import {useRoute} from "vue-router";
import {Result, useResultsStore} from "@/stores/results";
import {computed, ref} from "vue";
import {nowDay} from "@/utils/nowDay";
import {storeToRefs} from "pinia";

const {params: {id}} = useRoute();
const resultsStore = useResultsStore();
const {results} = storeToRefs(resultsStore);

const taskResults = computed(() => {
  return results.value[String(id)] ?? []
})

const form = ref<Result>({
  taskId: String(id),
  day: nowDay(),
  value: ''
})

const addResult = () => {
  resultsStore.addResult(
      form.value.taskId,
      form.value.value
  );
  form.value.value = '';
}

const removeIndex = (index: number) => {
  results.value[String(id)].splice(index, 1);
}
</script>

<template>
  <v-container>
    <v-btn
        @click="$router.push('/')"
        class="mb-4"
        color="indigo-darken-3"
    >Назад</v-btn>
    <v-card class="mb-3">
      <v-card-title>Результаты</v-card-title>
      <v-form @submit.prevent="addResult" class="form-padded">
        <v-text-field
            v-model="form.day"
            label="День"
        ></v-text-field>
        <v-text-field
            v-model="form.value"
            label="Значение"
        ></v-text-field>
        <v-btn color="green" type="submit" block class="mt-2">Сохранить</v-btn>
      </v-form>
    </v-card>
    <v-card>
      <table style="width: 100%">
        <tr :key="index" v-for="(result, index) in taskResults">
          <td>{{ result.day }}</td>
          <td><b>{{ result.value }}</b></td>
          <td width="2%">
            <v-btn @click="removeIndex(index)" size="small" color="red">Удалить</v-btn>
          </td>
        </tr>
      </table>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>