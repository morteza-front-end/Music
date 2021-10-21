<template>
<main>
  <div class="home">
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
          {{$t('home.listen')}}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-7 pb-5 font-bold border-b border-gray-200"
        v-icon-secondary="{ icon: 'headphones-alt', left: true }">
          <span class="card-title pt-6">آهنگ ها</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
         <song-item :songs="songs"/>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </div>
</main>
</template>

<script>
// @ is an alias to /src
import { songsColection } from '../includes/firebase';
import SongItem from '../components/SongItem.vue';
import iconSecondary from '../directives/icon-secondary';

export default {
  name: 'Home',
  data() {
    return {
      songs: [],
      maxPerPage: 3,
      pendingRequest: false,
    };
  },
  directives: {
    'icon-secondary': iconSecondary,
  },
  methods: {
    async getSong() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      let snapshot;
      if (this.songs.length) {
        const lastDoc = await songsColection.doc(this.songs[this.songs.length - 1].docId)
          .get();
        snapshot = await songsColection.limit(this.maxPerPage)
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .get();
      } else {
        snapshot = await songsColection.limit(this.maxPerPage)
          .orderBy('modified_name')
          .get();
      }
      snapshot.forEach((document) => {
        this.songs.push({
          doId: document.id,
          ...document.data(),
        });
      });
      this.pendingRequest = false;
    },
    async handelScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bootomOfwidow = Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bootomOfwidow) {
        this.getSong();
      }
    },

  },
  async created() {
    await this.getSong();
    window.addEventListener('scroll', this.handelScroll);
  },
  components: {
    SongItem,
  },
};
</script>
