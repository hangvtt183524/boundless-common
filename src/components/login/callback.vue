<template>
  <div>
    <activity-indicator :show="true">
      <div id="social-user-hidden-form-wrapper"></div>
    </activity-indicator>
  </div>
</template>

<script>
import ActivityIndicator from "@/components/common/activity-indicator";

export default {
  name: 'Callback',
  components: {
    ActivityIndicator
  },
}
</script>