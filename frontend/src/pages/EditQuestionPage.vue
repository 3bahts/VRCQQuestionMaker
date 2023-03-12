<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useEditQuiz } from 'src/model/editQuiz';

interface Prop {
  /** 編集する問題のID。 */
  id: number;
}
const props = defineProps<Prop>();

const { question, answer, explanation, update, remove } = useEditQuiz(props.id);
const router = useRouter();

/** 変更を保存して元のページに戻る。 */
const saveAndBack = () => {
  update();
  router.back();
};
/** 変更を破棄して元のページに戻る。 */
const removeAndBack = () => {
  remove();
  router.back();
};
</script>

<template>
  <div class="q-pa-md q-gutter-md column items-center justify-evenly">
    <q-input
      class="width-75"
      outlined
      type="textarea"
      label="問題"
      v-model="question"
    />
    <q-input class="width-75" outlined label="正解" v-model="answer" />
    <q-input
      class="width-75"
      outlined
      type="textarea"
      label="解説"
      v-model="explanation"
    />
    <div class="row q-gutter-x-md">
      <q-btn color="positive" label="保存" @click="saveAndBack" />
      <q-btn color="negative" label="削除" @click="removeAndBack" />
    </div>
  </div>
</template>

<style scoped>
.width-75 {
  width: 75%;
  max-width: 30rem;
}
</style>
