<template>
  <p>
    <code>{{endpoint}}</code>
    <a
      target="_blank"
      rel="noopener noreferrer"
      :href="$themeConfig.liveServer + endpoint"
    >{{ text }}</a>
    <OutboundLink />
  </p>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: "Try-It"
    }
  }
};
</script>

<style scoped>
.button {
  font-size: 1em;
  color: green;
}
</style>