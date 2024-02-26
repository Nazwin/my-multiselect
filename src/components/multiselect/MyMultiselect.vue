<script setup>
import {defineProps, defineModel, ref, computed, defineEmits, watch} from 'vue'
import PROPS from "@/components/multiselect/config/props"
import MultiselectOptions from "@/components/multiselect/components/MultiselectOptions.vue"

const props = defineProps(PROPS);

const emit = defineEmits(['change', 'search-change', 'select', 'deselect']);

const input = ref();

const searchQuery = ref('');

watch(searchQuery, (value) => {
  emit('search-change', value);
});

const showOptions = ref(false);

let model = defineModel({
  get: (value) => {
    if (!value) {
      return props.multiple ? [] : null;
    }
    return value;
  },
});

watch(model, (newVal, oldValue) => {
  if (!props.multiple) {
    emit('select', newVal);
    emit('deselect', oldValue);
  } else {
    if (oldValue === null) {
      oldValue = [];
    }
    if (newVal.length > oldValue.length) {
      emit('select', newVal[newVal.length - 1]);
    } else {
      emit('deselect', oldValue.filter(item => !newVal.includes(item)));
    }
  }
  emit('change', newVal);
});

const filteredItems = computed(() => {
  let filteredItems = [...props.items];

  if (props.hideSelected) {
    if (Array.isArray(filteredItems)) {
      if (typeof filteredItems[0] === 'object') {
        filteredItems = hideSelectedItemsArrayObjects(filteredItems);
      } else {
        filteredItems = hideSelectedItemsArray(filteredItems);
      }
    } else {
      filteredItems = hideSelectedItemsObject(filteredItems);
    }
  }

  if (!props.search) return filteredItems;

  if (!searchQuery.value) return filteredItems;

  if (Array.isArray(filteredItems)) {
    if (typeof filteredItems[0] === 'object') {
      return filteredItems.filter(item =>
          item[props.labelProp].toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    } else {
      return filteredItems.filter(item =>
          item.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
  } else {
    return Object.keys(filteredItems).reduce((acc, key) => {
      if (filteredItems[key].toLowerCase().includes(searchQuery.value.toLowerCase())) {
        acc[key] = filteredItems[key];
      }
      return acc;
    }, {});
  }
});

function hideSelectedItemsObject(items) {
  if (!props.hideSelected) return items;

  if (!props.multiple) {
    if (model.value) {
      const value = model.value[props.valueProp];

      delete items[value];
    }
  } else {
    if (model.value) {
      model.value.forEach(item => {
        delete items[item[props.valueProp]];
      });
    }
  }

  return items;
}

function hideSelectedItemsArray(items) {
  if (!props.hideSelected) return items;

  let filteredItems = [...items];

  if (!props.multiple) {
    filteredItems = filteredItems.filter(item => !item.toString().includes(model.value))
  } else {
    filteredItems = filteredItems.filter(item => !model.value.includes(item))
  }

  return filteredItems;
}

function hideSelectedItemsArrayObjects(items) {
  if (!props.hideSelected) return items;

  if (!props.multiple) {
    const currentIndex = items.findIndex(
        item => item[props.valueProp] === model.value
    );

    if (currentIndex !== -1) {
      items.splice(currentIndex, 1);
    }
  } else {
    if (model.value) {
      model.value.forEach(item => {
        const currentIndex = items.findIndex(
            modelItem => modelItem[props.valueProp] === item[props.valueProp]
        );

        if (currentIndex !== -1) {
          items.splice(currentIndex, 1);
        }
      });
    }
  }

  return items;
}

function getSelectedLabel(item) {
  if (typeof item === 'object') {
    return item[props.labelProp];
  }

  if (!props.object) {
    return props.items.find(i => i[props.valueProp] === item)[props.labelProp];
  }

  return item;
}

function deselect(index) {
  emit('deselect', model.value[index])
  model.value.splice(index, 1);
}

function toggleOptions() {
    if (props.disabled) return;
    showOptions.value = !showOptions.value;
    if (showOptions.value && props.search) {
        searchQuery.value = '';
        input.value.focus();
    }
}

</script>

<template>
    <div class="multiselect" :class="{active: showOptions, disabled: props.disabled}">
        <div class="multiselect__wrapper">
            <MultiselectOptions
                v-model="model"
                :multiple="props.multiple"
                :items="filteredItems"
                :labelProp="props.labelProp"
                :object="props.object"
                @close-options="showOptions = false"
                v-if="showOptions"
            />
            <div class="multiselect__selection m-selection">
              <div class="m-selection__wrapper">
                <div class="m-selection__body">
                  <div class="multiselect__overlay" @click="toggleOptions"></div>
                  <div class="multiselect__selected" v-if="model">
                    <div v-if="!props.multiple" class="multiselect__selected-item">
                      {{ getSelectedLabel(model) }}
                    </div>
                    <div v-else class="multiselect__selected-item"
                         :class="{'item-tag': props.tags}"
                         v-for="(item, index) of Array.isArray(model) ? model : [model]"
                         :key="index"
                    >
                      {{ getSelectedLabel(item) }}
                      <button class="m-selection__deselect" type="button" @click="deselect(index)">
                        <img src="assets/x.svg" alt="x">
                      </button>
                      <span v-show="!props.tags && index !== model.length - 1">,</span>
                    </div>
                  </div>
                  <label
                      class="multiselect__label"
                      :class="{'top': (!props.multiple && model) || (Array.isArray(model) && model.length)}"
                      for="multiselectLabel"
                  >
                    {{ props.label }}
                  </label>
                  <input
                      class="multiselect__input"
                      type="text"
                      id="multiselectLabel"
                      ref="input"
                      :disabled="!props.search"
                      :placeholder="showOptions ? props.placeholder : null"
                      :aria-hidden="!showOptions"
                      v-model="searchQuery"
                  >
                </div>
                <div class="m-selection__controls controls">
                  <div class="controls__deselect" v-if="!props.multiple && model">
                    <button type="button" @click="() => model = null">
                      <img src="assets/x.svg" alt="x">
                    </button>
                  </div>
                  <div class="controls__open" :class="{active: showOptions}">
                    <button type="button" @click="toggleOptions">
                      <img src="assets/caret-left.svg" alt="caret-left">
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<style>
button.m-selection__deselect {
  background: none;
  border: none;
  cursor: pointer;
}
.multiselect {
  width: 100%;
}
.multiselect.disabled {
  pointer-events: none;
  opacity: 0.8;
}
.multiselect__wrapper {
    position: relative;
}
.multiselect__selected {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}
.multiselect__selected-item.item-tag {
  background-color: #E3F4F4;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.m-selection__wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 12px;
  align-items: center;
  justify-content: space-between;
  border: solid 2px #E3F4F4;
  border-radius: 8px;
  background: #FFFFFF;
  transition: all .3s ease-out;
}
.m-selection__body {
  position: relative;
  padding: 12px 16px;
  display: flex;
}
.multiselect__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
}
.multiselect.active .multiselect__overlay {
  z-index: -1;
}
.multiselect__overlay.disabled {
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.025);
}
.multiselect__overlay:hover .m-selection__wrapper {
  border-color: #C4DFDF;
}
.multiselect__label {
  position: absolute;
  transition: all .3s ease-out;
}
.multiselect.active .multiselect__label, .multiselect__label.top {
  top: -8px;
  left: 16px;
  background: #FFFFFF;
  padding: 0 8px;
  color: #2C3E50;
  font-size: 12px;
}
.multiselect__input {
  width: 100%;
  border: none;
}
.multiselect__input:focus {
  outline: none;
}
.multiselect__input:disabled {
  background-color: transparent;
}
.triangle-left {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 12px solid #E3F4F4;
  transition: all .3s ease-out;
}
.multiselect.active .triangle-left {
  border-right-color: #C4DFDF;
  transform: rotate(-90deg);
}
.m-selection__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.m-selection__controls > div {
  height: inherit;
}
.m-selection__controls button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  height: inherit;
  transition: all .3s ease-out;
}
.m-selection__controls button:hover {
  background-color: #E3F4F4;
}
.controls__open.active button img {
  transition: all .3s ease-out;
}
.controls__open.active button img {
  transform: rotate(-90deg);
}
</style>