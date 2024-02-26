<template>
  <div style="display: flex; flex-direction: column; gap: 25px;">
    <div class="custom-card p-3"
         style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 250px;"
    >
      <MyMultiselect
          v-model="selected"
          :items="items"
          :object="object"
          :labelProp="labelProp"
          :valueProp="valueProp"
          :placeholder="placeholder"
          :label="label"
          :search="search"
          :multiple="multiple"
          :tags="tags"
          :hideSelected="hideSelected"
          :disabled="disabled"
          @search-change="searchChange"
          @change="multiselectChange"
          @select="select"
          @deselect="deselect"
      />
    </div>
    <div style="display: flex; gap: 20px;">
      <div>
        <h1>Settings</h1>
        <div>
          <div class="mb-3">
            <label for="label" class="form-label">Label</label>
            <input class="form-control" type="text" id="label" v-model="label">
          </div>
          <div class="mb-3">
            <label for="placeholder" class="form-label">Placeholder</label>
            <input class="form-control" type="text" id="placeholder" v-model="placeholder">
          </div>
          <div class="mb-3">
            <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
              <input type="checkbox" class="btn-check" id="multiple" autocomplete="off" v-model="multiple">
              <label class="btn btn-outline-primary" for="multiple">Multiple</label>

              <input type="checkbox" class="btn-check" id="tags" autocomplete="off" v-model="tags" :disabled="!multiple">
              <label class="btn btn-outline-primary" for="tags">Tags</label>

              <input type="checkbox" class="btn-check" id="search" autocomplete="off" v-model="search">
              <label class="btn btn-outline-primary" for="search">Search</label>

              <input type="checkbox" class="btn-check" id="object" autocomplete="off" v-model="object">
              <label class="btn btn-outline-primary" for="object">Object</label>

              <input type="checkbox" class="btn-check" id="hideSelected" autocomplete="off" v-model="hideSelected">
              <label class="btn btn-outline-primary" for="hideSelected">Hide selected</label>

              <input type="checkbox" class="btn-check" id="disabled" autocomplete="off" v-model="disabled">
              <label class="btn btn-outline-primary" for="disabled">Disabled</label>
            </div>
          </div>
          <div class="mb-3">
            <label for="labelProp" class="form-label">Label prop</label>
            <input class="form-control" type="text" id="labelProp" v-model="labelProp">
          </div>
          <div class="mb-3">
            <label for="valueProp" class="form-label">Value prop</label>
            <input class="form-control" type="text" id="valueProp" v-model="valueProp">
          </div>
        </div>
      </div>
      <div>
        <h1>Items</h1>
        <div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="array" v-model="itemsType">
            <label class="form-check-label" for="flexRadioDefault1">
              Array
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="arrayObjects" v-model="itemsType">
            <label class="form-check-label" for="flexRadioDefault2">
              Array of objects
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" value="object" v-model="itemsType">
            <label class="form-check-label" for="flexRadioDefault3">
              Object
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" value="default" v-model="itemsType">
            <label class="form-check-label" for="flexRadioDefault4">
              Default
            </label>
          </div>
        </div>
        <div style="max-height: 300px; overflow: auto;">
          <pre>{{ items }}</pre>
        </div>
      </div>
      <div>
        <h1>Selected</h1>
        <div style="max-height: 300px; overflow: auto;">
          <pre>{{ selected }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import MyMultiselect from './components/multiselect/MyMultiselect.vue';
import {ITEMS} from "@/components/multiselect/config/test";

export default {
  name: 'App',
  components: {
    MyMultiselect
  },
  setup() {
    const itemsType = ref('arrayObjects');

    const items = computed(() => {
      return ITEMS[itemsType.value];
    });

    const selected = ref(null);

    watch(() => itemsType.value, (value) => {
      selected.value = [];

      return value;
    });

    const placeholder = ref('Select an option');

    const label = ref('Multiselect label');

    const search = ref(true);

    const multiple = ref(false);

    const tags = ref(false);

    const object = ref(true);

    const labelProp = ref('name');

    const valueProp = ref('id');

    const hideSelected = ref(true);

    const disabled = ref(false);

    watch(() => multiple.value, (value) => {
      if (!value) {
        tags.value = false;
      }
    }, {deep: true})

    return {items, selected, placeholder, label, search, multiple, tags, labelProp, valueProp, object, itemsType, hideSelected, disabled}
  },
  methods: {
    searchChange(value) {
      console.log('searchChange', value);
    },
    multiselectChange(value) {
      console.log('multiselectChange', value);
    },
    select(value) {
      console.log('select', value);
    },
    deselect(value) {
      console.log('deselect', value);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #F8F6F4;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
