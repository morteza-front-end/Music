<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-end items-center py-5 px-4">
      <!-- App Name -->
       <router-link
       class="text-white font-bold uppercase text-2xl mr-4" :to="{ name:'Home' }"
      exact-active-class="no-color">
        موزیک بانک
        </router-link>
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link
              class="px-2 text-white mr-2"
              :to="{  name:'About'  }"
            >
             درباره ما
            </router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userLogin">
            <a
              class="px-2 text-white mr-2"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              ورود / عضویت
            </a>
          </li>
          <template v-else>
          <li class="mr-5">
            <router-link :to="{ name:'Manage' }" class="px-2 text-white" href="#">
              مدیریت</router-link>
          </li>
          <li>
            <a
              class="px-2 text-white mr-2"
              href="#"
              @click.prevent="sinOut"
            >
             خروج
            </a>
          </li>
          </template>
        </ul>
        <ul class="flex flex-row mt-1  mr-auto">
         <li>
           <a class="px-2 text-white" href="#"
           @click.prevent="changeLocale"
           >
           {{ currentLocale }}
           </a>
         </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLogin']),
    currentLocale() {
      return this.$i18n.locale === 'fa' ? 'فارسی' : 'English';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    sinOut() {
      this.$store.dispatch('singOut');
      if (this.$route.meta.requiredAuth) {
        this.$router.push({ name: 'Home' });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'fa' ? 'en' : 'fa';
    },
  },
};
</script>
