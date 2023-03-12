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

/** クイズの問題を保持するストア。 */
export const useQuizStore = defineStore(
  'quiz',
  () => {
    /** 問題の件数。 */
    const count = ref(0);
    /** 問題リスト。 */
    const quizList = ref({} as { [key: number]: Quiz });
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
    return { getQuizList, getQuiz, addNewQuiz, updateQuiz, removeQuiz };
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
