<script setup>
import {defineProps, defineEmits, onUnmounted, onMounted, defineModel, computed} from 'vue'

const props = defineProps({
    items: {
      type: [Array, Object],
      required: true
    },
    labelProp: {
      type: String,
      default: 'label'
    },
    valueProp: {
      type: String,
      default: 'id'
    },
    multiple: {
        type: Boolean,
        default: true
    },
    object: {
      type: Boolean,
      default: true
    }
})

const model = defineModel();

const emit = defineEmits(['closeOptions']);

function getOptionValue(item, index) {
  if(!Array.isArray(props.items)) {
    return index;
  }

  return !props.object && item[props.valueProp] ? item[props.valueProp] : item;
}

const showNoOptions = computed(() => {
  return (Array.isArray(props.items) && props.items.length === 0) || (props.items && Object.keys(props.items).length === 0);
});

function outClick(event) {
    if (!event.target.closest('.multiselect')) {
        emit('closeOptions');
    }
}

onMounted(() => {
    document.addEventListener('click', outClick)
})

onUnmounted(() => {
    document.removeEventListener('click', outClick)
})
</script>

<template>
  <div class="multiselect__options m-options">
    <div class="m-options__wrapper">
      <div class="m-options__items">
        <div v-if="showNoOptions" class="m-options__item item">
          <p style="text-align: center;">There are no options</p>
        </div>
        <div class="m-options__item item" v-for="(item, index) of props.items" :key="item">
          <label :for="'itemLabel' + index"></label>
          <input
              v-if="multiple"
              type="checkbox"
              name="multiple_options"
              :id="'itemLabel' + index"
              :value="getOptionValue(item, index)"
              v-model="model"
          >
          <input
              v-else
              type="radio"
              name="single_option"
              :id="'itemLabel' + index"
              :value="getOptionValue(item, index)"
              v-model="model"
          >
          <span>{{ item[props.labelProp] ?? item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.multiselect__options {
  position: absolute;
  top: 100%;
  background-color: white;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(46,38,61,.2),0 0 transparent,0 0 transparent;
  z-index: 100;
}
.m-options__wrapper {
  max-height: 300px;
  overflow: auto;
}
.m-options__item {
  position: relative;
  padding: 12px 16px;
  transition: all .2s ease-out;
}
.m-options__item:hover {
  background-color: #E3F4F4;
}
.m-options__item label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}
.m-options__item input {
  margin-right: 10px;
}
</style>