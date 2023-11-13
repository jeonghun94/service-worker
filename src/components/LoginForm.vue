<template>
  <div class="mt-5 flex items-start justify-center">
    <div class="w-full p-6 bg-white shadow-md">
      <h1 class="text-2xl font-semibold mb-6">로그인</h1>

      <form>
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            class="mt-1 p-2 w-full border rounded-md text-sm"
            placeholder="이메일을 입력해주세요"
          />
        </div>

        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            class="mt-1 p-2 w-full border rounded-md text-sm"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <div class="mb-6">
          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            로그인
          </button>
        </div>
      </form>

      <div class="my-3 flex items-center">
        <div class="flex-1 border-t border-gray-500"></div>
        <p class="mx-2 text-gray-500 font-bold">or</p>
        <div class="flex-1 border-t border-gray-500"></div>
      </div>

      <!-- 간편로그인 버튼 -->
      <div class="flex flex-col justify-between items-center gap-1">
        <button
          @click="kakaoLogin()"
          class="w-full bg-[#FFD900] text-white p-2 rounded-md"
        >
          카카오로 로그인
        </button>

        <button
          @click="naverLogin()"
          class="w-full bg-[#03C75A] text-white p-2 rounded-md"
        >
          네이버로 로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  setup() {
    const { dispatch } = useStore();

    const email = ref('');
    const password = ref('');
    const router = useRouter();
    onMounted(async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      if (urlParams.get('code')) {
        await dispatch('user/setIsLogin');
      }
    });

    function kakaoLogin() {
      Kakao.Auth.login({
        success: function (response) {
          Kakao.API.request({
            url: '/v2/user/me',
            success: function (response) {
              dispatch('user/setIsLogin');
              console.log(response);
            },
            fail: function (error) {
              console.log(error);
            },
          });
        },
        fail: function (error) {
          console.log(error);
        },
      });
    }

    const naverLogin = () => {
      const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=mu6mOx8I3hV1m1RGR9RT&redirect_uri=http://localhost:5173&state=1234`;

      console.log('==================url====================');
      console.log(url);

      const width = 500;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      window.location.href = url;

      //   window.open(
      //     url,
      //     'Naver Login',
      //     `width=${width},height=${height},left=${left},top=${top}`,
      //   );
    };

    return {
      email,
      password,

      kakaoLogin,
      naverLogin,
    };
  },
};
</script>
