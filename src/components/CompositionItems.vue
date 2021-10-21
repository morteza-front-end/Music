<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
              <div>
                <h4 class="inline-block text-2xl font-bold">
                    {{ song.modified_name }}
                </h4>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteSong">
                  <i class="fa fa-times"></i>
                </button>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm"
                >
                  <i class="fa fa-pencil-alt" ></i>
                </button>
              </div>
              <div v-show="showForm">
                  <div class="text-white text-center font-bold p-4 mb-4" v-if="alert_show"
                  :class="alert_variant"
                   >
                   {{ alert_message }}</div>
                <vee-form :validation-schema="schema" :initial-values="song"
                @submit="edit">
                  <div class="mb-3">
                    <label class="inline-block mb-2">عنوان آهنگ </label>
                    <vee-field name="modified_name" type="text"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="نام آهنگ..."
                      @input="updateUnsavedFlag(true)" />
                      <ErrorMessage name="modified_name" class="text-red-500"/>
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2">ژانر آهنگ</label>
                    <vee-field type="text" name="genra"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
                      <ErrorMessage name="ژانر آهنگ" class="text-red-500"/>
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2"> خواننده</label>
                    <vee-field type="text" name="display_name"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder=" نام خواننده را وارد کنید..." @input="updateUnsavedFlag(true)" />
                      <ErrorMessage name="display_name" class="text-red-500"/>
                  </div>
                  <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 m-3"
                  :disabled="in_sunbmition">
                    تایید
                  </button>
                  <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                  :disabled="in_sunbmition" @click.prevent="showForm  = false">
                    برگشت
                  </button>
                </vee-form>
              </div>
            </div>
</template>

<script>
import { songsColection, storage } from '../includes/firebase';

export default {
  name: 'CompositionItems',
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genra: 'alpha_spaces',
        display_name: 'required',
      },
      in_sunbmition: false,
      alert_show: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'لطفا صبر کنید!',
    };
  },
  methods: {
    async edit(values) {
      this.in_sunbmition = true;
      this.alert_show = true;
      try {
        await songsColection.doc(this.song.docId).update(values);
      } catch (error) {
        this.in_sunbmition = false;
        this.alert_show = true;
        this.alert_variant = 'bg-red-500';
        this.alert_message = ' خطا!!لطفا دوباره تلاش کنید!';
        console.log(error);
        // eslint-disable-next-line no-useless-return
        return;
      }
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);
      this.in_sunbmition = true;
      this.alert_show = true;
      this.alert_variant = 'bg-green-500';
      this.alert_message = ' تبریک';
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.orginal_name}`);
      await songRef.delete();
      await songsColection.doc(this.song.docId).delete();
      this.removeSong(this.index);
    },
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      required: true,
    },
  },
};
</script>
