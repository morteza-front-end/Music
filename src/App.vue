<template>
  <div>
    <app-header></app-header>

    <router-view v-slot="{ Component }" >
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>

      </transition>
    </router-view>

    <!-- Player -->
   <app-player></app-player>

    <auth-modal></auth-modal>
  </div>
</template>
<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import AppPlayer from './components/Player.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    AppPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>
<style>
.fade-ernter-from {
  opacity: 0;
}
.fade-ernter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
   transition: all 0.5s linear;
   opacity: 0 ;
}
</style>
