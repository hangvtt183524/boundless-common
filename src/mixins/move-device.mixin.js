import NodeSelect from "@/components/common/node-select";

import ManageableNodesMixin from "@/mixins/manageable-nodes.mixin";

let MoveDeviceMixin = {
    components: {
        NodeSelect
    },
    mixins: [
        ManageableNodesMixin
    ],
    data () {
        return {
            targetNode: null,
            loading: false
        }
    },
    methods: {
        getName (itemsLength) {
            if (itemsLength > 1) {
                return `${this.name}s`
            }
            return this.name
        }
    },
    computed: {
        moveDialogHeading () {
            if (this.selectedItems.length) {
                if (this.isSelectedTotal) {
                    return `Move all ${this.totalItems} ${this.getName(this.totalItems)} to`
                } else {
                    let message = `Move ${this.selectedItems[0].name} to`

                    if (this.selectedItems.length > 1) {
                        message = `"Move ${this.selectedItems.length} ${this.getName(this.selectedItems.length)} to`
                    }
                    return message
                }
            }
        },
        nodesWithGroupsDisabled () {
            const nodeTypes = ['organization', 'group', 'site']
            return this.getNodesByType(nodeTypes).map(node => {
                if (node.type === 'group') {
                    node.disabled = true
                }
                return node
            })
        },
        removeDialogHeading () {
            if (this.selectedItems.length) {
                if (this.isSelectedTotal) {
                    return `Remove all ${this.totalItems} ${this.getName(this.totalItems)} from venues`
                } else {
                    let message = `Remove ${this.selectedItems[0].name} from venues`
                    if (this.selectedItems.length > 1) {
                        message = `Remove ${this.selectedItems.length} ${this.getName(this.selectedItems.length)} from venues`
                    }
                    return message
                }
            }
        },
        associatedItems () {
            return this.selectedItems.filter(item =>
                (typeof item[this.associated.value] === 'string' && item[this.associated.value]) ||
                (typeof item[this.associated.value] === 'object' && !global._.isEmpty(item[this.associated.value]))
            )
        },
        isAssociated () {
            if (
                this.associated &&
                this.associated.value &&
                this.associatedItems.length) {
                return true
            }
            return false
        },
        deleteDialogHeading () {
            if (this.selectedItems.length) {
                if (this.isSelectedTotal) {
                    return `Delete all ${this.totalItems} ${this.getName(this.totalItems)} from workspace`
                } else {
                    let message = ''
                    if (this.isAssociated) {
                        message = `${this.selectedItems[0].name} is still associated with a ${this.associatedItems.length === 1 ? this.associated.name : this.associated.name}s`
                        if (this.selectedItems.length > 1) {
                            message = `${this.selectedItems.length} ${this.getName(this.selectedItems.length)} are still associated with ${this.associatedItems.length === 1 ? 'a' : this.associatedItems.length} ${this.associatedItems.length === 1 ? this.associated.name : this.associated.name}s`
                        }
                    } else {
                        message = `Delete ${this.selectedItems[0].name} from workspace`

                        if (this.selectedItems.length > 1) {
                            message = `Delete ${this.selectedItems.length} ${this.getName(this.selectedItems.length)} from workspace`
                        }
                    }

                    return message
                }
            }
        },
        addTagsDialogHeading () {
            if (this.selectedItems.length) {
                if (this.isSelectedTotal) {
                    return `Add tags to all ${this.totalItems} ${this.getName(this.totalItems)}`
                } else {
                    let message = `Add tags to ${this.selectedItems[0].name}`
                    if (this.selectedItems.length > 1) {
                        message = `Add tags to ${this.selectedItems.length} ${this.getName(this.selectedItems.length)}`
                    }
                    return message
                }
            }
        },
    }
}

export default MoveDeviceMixin