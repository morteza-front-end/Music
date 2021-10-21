<template>
   <li class="flex justify-between
              items-center p-3  pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
              v-for="song in songs" :key="song.docId"
              >
            <div>
              <router-link :to="{ name: 'song', params:{ id:song.docId }}"
              class="font-bold block text-gray-600">
              نام آهنگ:  {{song.modified_name}}
                </router-link>
              <span class="text-gray-500 text-sm">
                {{ song.display_name }}
              </span>
            </div>

            <div class="text-gray-600 text-lg">
              <router-link custom
              :to="{ name: 'song', params:{ id:song.docId },hash: '#comments'}"
              v-slot="{ navigate }"
              >
              <span class="comments" @click="navigate" >
                <i class="fa fa-comments text-gray-600"></i>
               {{song.coment_count}}
              </span>
              </router-link>
            </div>
          </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    songs: {
      type: Array,
      required: true,
    },
  },
};
</script>
