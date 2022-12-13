<template>
  <div>
    <login />
    <reset-password-dialog :show="showResetPasswordDialog" @close="showResetPasswordDialog = false" />
  </div>
</template>

<script>
import Login from './login'
import ResetPasswordDialog from "@/components/login/reset-password-dialog";

export default {
  name: 'ResetPassword',
  components: {
    Login,
    ResetPasswordDialog
  },
  data () {
    return {
      showResetPasswordDialog: true
    }
  }
}
</script>