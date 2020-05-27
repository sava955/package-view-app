<template>
  <div class="container">
    <AppDropdown :options="categories" @input="findCategory($event)" />
    <div class="row">
      <div class="col-md-4" v-for="(item, i) of items" :key="i">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">{{item.name}}</h2>
          </div>
          <hr />
          <div class="card-body">
            <div class="d-flex">
              <div class="media-img"></div>
              <div
                class="media-content"
                v-if="item.prices"
              >{{item.prices.price_recurring[priceValue]}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "PageHome",
  data() {
    return {
      categories: {},
      items: [],
      priceValue: ""
    };
  },
  created() {
    /* calling a get method to fetch data from API using axios */
    axios.get("http://www.mocky.io/v2/5e8465c23000008400cf4395").then(res => {
      /* reversing categories */
      res.data.contract_length.contract_length_options.reverse();
      this.categories = res.data.contract_length;
      this.items = res.data.items;
      /* setting a deafult value for dropdown list */
      this.priceValue = this.categories.preselected_contract_length;
    });
  },
  methods: {
    /* passing selected value from dropdown list */
    findCategory(event) {
      /* setting a price value for diferent package categoires */
      this.priceValue = event;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .row {
    .col-md-4 {
      .card {
        background-color: #f8f4ec;
        border-radius: 10px;
        padding: 20px;

        .card-title {
          color: #742d6c;
          font-size: 48px;
          font-style: italic;
        }
      }

      .card-body {
        .d-flex {
          display: flex;

          .media-img {
            background: #742d6c;
            border-radius: 50%;
            height: 20px;
            width: 20px;
          }
        }
      }
    }
  }
}
</style>