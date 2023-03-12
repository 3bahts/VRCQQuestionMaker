<script setup lang="ts">
const logo = 'img/logo.png';
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-img :src="logo" width="2.5rem" />
        <q-toolbar-title> 作問アプリ </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title> ここに画面遷移のボタンを置く。 </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
