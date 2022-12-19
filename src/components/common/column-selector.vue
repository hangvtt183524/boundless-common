<template>
  <v-menu
      class="column-menu"
      :close-on-content-click="false"
      v-model="menu"
      offset-y
      :nudge-bottom="10"
  >
    <span slot="activator">
      <v-icon class="action-icon">settings</v-icon>
    </span>

    <v-card class="column-menu-dropdown">
      <h3>Check the columns to appear in the table</h3>
      <v-layout row wrap v-if="!isTree">
        <v-flex class="mb-1" sm6
                v-for="column in columns"
                :key="column.value"
        >
          <v-checkbox
              v-if="column.text && column.text !== 'actions' && column.text !== 'Reload'"
              :label="column.text"
              v-model="column.selected"
              hide-details
              @change="onColumnChange"
          />
        </v-flex>
      </v-layout>

      <v-layout row wrap v-else>
        <v-treeview
            :items="treeData"
            multiple-active
            selectable
            v-model="values"
        />
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ['columns', 'isTree', 'treeData', 'treeValues'],
  data () {
    return {
      menu: false,
      values: []
    }
  },
  watch: {
    values (v, oldValue) {
      this.$emit('change', v)
    },
    treeValues (v, oldValue) {
      this.values = v
    }
  },
  methods: {
    onColumnChange () {
      this.$emit('selectionChange')
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
.action-icon {
  opacity: 1!important;
}
.column-menu {
  font-family: 'Fira Sans', sans-serif;

  .organization-heading {
    font-size: 30px;
  }

  .caret-icon {
    margin-left: 10px;
  }

  .v-menu__content {
    box-shadow: none !important;
  }

}

.v-flex {
  display: flex;
}

.column-menu-dropdown {
  padding: 30px 60px;
  box-shadow: none !important;
  border: 1px solid $light-gray !important;
  width: 500px !important;

  h3 {
    font-family: 'Fira Sans', sans-serif;
    color: $black;
    margin-bottom: 25px;
    font-size: 15px;
  }
}
</style>