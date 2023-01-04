<template>
  <v-list
      class="left-toolbar-workspace-menu"
      data-test="user-menu-list-1"
      @click.native="stopPropagation"
  >
    <v-list-tile class="menu-description">
      <v-list-tile-content>
        <v-list-tile-title>{{ selectedWorkspace.name }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <div class="search-container">

    </div>

    <perfect-scrollbar class="workspace-selector__scroll-holder">
      <v-list-tile
          v-for="workspace of filteredWorkspaces"
          :key="workspace.id"
          :class="{'menu-item--active': selectedWorkspace.id === workspace.id}"
          @click="onMenuItemClick(workspace)"
          data-test="item-org-settings-general"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ workspace.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </perfect-scrollbar>
  </v-list>
</template>

<script>
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import matchSorter from 'match-sorter'

export default {
  name: 'workspace-selector',
  mixins: [NodeSelectionsMixin],
  data () {
    return {
      search: ''
    }
  },
  computed: {
    filteredWorkspaces () {
      // return matchSorter(this.userWorkspaces, this.search.toLowerCase(), { keys: ['name'] })
      return this.userWorkspaces
    }
  },
  methods: {
    stopPropagation (event) {
      event.stopPropagation()
    },
    onMenuItemClick (workspace) {
      if (workspace.id !== this.workspaceId) {
        this.selectWorkspace(workspace)
        // EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_CHANGED)
      }

      this.redirectToNode(workspace)
      this.search = ''
    }
  }
}
</script>

<style lang="scss">
@import "styles/v2/colors.scss";

.left-toolbar-workspace-menu {
  width: 265px !important;

  .search-container {
    margin: 5px 0;

    .base-text-input {
      input {
        background: $blue-light;
        color: $white;

        border: none;
        padding: 9px 54px 9px 31px;
        border-radius: 0;

        &::placeholder {
          color: $white !important;
        }

        &:focus {
          border-color: $green-light;
        }
      }

      .v-icon {
        opacity: 1;
        right: 34px !important;
        color: $white;
      }
    }
  }

  .workspace-selector__scroll-holder {
    height: 180px;
    overflow: hidden;
  }
}
</style>