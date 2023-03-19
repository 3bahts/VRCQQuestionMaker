<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { QTable } from 'quasar';
import { useQuizStore } from 'src/stores/quizStore';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const quizStore = useQuizStore();
const router = useRouter();

/** 現在のユーザー名。 */
const userName = computed(() => userStore.name);
/** 問題リスト。 */
const quizList = computed(() => quizStore.getQuizList());

/** 問題表示テーブルの列定義。 */
const defineColumns = (): Exclude<QTable['columns'], undefined> => {
  return [
    /** ID */
    {
      name: 'id',
      required: true,
      label: 'ID',
      field: 'id',
      align: 'left',
      sortable: true,
      style: 'width: 1rem',
    },
    /** 問題文。 */
    {
      name: 'question',
      required: true,
      label: '問題',
      align: 'left',
      field: 'question',
      sortable: true,
      style: 'width: 24rem',
    },
    /** 正解。 */
    {
      name: 'answer',
      required: true,
      label: '正解',
      field: 'answer',
      align: 'left',
      sortable: true,
      style: 'width: 12rem',
    },
  ];
};
const columns = defineColumns();
/** データ識別に使用する列キー */
const key = columns[0].name;
/** 問題表示テーブルのデータ。 */
const rows = computed(
  (): Exclude<QTable['rows'], undefined> =>
    quizList.value.map((quiz) => {
      return {
        id: quiz[0],
        question: quiz[1].question,
        answer: quiz[1].answer,
      };
    })
);

/** 問題編集ページに移動する。 */
const jumpToEdit = (_evt: Event, row: { id: string }) => {
  router.push(`/questions/${row.id}`);
};

/** 問題を追加して編集画面に移動する。 */
const addQuiz = () => {
  const id = quizStore.addNewQuiz(userName.value);
  router.push(`/questions/${id}`);
};

/** 問題リストをエクスポートする。 */
const exportJSON = () => {
  const blob = new Blob([quizStore.exportJsonQuizList()], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quizList.json';
  link.click();
  link.remove();
};

/** 問題リストをインポートする。 */
const importJSON = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', (evt) => {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      quizStore.importJsonQuizList(reader.result as string);
    };
  });
  input.click();
  input.remove();
};
</script>

<template>
  <div class="q-pa-md q-gutter-md column items-center justify-evenly">
    <div>
      <q-table
        title="問題リスト"
        :columns="columns"
        :row-key="key"
        :rows="rows"
        separator="cell"
        @row-click="jumpToEdit"
      />
    </div>
    <div class="row q-gutter-sm">
      <q-btn color="primary" label="問題追加" @click="addQuiz" />
      <q-btn color="secondary" label="エクスポート(JSON)" @click="exportJSON" />
      <q-btn color="secondary" label="インポート(JSON)" @click="importJSON" />
    </div>
  </div>
</template>
