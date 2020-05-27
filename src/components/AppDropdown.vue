<template>
  <b-navbar>
    <b-navbar-nav v-if="options" class="ml-auto">
      <div class="custom" :tabindex="tabindex" @blur="open = false">
        <div
          class="selected"
          :class="{open: open}"
          @click="open = !open"
        >{{ options.preselected_contract_length }}</div>
        <div class="items" :class="{selectHide: !open}">
          <div
            class="item"
            v-for="(option, i) of options.contract_length_options"
            :key="i"
            @click="options.preselected_contract_length = option; open = false; getCategory(); $emit('input', option)"
          >{{ option }}</div>
        </div>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      open: false,
      selected: ""
    };
  },
  mounted() {
    /* emiting selected value and passing it to parent component */
    this.$parent.$emit("input", this.options.preselected_contract_length);
  },
  methods: {
    getCategory() {
      /* setting a default value in dropdown list */
      this.selected = this.options.preselected_contract_length;
    }
  }
};
</script>

<style lang="scss" scoped>
.custom {
  position: relative;
  width: 200px;
  text-align: left;
  outline: none;
  height: 47px;
  line-height: 47px;

  .selected {
    background-color: #f8f4ec;
    border-radius: 6px;
    color: #494949;
    padding-left: 8px;
    cursor: pointer;
    user-select: none;

    &:after {
      position: absolute;
      content: "";
      top: 22px;
      right: 10px;
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-color: #494949 transparent transparent transparent;
    }
  }

  .selected.open {
    border-radius: 6px 6px 0px 0px;
    z-index: 1000;
  }

  .items {
    border-top: 1px solid #ffffff;
    color: #494949;
    border-radius: 0px 0px 6px 6px;
    overflow: hidden;
    position: absolute;
    background-color: #f8f4ec;
    left: 0;
    right: 0;
    z-index: 1000;

    .item {
      color: #494949;
      padding-left: 8px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #742d6c;
        color: #ffffff;
      }
    }
  }

  .selectHide {
    display: none;
  }
}
</style>