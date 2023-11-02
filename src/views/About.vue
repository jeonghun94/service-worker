<template>
  <NavBar />
  <h1>form</h1>

  <form @submit="onSubmit" class="w-full border flex flex-col">
    <label>Username</label>
    <input v-model="username.value" :ref="username.ref" />
    <p v-if="username.error">{{ username.error.message }}</p>
    <label>Password</label>
    <input v-model="password.value" :ref="password.ref" type="password" />
    <p v-if="password.error">{{ password.error.message }}</p>
    <button type="submit">submit</button>
  </form>

  <input type="text" v-model="msg" class="border border-red-500" />
  <h1 class="border text-black" v-once>{{ msg }}</h1>
  <p v-text="msg"></p>

  <h1 v-show="msg !== 'lal'">show</h1>
</template>

<script>
import { ref, watch } from 'vue';
import { useForm } from 'vue-hooks-form';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'AboutVue',
  components: {
    NavBar,
  },

  setup() {
    const msg = ref('lal');

    const { useField, handleSubmit } = useForm({
      defaultValues: {},
    });
    const username = useField('username', {
      rule: { required: true },
    });
    const password = useField('password', {
      rule: {
        required: true,
        min: 6,
        max: 10,
      },
    });

    watch(
      () => msg.value,
      (val) => {
        console.log(val, 'qwdqww');
      },
      // { immediate: true },
    );

    const onSubmit = (data) => console.log(data);
    return {
      username,
      password,
      msg,
      onSubmit: handleSubmit(onSubmit),
    };
  },
};
</script>
