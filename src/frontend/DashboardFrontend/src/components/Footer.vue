<template>
  <footer class="footer">
    <a href="https://t.me/yourtelegram" target="_blank">Telegram</a>
    <a href="https://github.com/yourgithub" target="_blank">GitHub</a>
    <p>Your rights are reserved</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #333;
  color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
}
a {
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
}
a:hover {
  text-decoration: underline;
}
p {
  margin: 0;
}
</style> 