const PROPS ={
    items: {
        type: [Object, Array],
        default: () => {
            return {}
        }
    },
    multiple: {
        type: Boolean,
        default: true
    },
    tags: {
        type: Boolean,
        default: true,
    },
    object: {
        type: Boolean,
        default: true
    },
    labelProp: {
        type: String,
        default: "label"
    },
    valueProp: {
        type: String,
        default: "id"
    },
    search: {
        type: Boolean,
        default: false
    },
    searchBy: {
        type: String,
        default: "label"
    },
    hideSelected: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    default: {
        type: Array,
        default: () => []
    },
    label: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: null
    }
}

export default PROPS;