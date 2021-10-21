import { createStore } from 'vuex';
import { Howl } from 'howler';
import helper from '../includes/helper';
import { auth, userColection } from '../includes/firebase';

export default createStore({
  state: {
    isShowModal: false,
    userLogin: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.isShowModal = !state.isShowModal;
    },
    toggleUserLogin(state) {
      state.userLogin = !state.userLogin;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email, payload.password,
      );
      await userColection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        country: payload.country,
        age: payload.age,
      });
      await userCred.user.updateProfile({
        displayName: payload.name,
      });
      console.log(userCred);
      commit('toggleUserLogin');
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);
      commit('toggleUserLogin');
    },
    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleUserLogin');
      }
    },
    singOut({ commit }) {
      auth.signOut();
      commit('toggleUserLogin');
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      commit('newSong', payload);

      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    async togglePlay({ state }) {
      if (!state.sound.playing) {
        // eslint-disable-next-line no-useless-return
        return;
      }
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);
      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
  getters: {
    authShowModal(state) {
      return state.isShowModal;
    },
    palying: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  modules: {
  },
});
