<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { QuizImporter, useImportQuiz } from 'src/model/importQuiz';

/** TSVファイルをインポートして問題を追加するページ。 */
const quizInporter: Ref<QuizImporter | undefined> = ref(undefined);
/** インポートするTSVファイル。 */
const tsvFile = ref<File | undefined>();

/** 列名読み込みタスク。 */
const readHeaderTask = ref<Promise<void> | undefined>();
/** クイズのインポートタスク。 */
const importTask = ref<Promise<void> | undefined>();
/** 列名読み込みタスクが実行中かどうか。 */
const isReadHeaderRunning = computed(() => readHeaderTask.value != undefined);
/** クイズのインポートタスクが実行中かどうか。 */
const isImportRunning = computed(() => importTask.value != undefined);
/** ファイル選択コンポーネントが無効かどうか。 */
const isFilePickerDisabled = computed(
  () => isReadHeaderRunning.value || isImportRunning.value
);

/** 問題列としてインポートする列名。 */
const questionColumn = ref<string | undefined>();
/** 答え列としてインポートする列名。 */
const answerColumn = ref<string | undefined>();
/** 解説列としてインポートする列名。 */
const explanationColumn = ref<string | undefined>();

/** TSVファイルが設定されたらヘッダ読み込みタスクを実行する。 */
watch(
  () => tsvFile.value,
  () => makeReadHeaderTask()
);

/** TSVファイルの列名が読み込まれたら各列名の選択をリセットする。 */
watch(
  () => quizInporter.value?.state.headerList,
  () => {
    questionColumn.value = quizInporter.value?.state.headerList.find(
      (header) => header === '問題'
    );
    answerColumn.value = quizInporter.value?.state.headerList.find(
      (header) => header === '答え'
    );
    explanationColumn.value = quizInporter.value?.state.headerList.find(
      (header) => header === '解説'
    );
  }
);

/** ヘッダ読み込みタスクを生成する。 */
const makeReadHeaderTask = () => {
  if (readHeaderTask.value) return;
  const file = tsvFile.value;
  quizInporter.value = file instanceof File ? useImportQuiz(file) : undefined;
  if (quizInporter.value == undefined) return;

  readHeaderTask.value = new Promise<void>((resolve) => {
    quizInporter.value?.readHeader();
    resolve();
  });
  readHeaderTask.value.finally(() => {
    readHeaderTask.value = undefined;
  });
};
/** ファイルのインポートタスクを生成する。 */
const makeImportTask = () => {
  if (importTask.value) return;
  importTask.value = new Promise<void>((resolve) => {
    quizInporter.value?.importQuiz(
      questionColumn.value,
      answerColumn.value,
      explanationColumn.value
    );
    resolve();
  });
  importTask.value.finally(() => {
    importTask.value = undefined;
  });
};
</script>

<template>
  <q-card>
    <q-card-section class="row justify-between">
      <div>TSVファイルから問題追加</div>
      <q-btn icon="close" flat round v-close-popup e />
    </q-card-section>
    <q-card-section>
      <div class="column q-gutter-md">
        <q-file
          v-model="tsvFile"
          accept=".tsv"
          outlined
          label="TSVファイル"
          :disable="isFilePickerDisabled"
        />
        <div>
          ※Googleスプレッドシートで"ファイル>ダウンロード>タブ区切り形式(.tsv)"
        </div>
        <q-select
          v-model="questionColumn"
          :options="quizInporter?.state.headerList"
          label="問題列"
          outlined
        />
        <q-select
          v-model="answerColumn"
          :options="quizInporter?.state.headerList"
          label="答え列"
          outlined
        />
        <q-select
          v-model="explanationColumn"
          :options="quizInporter?.state.headerList"
          label="解説列"
          outlined
        />
        <q-btn
          color="primary"
          :loading="isImportRunning"
          label="問題の追加"
          @click="makeImportTask"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
