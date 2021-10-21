<template>
<main>
   <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none" @click.prevent="newSong(song)" >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left mr-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold"> {{ song.modified_name }} </div>
        <div>{{song.genra}}</div>
        <div class="song-price">
          {{$n(1000, 'currency')}}
        </div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6" id="comments">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">کامنت ها ({{song.coment_count}})</span>
        <i class="fa fa-comments float-left text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center front-bold p-5 mb-4"
        :class="comment_variant"
         v-if="comment_alert_show" >
          {{comment_alert_message}}
        </div>
        <vee-form :validation-schema="SongSchima" @submit="addComent" v-if="userLogin" >
          <vee-field as="textarea" name="content"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="نظر خود را وارد کنید..."></vee-field>
            <ErrorMessage name="content" class="text-red-500"/>
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
          :disabled="comment_in_submission"
          >
            ثبت
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">آخرین </option>
          <option value="2">قدیمی تر</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200"
     v-for="comment in sortedComments" :key="comment.doId" >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">
           {{ comment.name }}
           </div>
        <time> {{ comment.dataPosted }} </time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { songsColection, auth, commentsColection } from '../includes/firebase';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comment_in_submission: false,
      comment_alert_show: false,
      comment_variant: 'bg-blue-500',
      comment_alert_message: 'صبر کنید...',
      SongSchima: {
        content: 'required|min:3',
      },
      comments: [],
      sort: '1',
    };
  },
  methods: {
    ...mapActions(['newSong']),
    async addComent(values, { resetForm }) {
      this.coment_in_submission = true;
      this.comment_alert_show = true;
      this.comment_variant = 'bg-blue-500';
      this.comment_alert_message = 'لطفا صبر کنید...';
      const comment = {
        content: values.content,
        dataPosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };
      try {
        await commentsColection.add(comment);
        this.song.coment_count += 1;
        await songsColection.doc(this.$route.params.id).update({
          coment_count: this.song.coment_count,
        });
        this.coment_in_submission = false;
        this.comment_alert_show = true;
        this.comment_variant = 'bg-green-500';
        this.comment_alert_message = 'نظر شما با موفقیت افزوده شد';
      } catch (error) {
        this.coment_in_submission = false;
        this.comment_alert_show = true;
        this.comment_variant = 'bg-red-500';
        this.comment_alert_message = 'خطا!!! لطفا دوباره تلاش کنید.';
        console.log(error);
      }
      this.getComments();
      resetForm();
    },
    async getComments() {
      const snapshot = await commentsColection.where('sid', '==', this.$route.params.id)
        .get();
      this.comments = [];
      snapshot.forEach((doc) => [
        this.comments.push({
          docId: doc.id,
          ...doc.data(),
        }),
      ]);
    },
  },
  computed: {
    ...mapState(['userLogin']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.dataPosted) - new Date(a.dataPosted);
        }
        return new Date(a.dataPosted) - new Date(b.dataPosted);
      });
    },
  },
  async created() {
    const docsnapshat = await songsColection.doc(this.$route.params.id).get();
    if (!docsnapshat.exists) {
      this.$router.push({ name: 'Home' });
      return;
    }
    this.song = docsnapshat.data();
    this.getComments();
  },
};
</script>
