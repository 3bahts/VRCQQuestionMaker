<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

const userName = ref(userStore.name);
const logo = 'img/logo.png';

/** ログイン処理。 */
const login = () => {
  if (!userName.value) return;
  userStore.name = userName.value;
  router.push('/questions');
};
</script>

<template>
  <div class="fullscreen column items-center justify-evenly">
    <div>
      <q-img :src="logo" />
      <span>作問アプリ</span>
    </div>
    <div class="column q-gutter-sm items-center">
      <q-input outlined label="ユーザー名" v-model="userName" />
      <q-btn color="primary" label="ログイン" @click="login" />
    </div>
  </div>
</template>
