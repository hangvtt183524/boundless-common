<template>
  <base-dialog :show="show" max-width='700px' @close="$emit('close')">
    <h2 class="dialog-heading mb-3">{{ dialogHeading }}</h2>

    <h4 class="dialog-subtitle">{{ message }}</h4>

    <div class="text-xs-right mt-5">
      <v-btn @click.native="$emit('close')" round large>
        Close
      </v-btn>
    </div>
  </base-dialog>
</template>

<script>
import BaseDialog from "@/components/common/base-dialog";

export default {
  name: 'DeleteGroupModal',
  components: {
    BaseDialog
  },
  props: ['show', 'message', 'name'],
  computed: {
    dialogHeading () {
      if (this.name) {
        let deleteMessage = `Delete "${this.name}"`
        return deleteMessage
      }

      return 'Delete Item'
    }
  }
}
</script>