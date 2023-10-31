module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "MyVueApp", // 웹 앱 이름
    themeColor: "#4DBA87", // 웹 앱의 테마 색상 설정
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
  },
});
