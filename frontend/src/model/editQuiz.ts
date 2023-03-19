import { ref } from 'vue';
import { useQuizStore } from 'src/stores/quizStore';

/** 1つの問題を編集するコンポーザブル。 */
export const useEditQuiz = (id: number) => {
  const quizStore = useQuizStore();
  const quiz = ref(quizStore.getQuiz(id));
  if (quiz.value == undefined) throw new Error(`Invalid quiz id :${id}`);

  /** 問題。 */
  const question = ref(quiz.value.question);
  /** 答え。 */
  const answer = ref(quiz.value.answer);
  /** 解説。 */
  const explanation = ref(quiz.value.explanation);

  /** 編集した内容をストアに反映させる。 */
  const update = () => {
    quiz.value = {
      ...quiz.value,
      question: question.value,
      answer: answer.value,
      explanation: explanation.value,
      updatedAt: Date.now(),
    };
    quizStore.updateQuiz(id, quiz.value);
  };
  /** 編集中の内容をストアから破棄する。 */
  const remove = () => {
    quizStore.removeQuiz(id);
  };
  return { question, answer, explanation, update, remove };
};
