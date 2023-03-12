import { ref } from 'vue';
import { defineStore } from 'pinia';

/** ユーザーの名前を保持するストア。 */
export const useUserStore = defineStore(
  'user',
  () => {
    /** ユーザーの名前。 */
    const name = ref('');
    return { name };
  },
  {
    persist: {
      enabled: true,
    },
  }
);
