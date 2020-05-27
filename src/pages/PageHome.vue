<template>
  <div class="container">
    <AppDropdown :options="categories" @input="findCategory($event)" />
    <div class="row">
      <div class="col-md-4" v-for="(item, i) of items" :key="i">
        <div class="card">
          <div class="card-header">
            <div class="is-featured" v-if="item.is_featured == 1">
              {{item.is_featured}}
            </div>
            <h2 class="card-title">{{item.name}}</h2>
          </div>
          <div class="card-body">
            <div class="d-flex included">
              <div v-if="assets" class="category-img align-self-center">
                <img :src="assets.net_category" alt="net_category" />
              </div>
              <div class="included-list flex-grow-1">
                <ul>
                  <li
                    v-for="(inc, y) of item.included"
                    :key="y"
                    class="list-item text-left"
                    :class="{listItemHide: inc.product_category == 'net'}"
                  >
                    <span v-if="inc.product_category == 'tv'">{{inc.long_name}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <hr />
            <div class="d-flex included justify-content-center">
              <div v-if="assets" class="category-img">
                <img :src="assets.tv_category" alt="tv_category" />
              </div>
              <div class="included-list flex-grow-1">
                <ul>
                  <li
                    v-for="(inc, y) of item.included"
                    :key="y"
                    class="list-item text-left"
                    :class="{listItemHide: inc.product_category == 'tv'}"
                  >{{inc.product_category == 'net' ? inc.long_name : ''}}</li>
                </ul>
              </div>
            </div>
            <div class="prices d-flex" v-if="item.prices">
              <div
                v-if="item.prices.old_price_recurring"
                class="old-price"
              >{{item.prices.old_price_recurring[priceValue]}} <span class="currency">rsd/mes.</span></div>
              <div v-if="!item.prices.old_price_recurring"></div>
              <div class="price-recurring">{{item.prices.price_recurring[priceValue]}} rsd/mes.</div>
            </div>
            <div
              v-if="item.prices.old_price_recurring && item.prices.old_price_promo_text"
              class="old-price-text"
            >{{item.prices.old_price_promo_text}}</div>
          </div>
          <div class="card-footer">
            <button class="btn btn-order">Naručite</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PageHome",
  data() {
    return {
      categories: {},
      items: [],
      assets: {},
      priceValue: ""
    };
  },
  created() {
    /* calling a get method to fetch data from API using axios */
    axios.get("http://www.mocky.io/v2/5e8465c23000008400cf4395").then(res => {
      /* reversing categories */
      res.data.contract_length.contract_length_options.reverse()
      
      this.categories = res.data.contract_length
      this.items = res.data.items
      this.assets = res.data.assets
      /* setting a deafult value for dropdown list */
      this.priceValue = this.categories.preselected_contract_length
    })
  },
  methods: {
    /* passing selected value from dropdown list */
    findCategory(event) {
      /* setting a price value for diferent package categoires */
      this.priceValue = event
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .card {
    background-color: #f8f4ec;
    border-radius: 10px;
    padding: 20px;
    border: none;

    .card-header {
      background-color: transparent;

      .card-title {
        color: #742d6c;
        font-size: 48px;
        font-style: italic;
        font-weight: 600;
      }
    }

    .card-body {
      padding: 30px 0;

      .d-flex {
        .category-img img {
          background: #742d6c;
          border-radius: 50%;
          height: 45px;
          width: 45px;
        }
      }

      .prices {
        .old-price {
          text-decoration: line-through;
        }
      }

      .listItemHide {
        display: none;
      }
    }

    .card-footer {
      padding: 30px 0;
      background-color: transparent;

      .btn-order {
        background: #74226c;
        color: #ffffff;
        width: 100%;
        transition: .1s;
        border-radius: 10px;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>