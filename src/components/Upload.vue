<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">آپلود </span>
            <i class="fas fa-upload float-left text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{'bg-green-400 border-green-400 border-solid':  is_dragover }"

                @dragend.prevent.stop= 'is_dragover = false'
                @dragover.prevent.stop= 'is_dragover  = true'
                @dragenter.prevent.stop=  'is_dragover = true'
                @dragleave.prevent.stop= 'is_dragover  = false'
                @drop.prevent.stop= 'upload($event)'
                >
              <h5>فایل مورد نظر خود را آپلود کنید</h5>
            </div>
            <input type="file" multiple @change="upload($event)"/>
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for=" upload in uploads" :key="upload.name"
            :class="upload.textClass">
              <!-- File Name -->
              <div class="font-bold text-sm" >
                <i :class="upload.icon"></i>{{  upload.name }}
                </div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="transition-all progress-bar"
                :class="upload.variant"
                :style="{ width: upload.current_progress + '%' }"
                ></div>
              </div>
            </div>

          </div>
        </div>
</template>

<script>
import { storage, auth, songsColection } from '../includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          // eslint-disable-next-line no-useless-return
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            textClass: 'text-red-400',
          });
          return;
        }
        const storageRef = storage.ref();
        const songsRef = storageRef.child(`songs/${file.name}`);
        const task = songsRef.put(file);
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          textClass: '',
        }) - 1;
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        },
        (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].textClass = 'text-red-400';
          console.log(error);
        },
        async () => {
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            orginal_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: '',
            coment_count: 0,
          };
          song.url = await task.snapshot.ref.getDownloadURL();
          const songRef = await songsColection.add(song);
          const snapshot = await songRef.get();
          this.addSong(snapshot);
          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].textClass = 'text-green-400';
        });
      });
      this.is_dragover = false;
    },
    cancelUpload() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  props: ['addSong'],
  // beforeUnmount() {
  //   this.uploads.forEach((upload) => {
  //     upload.task.cancel();
  //   });
  // },
};
</script>
