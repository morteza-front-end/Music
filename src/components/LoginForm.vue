<template>
<div class="text-white text-center front-bold p-5 mb-4" v-if="login_show_alert"
            :class="login_alert_variant"> {{ login_alert_msg }} </div>
  <vee-form :validation-schema="loginSchima" @submit="login">
              <!-- Email -->
              <div class="mb-3">
                <label class="inline-block mb-2">
                  {{$t('register.email')}}
                </label>
                <vee-field
                name="email"
                  type="email"
                  class="
                    block
                    w-full
                    py-1.5
                    px-3
                    text-gray-800
                    border border-gray-300
                    transition
                    duration-500
                    focus:outline-none
                    focus:border-black
                    rounded
                  "
                  placeholder="Enter Email" dir="ltr"
                />
                <ErrorMessage class="text-red-500" name="email" />
              </div>
              <!-- Password -->
              <div class="mb-3">
                <label class="inline-block mb-2">
                   {{$t('register.password')}}
                </label>
                <vee-field
                name="password"
                  type="password"
                  class="
                    block
                    w-full
                    py-1.5
                    px-3
                    text-gray-800
                    border border-gray-300
                    transition
                    duration-500
                    focus:outline-none
                    focus:border-black
                    rounded
                  " dir="ltr"
                  placeholder="Password"
                />
                <ErrorMessage class="text-red-500" name="password"/>
              </div>
              <button
                type="submit"
                class="
                  block
                  w-full
                  bg-purple-600
                  text-white
                  py-1.5
                  px-3
                  rounded
                  transition
                  hover:bg-purple-700
                "
                :disabled="login_in_submission"
              >
                Submit
              </button>
            </vee-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchima: {
        email: 'required|min:3|max:100|email:true',
        password: 'required|min:3|max:32|min_value:3',
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_msg: 'در حال ورود...',
    };
  },
  methods: {
    async login(values) {
      this.login_in_submission = true;
      this.login_show_alert = true;
      this.login_alert_msg = 'ورود...';
      this.login_alert_variant = 'bg-blue-600';
      try {
        await this.$store.dispatch('login', values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_show_alert = true;
        this.login_alert_variant = 'bg-red-500';
        this.login_alert_msg = 'ایمیل یا رمز عبور نادرست است.';
        return;
      }
      this.login_alert_variant = 'bg-green-500';
      this.login_alert_msg = 'خوش آمدید';
      window.location.reload();
    },
  },
};
</script>
