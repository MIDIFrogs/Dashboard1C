<template>
  <footer class="footer">
    <a href="https://t.me/jojer_m" target="_blank">TG</a>
    <span>|</span>
    <a href="https://github.com/MIDIFrogs" target="_blank">GIT</a>
    <span>|</span>
    <span class="copyright">© 2025</span>
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
  align-items: center;
  gap: 12px;
}

a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
}

a:hover {
  color: var(--primary-color);
}

span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.copyright {
  color: var(--text-secondary);
}
</style> 