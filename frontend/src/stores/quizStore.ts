import { ref } from 'vue';
import { defineStore } from 'pinia';

/** クイズの問題。 */
interface Quiz {
  /** 問題文。 */
  question: string;
  /** 答え。 */
  answer: string;
  /** タグ。 */
  tags: string[];
  /** 解説。 */
  explanation: string;
  /** 作成者。 */
  editor: string;
  /** 更新日。ミリ秒単位のUNIX時刻。 */
  updatedAt: number;
}
/** パースしたQuizオブジェクトのバリデーションを行う。 */
const isQuizObject = (quiz?: Partial<Quiz>): quiz is Quiz => {
  return (
    quiz != undefined &&
    typeof quiz.question === 'string' &&
    typeof quiz.answer === 'string' &&
    Array.isArray(quiz.tags) &&
    quiz.tags.every((tag) => typeof tag === 'string') &&
    typeof quiz.explanation === 'string' &&
    typeof quiz.editor === 'string' &&
    typeof quiz.updatedAt === 'number'
  );
};
/** クイズの問題リスト。 */
type QuizList = { [key: number]: Quiz };

/** クイズの問題を保持するストア。 */
export const useQuizStore = defineStore(
  'quiz',
  () => {
    /** 問題の件数。 */
    const count = ref(0);
    /** 問題リスト。 */
    const quizList = ref({} as QuizList);
    /** 問題リストを取得する。 */
    const getQuizList = () => {
      return Object.entries(quizList.value);
    };
    /** 問題を取得する。 */
    const getQuiz = (id: number) => {
      return quizList.value[id];
    };
    /** 問題を追加する。 */
    const addNewQuiz = (editor: string) => {
      const newId = count.value;
      quizList.value[newId] = makeNewQuiz(editor);
      count.value++;
      return newId;
    };
    /** 問題を生成する。 */
    const makeNewQuiz = (editor: string): Quiz => {
      return {
        question: '',
        answer: '',
        tags: [],
        explanation: '',
        editor,
        updatedAt: Date.now(),
      };
    };
    /** 問題の内容を更新する。 */
    const updateQuiz = (id: number, quiz: Quiz) => {
      if (quizList.value[id] == undefined) return;
      quizList.value[id] = quiz;
    };
    /** 問題を削除する。 */
    const removeQuiz = (id: number) => {
      delete quizList.value[id];
    };
    /** 問題リストをシリアライズする。 */
    const exportJsonQuizList = () => JSON.stringify(quizList.value);
    /** シリアライズされた問題リストをインポートする。 */
    const importJsonQuizList = (jsonString: string) => {
      const persedQuizList = JSON.parse(jsonString) as QuizList;
      const newQuizList: QuizList = {};
      let maxId = -1;
      for (const idAndQuiz of Object.entries(persedQuizList)) {
        const id = Number(idAndQuiz[0]);
        const quiz = idAndQuiz[1];
        if (!isQuizObject(quiz)) continue;
        newQuizList[id] = quiz;
        maxId = Math.max(maxId, id);
      }
      quizList.value = newQuizList;
      count.value = maxId + 1;
    };
    return {
      count,
      quizList,
      getQuizList,
      getQuiz,
      addNewQuiz,
      updateQuiz,
      removeQuiz,
      exportJsonQuizList,
      importJsonQuizList,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
        },
      ],
    },
  }
);
