/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
<template>
   <div class="manage">
      <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload"  :addSong="addSong"/>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">
               {{ $t('manage.my_song') }}
            </span>
            <i class="fa fa-compact-disc float-left text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItems v-for="(song, i) in songs" :key="song.docId"
            :song="song" :updateSong="updateSong" :index="i"
            :removeSong="removeSong" :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
   </div>
</template>

<script>
// import store from '@/store';
import AppUpload from '../components/Upload.vue';
import { songsColection, auth } from '../includes/firebase';
import CompositionItems from '../components/CompositionItems.vue';

export default {
  name: 'manage',
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  components: {
    AppUpload,
    CompositionItems,
  },
  async created() {
    const snapshot = await songsColection
      .where('uid', '==', auth.currentUser.uid)
      .get();
    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genra = values.genra;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docId: document.id,
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.updateUnsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert
      // eslint-disable-next-line no-restricted-globals
      const leave = confirm('تغییرات ذخیره نشده است! آیا می خواهید خارج شوید؟');
      next(leave);
    }
    this.$refs.upload.cancelUpload();
    next();
  },
  // beforeRouteEnter(to, from, next) {
  //   if (store.state.userLogin) {
  //     next();
  //   } else {
  //     next({ name: 'Home' });
  //   }
  // },
};
</script>
