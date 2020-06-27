<template>
  <p>
    <span v-if="label">{{ label }}</span>
    <code>{{ endpoint }}</code>
    <a target="_blank" rel="noopener noreferrer" :href="endpoint" v-if="tryBtn">
      Try
      <OutboundLink />
    </a>
    <a @click="copyToClipboard(endpoint)" v-if="copyBtn" class="copy">Copy</a>
  </p>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    endpoint: {
      type: String,
      required: true
    },
    tryBtn: {
      type: Boolean,
      default: true
    },
    copyBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    copyToClipboard(str) {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  }
};
</script>

<style scoped>
.button {
  font-size: 1em;
  color: green;
}

a {
  display: inline-block;
  cursor: pointer;
  color: #fff;
  background-color: #1e88e5;
  padding: 0.2em 0.7em;
  border-radius: 5px;
  font-size: 0.8em;
  opacity: 0.8;
  transition: opacity 100ms linear;
}

a:hover {
  text-decoration: none !important;
  opacity: 1;
}

.copy {
  background-color: #3f51b5;
}

.copy1 {
  background-color: #4caf50;
}
</style>
