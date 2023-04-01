import { parse } from 'papaparse';
import { reactive } from 'vue';
import { useQuizStore } from 'src/stores/quizStore';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const quizStore = useQuizStore();

export type QuizImporter = ReturnType<typeof useImportQuiz>;

export const useImportQuiz = (file: File) => {
  /** インポートするファイルの列名。 */
  const state = reactive({
    headerList: [] as string[],
  });

  /** 列名を読み込む。 */
  const readHeader = () => {
    const step = (
      result: Papa.ParseStepResult<string[]>,
      parser: Papa.Parser
    ) => {
      state.headerList = result.data;
      parser.abort();
    };
    parse(file, {
      delimiter: '\t',
      header: false,
      step,
    });
  };

  /** クイズをインポートする。 */
  const importQuiz = (
    questionColumn?: string,
    answerColumn?: string,
    explanationColumn?: string
  ) => {
    const isColumnSelected =
      questionColumn != undefined ||
      answerColumn != undefined ||
      explanationColumn != undefined;

    if (isColumnSelected) {
      parseFile(file, questionColumn, answerColumn, explanationColumn);
    } else {
      parseFileByIndex(file);
    }
  };

  /** 列名を指定してクイズをインポートする。 */
  const parseFile = (
    file: File,
    questionColumn?: string,
    answerColumn?: string,
    explanationColumn?: string
  ) => {
    if (
      questionColumn == undefined &&
      answerColumn == undefined &&
      explanationColumn == undefined
    ) {
      throw new Error('列名がいずれも指定されていません。');
    }
    const userName = userStore.name;
    const step = (
      result: Papa.ParseStepResult<{ [key: string]: string }>,
      parser: Papa.Parser
    ) => {
      const question = questionColumn ? result.data[questionColumn] : undefined;
      const answer = answerColumn ? result.data[answerColumn] : undefined;
      const explanation = explanationColumn
        ? result.data[explanationColumn]
        : undefined;
      quizStore.addNewQuiz(userName, question, answer, explanation);
      parser.resume();
    };
    parse(file, {
      delimiter: '\t',
      header: true,
      step,
    });
  };

  /** 先頭3列をクイズとしてインポートする。 */
  const parseFileByIndex = (file: File) => {
    const userName = userStore.name;
    const step = (
      result: Papa.ParseStepResult<string[]>,
      parser: Papa.Parser
    ) => {
      quizStore.addNewQuiz(
        userName,
        result.data[0],
        result.data[1],
        result.data[2]
      );
      parser.resume();
    };
    parse(file, {
      delimiter: '\t',
      header: false,
      step,
    });
  };
  return { state, readHeader, importQuiz };
};
