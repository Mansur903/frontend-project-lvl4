const yupLocale = {
  string: {
    url: 'invalidUrl',
    min: 'От 3 до 20 символов',
    max: 'Не менее 6 символов',
  },
  mixed: {
    required: 'Это обязательное поле',
    oneOf: 'Пароли должны совпадать',
  },
};

export default yupLocale;
