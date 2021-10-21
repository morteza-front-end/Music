<template>
  <div>
       <div class="text-white text-center front-bold p-5 mb-4" v-if="reg_show_alert"
            :class="reg_alert_variant"> {{ reg_alert_msg }} </div>
            <vee-form
            @submit="register"
            :validation-schema='schema'
            :initial-values="userData "
            >
              <!-- Name -->
              <div class="mb-3">
                <label class="inline-block mb-2 ">Name</label>
                <vee-field name="name"
                  type="text"
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
                  placeholder="Enter Name"  dir="ltr"
                />
                <ErrorMessage  class="text-red-600"  name="name"/>
              </div>
              <!-- Email -->
              <div class="mb-3">
                <label class="inline-block mb-2">Email</label>
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
                  placeholder="Enter Email"  dir="ltr"
                />
                <ErrorMessage  class="text-red-600"  name="email"/>
              </div>
              <!-- Age -->
              <div class="mb-3">
                <label class="inline-block mb-2">Age</label>
                <vee-field
                  name="age"
                  type="number"
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
                   dir="ltr"
                />
                <ErrorMessage class="text-red-600" name="age"/>
              </div>
              <!-- Password -->
              <div class="mb-3">
                <label class="inline-block mb-2">Password</label>
                <vee-field name="password"
                  :bails="false"  v-slot='{field, errors }' >
                <input  type="password"
                 class=" block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                 transition  duration-500 focus:outline-none focus:border-black rounded"
                  placeholder="Password" v-bind="field" dir="ltr" />
                  <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                  </div>
                </vee-field>
              </div>
              <!-- Confirm Password -->
              <div class="mb-3">
                <label class="inline-block mb-2">Confirm Password</label>
                <vee-field
                name="confirm_password"
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
                  "
                  placeholder="Confirm Password"
                  dir="ltr"
                />
                <ErrorMessage class="text-red-600" name="confirm_password"/>
              </div>
              <!-- Country -->
              <div class="mb-3">
                <label class="inline-block mb-2">Country</label>
                <vee-field as="select"
                name="country"
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
                >
                  <option value="USA">USA</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Germany">Germany</option>
                </vee-field>
                <ErrorMessage class="text-red-600" name="country"/>
              </div>
              <!-- TOS -->
              <div class="mb-3 pl-6 float-right"  >
                <i18n-t class="inline-block" keypath="register.accept" tag="label">
                 <a href="#">{{ $t('register.TOS') }}</a>
                  </i18n-t>
                   <vee-field name="tos" value='1'
                  type="checkbox"
                  class="w-4 h-4 float-left -ml-6 mt-1 rounded"
                />
                 <ErrorMessage class="text-red-600" name="tos"/>
              </div>
              <button
                type="submit"
                :disabled="reg_in_submission"
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
              >
                Submit
              </button>
            </vee-form>
  </div>
</template>

<script>

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:10|alpha_spaces',
        email: 'required|min:3|max:125|email:true',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:3|max:10|min_value:3',
        confirm_password: 'confirmed:@password',
        country: 'required',
        tos: 'required',
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'صبر کنید!اکانت  شما در حال ساخت میباشد.',
    };
  },
  methods: {
    async register(values) {
      this.reg_in_submission = true;
      this.reg_show_alert = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'صبر کنید!';

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'خطایی رخ داده است!لطفا دوباره تلاش کنید';
        console.log(error);
        return;
      }
      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'تبریک!';
      // window.location.reload();
    },
  },
};
</script>
