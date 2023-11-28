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
import useUserStore from '../stores/user';

export default {
  setup() {
    const { getUser: user, setIsLogin } = useUserStore();

    const email = ref('');
    const password = ref('');
    onMounted(async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      if (urlParams.get('code')) {
        setIsLogin('naver');
        if (user.isLogin) {
          window.location.href = '/';
        }
      }
    });

    function kakaoLogin() {
      Kakao.Auth.login({
        success: function (response) {
          Kakao.API.request({
            url: '/v2/user/me',
            success: function (response) {
              setIsLogin('kakao');
              if (user.isLogin) {
                window.location.href = '/';
              }
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
      const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=mu6mOx8I3hV1m1RGR9RT&redirect_uri=http://localhost:5173/login&state=1234`;
      window.location.href = url;
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
