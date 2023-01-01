<template>
  <base-dialog :show="show" @close="$emit('close')">
    <v-layout row>
      <v-flex xs12>
        <h2 class="dialog-heading mb-1">
          Warning
        </h2>

        <h4 class="dialog-subtitle mt-3 red--text">
          {{ warningPanel.message }}
        </h4>
      </v-flex>
    </v-layout>
  </base-dialog>
</template>

<script>
import BaseDialog from "@/components/common/base-dialog";
import {mapGetters} from "vuex";

export default {
  name: 'warning-dialog',
  components: {
    BaseDialog
  },
  props: ['show'],
  computed: {
    ...mapGetters(['warningPanel'])
  }
}
</script>
