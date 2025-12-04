<script setup lang="ts">
import DemoEditor from './demo/DemoEditor.vue'
</script>

<template>
  <div class="VPHomeDemo">
    <div class="wrapper">
      <div class="container">
        <div class="block">
          <header class="demo-header">
            <div class="demo-badge">
              <span class="badge-icon">🎮</span>
              <span class="badge-text">Interactive</span>
            </div>
            <h2 id="demo" class="demo-title">
              Try It Yourself
            </h2>
            <p class="demo-description">
              Experience VueQuill's features in action. Switch themes, customize toolbars, 
              and see the output in real-time.
            </p>
          </header>
          <ClientOnly>
            <DemoEditor />
          </ClientOnly>
          <footer class="demo-footer">
            <div class="footer-links">
              <a href="/guide/" class="footer-link primary">
                <span class="link-icon">📚</span>
                <span class="link-text">Read the docs</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <a href="https://github.com/vueup/vue-quill" target="_blank" class="footer-link secondary">
                <span class="link-icon">⭐</span>
                <span class="link-text">Star on GitHub</span>
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPHomeDemo {
  margin-top: 112px;
  margin-bottom: -128px;
  border-top: 1px solid var(--vp-c-divider);
  padding: 64px 24px 96px;
  background: linear-gradient(180deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
}

.container {
  margin: 0 auto;
  max-width: 1200px;
}

.block {
  padding: 0;
}

/* Header Styles */
.demo-header {
  text-align: center;
  margin-bottom: 32px;
}

.demo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 16px;
}

.badge-icon {
  font-size: 14px;
}

.demo-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
  border: none !important;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .demo-title {
    font-size: 40px;
  }
}

.demo-description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .demo-description {
    font-size: 18px;
  }
}

/* Footer Styles */
.demo-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

@media (min-width: 480px) {
  .footer-links {
    flex-direction: row;
    justify-content: center;
  }
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-link.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.footer-link.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.footer-link.secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.footer-link.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.link-icon {
  font-size: 16px;
}

.link-text {
  white-space: nowrap;
}
</style>
