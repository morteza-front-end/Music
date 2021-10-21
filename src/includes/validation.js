import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure,
} from 'vee-validate';
import {
  required, min, max, alpha_spaces as alphaSpace, email, min_value as minVal, max_value as maxVal,
  confirmed,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpace);
    defineRule('email', email);
    defineRule('min_value', minVal);
    defineRule('max_value', maxVal);
    defineRule('confirmed', confirmed);
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `این بخش${ctx.field} اجباری است!`,
          min: 'این بخش بسیار کوتاه است!',
          max: 'این بخش بیشتر از این مقدار مقدور نیست!',
        };

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : 'این فیلد اجباری است';

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },

};
