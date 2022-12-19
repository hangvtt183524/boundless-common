<template>
  <div
      class="common-base-table"
      :class="{ 'default-pagination': useDefaultPagination }"
  >
   <v-layout row>
     <v-flex sm8 xs9 class="tool-bar">
       <modify-control
           v-if="showModify && !hideActions"
           :name="name"
           :associated="associated"
           :selected-items="selectedItems"
           @move="(value) => $emit('move', value)"
           @addTags="(value) => $emit('addTags', value)"
           @remove="$emit('remove')"
           @delete="$emit('delete')"
           :modify-list="modifyList"
           :isSelectedTotal="isSelectedTotal"
           :totalItems="totalItems"
       />

       <v-text-field
           class="search-input no-border"
           v-if="!hideSearch"
           :rules="rules"
           :maxlength="maxLength"
           :counter="maxLength"
           v-model="search"
           placeholder="Search"
           prepend-inner-icon="search"
           clearable
           solo
       />

       <div class="error-message" v-if="search && (search.length > maxLength)">
         Max {{maxLength}} characters
       </div>

       <div class="select-items-message" v-if="value.length && !hideItemCount">
         <span class="ml-4 selected-count">{{ selectedItemsCount }} Items selected</span>
         <a class="ml-4" v-if="showTotalSelect && !isSelectedTotal" @click="selectFullItem">
           Select all ({{totalItems}}) items
         </a>
         <a class="ml-4" v-if="isSelectedTotal" @click="clearSelection">
           Clear Selection
         </a>
       </div>
     </v-flex>

     <v-flex sm4 xs3 class="text-xs-right tool-bar-right" v-if="!hideItemCount">
       <div class="search-result mr-2" v-if="(totalItems > 0 || staticTableItems > 0) && !loading">
         {{searchResults}}
       </div>

       <download-control
           v-if="showDownload"
           :columns="isTree ? tableHeaders : downloadHeader"
           :tree-data="treeData"
           :selected-items="selectedTreeValues"
           :is-tree="isTree"
           @download="(value) => $emit('download', value)"
       />

       <v-btn class="btn-default"
              v-if="!useDefaultPagination && showPaginationButtons"
              @click="viewAll"
       >
         View All ({{ items.length }})
       </v-btn>
     </v-flex>
   </v-layout>

    <v-layout row fluid class="mt-2">
      <v-data-table
          class="table-container"
          ref="datatable"
          :headers="filteredHeaders"
          :items="items"
          :loading="loading"
          :select-all="selectAll"
          :value="selectedItems"
          :item-key="itemKey"
          @input="input"
          :pagination.sync="pagination"
          @update:pagination="updatePagination"
          sort-icon="arrow_upward"
          rows-per-page-text="Rows per page:"
          :total-items="totalItems"
          :rows-per-page-items="pageItems"
          :hide-actions="hidePagination"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate />
        <template slot="headers" slot-scope="props">
          <tr>
            <th v-if="selectAll && !hideActions">
              <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.native="toggleAll"
              />
            </th>

            <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '', header.value === 'actions' || header.value === 'reload' ? 'action-header' : '']"
                :style="`text-align:${header.align ? header.align : 'left'}`"
                @click="changeSort(header)"
            >
              <div v-if="!(header.value === 'icon' && (selectAll && !hideActions))">
                <span v-if="header.text == 'actions' || header.text == 'Reload'">
                  <column-selector
                      v-if="!hideColumnSelector && header.text == 'actions'"
                      :columns="tableHeaders"
                      :tree-data="treeData"
                      :tree-values="treeValues"
                      :is-tree="isTree"
                      @change="changeTreeValues"
                      @selectionChange="onColumnSelectionChange"
                  />

                  <div
                      slot="activator"
                      v-if="header.text == $t('general.reload')"
                      @click="reloadData"
                  >
                    <v-icon class="action-icon">refresh</v-icon>
                  </div>
                </span>

                <span v-else>{{ header.text }}</span>
                <v-icon class="ml-2" small v-if="header.sortable !== false">arrow_upward</v-icon>
              </div>
            </th>
          </tr>
        </template>

        <template slot='items' slot-scope='props'>
          <tr class="list-table-row"
              :class="{'clickable' : rowClickable}"
              @click="onRowClick(props.item, $event)"
          >
            <td v-if="selectable && !hideActions" style="width: 25px">
              <v-checkbox v-model="props.selected" @click.native="onChangeItem" />
            </td>

            <td class="px-3" slot="icon" v-if="subTable" :style="{'width': `${iconWidth}px`}">
              <v-icon small>{{ props.item.showChildren ? 'fas fa-chevron-down' : 'fas fa-chevron-right' }}</v-icon>
            </td>

            <td class="px-3" slot="icon" v-else-if="!hideIcon && !(selectable && !hideActions)" :style="{'width': `${iconWidth}px`}">
              <wifi-icon v-if="icon === 'wifi'" />
              <v-icon v-else small>{{ icon }}</v-icon>
            </td>

            <td class="px-4"
                v-for="(header, index) in filteredHeaders"
                :key="index"
                :class="tdClass(header)"
            >
              <div v-if="header.text && header.text !== 'actions'">
                <slot v-if="header.type === 'slot'" :name="header.slotName" :item="props.item" />
                <v-checkbox v-else-if="header.type === 'checkbox'" :input-value="getValue(props.item, header)" />
                <v-icon v-else-if="header.type === 'icon'" dark :color="header.color">
                  {{ getValue(props.item, header) }}
                </v-icon>
                <img
                    v-else-if="header.type === 'image'"
                    :src="getValue(props.item, header)"
                    :width="header.imageWidth"
                    style="vertical-align: top;"
                />

                <template v-else-if="header.type === 'json'">
                  <pre>| {{ getValue(props.item, header) }}</pre>
                </template>

                <template v-else>
                  | {{ getValue(props.item, header) }}
                </template>
              </div>
            </td>

            <td class="px-3 justify-end" v-if="!hideActions || !hideColumnSelector">
              <div class="list-table-actions">
                <v-menu v-if="!hideActions" left offset-y>
                  <v-btn class="divider-vert mx-0" slot="activator" icon>
                    <v-icon small color='grey'>more_horiz</v-icon>
                  </v-btn>

                  <div class="row-popover">
                    <div class="row-popover-arrow"></div>
                    <div class="row-popover-inner align-center">
                      <slot name="row-action" :item="props.item">
                        <v-tooltip bottom color="#9AA9C4" light>
                          <template v-slot:activator="{ on }">
                            <div class="row-popover-item" v-on="on">
                              <v-icon>add_circle_outline</v-icon>
                            </div>
                          </template>

                          <span>Add</span>
                        </v-tooltip>

                        <v-tooltip bottom color="#9AA9C4" light>
                          <template v-slot:activator="{ on }">
                            <div class="row-popover-item" v-on="on">
                              <v-icon>edit</v-icon>
                            </div>
                          </template>

                          <span>Edit</span>
                        </v-tooltip>

                        <v-tooltip bottom color="#9AA9C4" light>
                          <template v-slot:activator="{ on }">
                            <div class="row-popover-item" v-on="on">
                              <v-icon>folder_open</v-icon>
                            </div>
                          </template>

                          <span>New Group</span>
                        </v-tooltip>

                        <v-tooltip bottom color="#9AA9C4" light>
                          <template v-slot:activator="{ on }">
                            <div class="row-popover-item" v-on="on">
                              <v-icon>delete</v-icon>
                            </div>
                          </template>

                          <span>Delete</span>
                        </v-tooltip>
                      </slot>
                    </div>
                  </div>
                </v-menu>
              </div>
            </td>
          </tr>

          <tr class="list-table-row" v-if="subTable" v-show="props.item.showChildren">
            <td :colspan="filteredHeaders.length" style="padding: 0;">
              <base-table
                  :items="props.item[subTableField]"
                  :table-headers="subTableHeaders"
                  item-key="id"
                  :icon="subTableIcon"
                  hide-search
                  :loading="false"
                  :hide-actions="true"
                  hide-column-selector
                  hide-item-count
                  :hide-pagination="true"
                  hide-spinner
                  :row-clickable="true"
                  @rowClicked="onChildRowClick"
              />
            </td>
          </tr>
        </template>

        <template slot="no-data" class="text-xs-center">
          <div class="text-xs-center" v-if="!loading && !search"> | No data available</div>
          <v-alert slot='no-results' v-if="!loading && search" :value='true' color='error' icon='warning'>
            | {{ noSearchData }}
          </v-alert>
          <div class="text-xs-center" v-else>
            <v-progress-circular v-show="loading" color="blue" indeterminate />
          </div>
        </template>

        <v-alert slot='no-results' :value='true' color='error' icon='warning'>
          | {{ noSearchData }}
        </v-alert>
      </v-data-table>
    </v-layout>

    <v-layout
        class="table-spinner-container"
        row
        v-show="!hideSpinner && (loading || !useDefaultPagination)"
    >
      <v-flex xs12 class="text-xs-center table-spinner">
        <v-progress-circular v-show="loading && items.length" color="blue" indeterminate/>
        <v-btn class="btn-default"
               v-if="!hidePagination"
               v-show="showPaginationButtons && !loading",
               @click="viewNext"
        >
          View More ({{ currentRows }} of {{ items.length }})
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash'
import ModifyControl from "@/components/common/modify-control";
import DownloadControl from "@/components/common/download-control"
import ColumnSelector from "@/components/common/column-selector";
import WifiIcon from "@/components/icons/wifi"

export default {
  name: 'base-table',
  components: {
    ModifyControl,
    DownloadControl,
    ColumnSelector,
    WifiIcon
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    associated: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [Array],
      default: () => {
        return []
      }
    },
    items: {
      required: true,
      type: Array
    },
    tableHeaders: {
      required: true,
      type: Array
    },
    treeData: {
      required: false,
      type: Array
    },
    treeValues: {
      required: false,
      type: Array
    },
    isTree: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      required: true
    },
    loading: {
      required: false,
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'fas fa-image'
    },
    iconWidth: {
      type: Number,
      default: 50
    },
    rowClickable: {
      required: false,
      type: Boolean,
      default: false
    },
    hideIcon: {
      required: false,
      type: Boolean,
      default: false
    },
    hideActions: {
      required: false,
      type: Boolean,
      default: false
    },
    hideSearch: {
      required: false,
      type: Boolean,
      default: false
    },
    hideColumnSelector: {
      type: Boolean,
      default: false
    },
    hideItemCount: {
      type: Boolean,
      default: false
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    hideSpinner: {
      type: Boolean,
      default: false
    },
    useDefaultPagination: {
      type: Boolean,
      default: false
    },
    // Adds checkbox for selecting row
    selectable: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      default: () => {}
    },
    showModify: {
      required: false,
      type: Boolean,
      default: false
    },
    showDownload: {
      required: false,
      type: Boolean,
      default: false
    },
    totalItems: {
      type: Number,
      default: 0
    },
    searchText: {
      type: String,
      default: ''
    },
    isSelectedTotal: {
      type: Boolean,
      default: false
    },
    tablePagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    modifyList: {
      type: Array,
      default () {
        return []
      }
    },
    subTable: {
      required: false,
      type: Boolean,
      default: false
    },
    subTableField: {
      required: false,
      type: String,
      default: ''
    },
    subTableHeaders: {
      required: false,
      type: Array
    },
    subTableIcon: {
      required: false,
      type: String
    }
  },
  data () {
    return {
      search: '',
      currentRows: 20,
      maxLength: 64,
      pagination: {
        page: 1,
        descending: false,
        rowsPerPage: 20
      },
      showTotalSelect: false,
      pageItems: [5, 10, 20, 50, 100, 200],
      staticTableItems: 0,
      selectedTreeValues: this.treeValues
    }
  },
  beforeMount () {
    this.pagination = {
      ...this.pagination,
      ...this.tablePagination
    }
  },
  methods: {
    changeTreeValues (values) {
      this.tableHeaders.map(header => {
        if (header.parentId) {
          const treeId = values.find(value => header.treeId === value)
          header.selected = treeId !== undefined
        }
        return header
      })
      this.selectedTreeValues = values
    },
    onColumnSelectionChange () {
      this.$emit('columnSelectionChange')
    },
    getSortField (name) {
      const headerItem = this.tableHeaders.find(item => item.value === name)
      if (headerItem.custom_sort_field) {
        return headerItem.custom_sort_field
      }
      return headerItem.value
    },
    getValue (item, header) {
      let value = null
      if (item.hasOwnProperty(header.value)) {
        value = item[header.value]
      } else {
        value = item
        for (let key of header.value.split('.')) {
          value = value[key]
        }
      }
      if (!value && header.defaultValue) {
        value = header.defaultValue
      }
      if (header.formatter) {
        return header.formatter(value, item, header)
      } else {
        return value
      }
    },
    viewAll () {
      let datatable = this.$refs.datatable
      datatable.updatePagination({
        page: 1,
        rowsPerPage: -1
      })

      this.currentRows = this.items.length
    },
    viewNext () {
      let datatable = this.$refs.datatable
      const rowsPerPage = datatable.computedPagination.rowsPerPage

      this.currentRows += 10
      datatable.updatePagination({
        page: 1,
        rowsPerPage: rowsPerPage + 10
      })
    },
    setCurrentRows () {
      if (this.currentRows > this.items.length) {
        this.currentRows = this.items.length
      }
    },
    onRowClick (item, e) {
      if (this.rowClickable) {
        if (!e.target.closest('.list-table-actions') && !e.target.closest('.v-input--checkbox') && !e.target.closest('.column-link')) {
          this.$emit('rowClicked', item)
        }
      }
    },
    input (value) {
      this.$emit('input', value)
    },

    tdClass (header) {
      return {
        'text-xs-right': header.align === 'right',
        'text-xs-center': header.align === 'center'
      }
    },
    toggleAll (event) {
      if (this.value.length === this.items.length) {
        this.showTotalSelect = false
        this.$emit('onChange', [])
        this.$emit('onSelectAll', false)
      } else {
        if (this.items.length < this.totalItems) {
          this.showTotalSelect = true
        }
        this.$emit('onChange', this.items)
      }
    },
    updatePagination (pagination) {
      this.staticTableItems = pagination.totalItems
      if (
          pagination.descending !== this.tablePagination.descending ||
          pagination.page !== this.tablePagination.page ||
          pagination.ordering !== this.tablePagination.ordering ||
          pagination.rowsPerPage !== this.tablePagination.rowsPerPage) {
        if (pagination.sortBy) {
          pagination.ordering = this.getSortField(pagination.sortBy)
        }
        this.$emit('fetchData', pagination)
      }
    },
    selectFullItem () {
      this.$emit('onSelectAll', true)
    },
    clearSelection () {
      this.showTotalSelect = false
      this.$emit('onSelectAll', false)
      this.$emit('onChange', [])
    },
    onChangeItem () {
      this.showTotalSelect = false
      this.$emit('onSelectAll', false)
    },
    changeSort (header) {
      if (header.sortable !== false) {
        let pagination = {}
        if (this.pagination.sortBy === header.value) {
          pagination = {
            ...this.pagination,
            descending: !this.pagination.descending
          }
        } else {
          pagination = {
            ...this.pagination,
            sortBy: header.value,
            descending: false,
            ordering: this.getSortField(header.value)
          }
        }
        this.pagination = pagination
        this.$emit('fetchData', pagination)

        this.$emit('sortChange', pagination)
      }
    },
    reloadData () {
      this.$emit('reloadData')
    },
    onChildRowClick (item) {
      this.$emit('childRowClicked', item)
    }
  },
  watch: {
    items (v) {
      this.setCurrentRows()
    },
    searchText (v) {
      this.search = v
    },
    search: {
      handler: _.debounce(function (val) {
        this.$emit('onSearch', val)
      }, 200),
      deep: true
    }
  },
  computed: {
    filteredHeaders () {
      return this.tableHeaders.filter((header) => {
        return header.selected === true
      })
    },
    downloadHeader () {
      return this.tableHeaders.filter((header) => {
        return header.selected || !header.selected
      })
    },
    showPaginationButtons () {
      return (this.currentRows < this.items.length)
    },
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || `Max ${this.maxLength} characters`
      }
      return [maxRule]
    },
    noSearchData () {
      return `Your search for ${this.search || ''} found no results`
    },
    selectedItemsCount () {
      if (this.isSelectedTotal) {
        return `All ${this.totalItems}`
      } else {
        return this.value.length
      }
    },
    searchResults () {
      const totalCount = this.totalItems || this.staticTableItems
      let result = `${totalCount} result`
      if (totalCount > 1) {
        result = `${result}s`
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.selected-count {
  color: #9ba9c4;
}
.select-items-message {
  font-size: 14px;
}
.search-result {
  color: #9ba9c4;
  font-size: 18px;
}
.page-content {
  .common-base-table {
    margin-right: 30px;
    .search-input {
      width: 300px !important;
      max-width: 300px !important;
    }
  }
}
.error-message {
  margin-left: 10px;
  color: #ec5f59
}
.table-container {
  width: 100%;
  overflow-x: auto;
  @media (max-width: 767px) {
    .v-datatable__actions {
      flex-wrap: unset;
      &__select {
        margin-left: 20px;
        justify-content: flex-start;
      }
      &__pagination {
        margin: 0;
        width: 100px;
      }
      .v-select {
        margin-left: 15px !important;
      }
      .v-btn:last-of-type {
        margin: 0;
      }
    }
  }
}
.s-icon {
  width: 15px;
  height: 15px;
  margin-left: 5px;
}
.tool-bar {
  display: flex !important;
  align-items: center !important;
}
.tool-bar-right {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
}

.action-header {
  padding-left: 5px !important;
  padding-right: 5px !important;
  width: 30px;
  div {
    padding-top: 1px;
  }
}
.default-pagination {
  position: relative;
  .table-spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    .table-spinner {
      justify-content: center;
      align-items: center;
      display: flex;
      background: #FFF;
      opacity: .4;
    }
  }
}
</style>