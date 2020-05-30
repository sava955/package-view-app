<template>
  <div id="packages-page" class="container">
    <AppDropdown :options="categories" @input="findCategory($event)" />
    <transition name="bounce">
    <div class="row align-items-end" v-if="show">
      <div class="col-4" v-for="(item, i) of items" :key="i">
        <div class="card">
          <div class="is-featured" v-if="item.is_featured == 1">
            <span class="font-weight-bold">{{promoText}}</span>
            <hr />
          </div>
          <div
            v-if="item"
            class="card-header d-flex"
            ref="cardHeader"
            :style="{height: heighestHeader + 'px'}"
          >
            <h2 class="card-title align-self-center">{{item.name}}</h2>
          </div>
          <div class="card-body">
            <div class="d-flex included align-items-center">
              <div v-if="assets" class="category-img">
                <img :src="assets.tv_category" alt="tv_category" />
              </div>
              <div
                class="d-flex included-list included-list-1 flex-grow-1"
                ref="tv"
                :style="{height: heighestTv + 'px'}"
              >
                <ul class="align-self-center">
                  <li
                    v-for="(inc, y) of item.included"
                    :key="y"
                    class="list-item text-left"
                    :class="{listItemHide: inc.product_category == 'net'}"
                  >
                    <span
                      v-if="inc.product_category == 'tv'"
                      v-html="inc.long_name"
                    >{{inc.long_name}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <hr />
            <div class="d-flex included align-items-center">
              <div v-if="assets" class="category-img">
                <img :src="assets.net_category" alt="net_category" />
              </div>
              <div
                class="d-flex included-list included-list-2 flex-grow-1"
                ref="net"
                :style="{height: heighestNet + 'px'}"
              >
                <ul class="align-self-center">
                  <li
                    v-for="(inc, y) of item.included"
                    :key="y"
                    class="list-item text-left"
                    :class="{listItemHide: inc.product_category == 'tv'}"
                    v-html="inc.long_name"
                  >{{inc.product_category == 'net' ? inc.long_name : ''}}</li>
                </ul>
              </div>
            </div>
            <div v-for="(promotion, y) of item.promotions" :key="y">
              <div
                v-if="promotion.discount_variations == priceValue"
                class="d-flex mt-3 mb-3 promotions align-items-center"
              >
                <div class="promotion-img flex-grow-1">
                  <img :src="promotion.promotion_image" alt />
                </div>
                <div class="text ml-auto">
                  <span
                    class="font-weight-bold"
                    v-html="promotion.promo_text"
                  >{{promotion.promo_text}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div
              class="prices d-flex justify-content-between align-items-center"
              :class="{priceCenter: item.prices.old_price_recurring[priceValue] == ''}"
              v-if="item.prices"
            >
              <div
                v-if="item.prices.old_price_recurring[priceValue] != ''"
                class="old-price font-weight-bold"
              >
                {{item.prices.old_price_recurring[priceValue]}}
                <span class="currency">rsd/mes.</span>
              </div>
              <div v-if="!item.prices.old_price_recurring"></div>
              <div
                class="price-recurring font-weight-bold"
              >{{item.prices.price_recurring[priceValue]}} rsd/mes.</div>
            </div>
            <div
              v-if="item.prices.old_price_recurring && item.prices.old_price_promo_text"
              class="old-price-text mb-2"
              v-html="item.prices.old_price_promo_text"
            >{{item.prices.old_price_promo_text}}</div>
            <button class="btn btn-order mt-3">Naručite</button>
          </div>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "PageHome",
  data() {
    return {
      show: false,
      categories: {},
      items: [],
      assets: {},
      priceValue: "",
      cardHeader: [],
      promoText: "",
      cardHeaderHeight: [],
      tvHeight: [],
      netHeight: [],
      heightValue: Number,
      heighestHeader: Number,
      heighestTv: Number,
      heighestNet: Number
    };
  },
  created() {
    /* calling a get method to fetch data from API using axios */
    axios.get("http://www.mocky.io/v2/5e8465c23000008400cf4395").then(res => {
      /* reversing categories */
      res.data.contract_length.contract_length_options.reverse()

      this.categories = res.data.contract_length
      this.promoText = res.data.promo_text

      /* setting a deafult value for dropdown list */
      this.priceValue = this.categories.preselected_contract_length

      res.data.items.forEach(item => {
        item.prices.price_recurring[this.priceValue] = Math.floor(
          item.prices.price_recurring[this.priceValue]
        );
        item.prices.old_price_recurring[this.priceValue] = Math.floor(
          item.prices.old_price_recurring[this.priceValue]
        );
        item.included.forEach(inc => {
          inc.long_name = inc.long_name.replace(
            inc.attributes.attribute_value,
            "<strong>" + inc.attributes.attribute_value + "</strong>"
          )
        })
      })

      this.items = res.data.items
      this.assets = res.data.assets
      
      // matching maximum height
      this.$nextTick(() => {
        if (this.$refs.cardHeader) {
          this.matchHeight()
        }
      })
    })
  },
  mounted() {
    this.show = true
  },
  methods: {
    /* passing selected value from dropdown list */
    findCategory(event) {
      /* setting a price value for diferent package categoires */
      this.show = false;
      this.priceValue = event;
      this.items.forEach(item => {
        item.prices.price_recurring[this.priceValue] = Math.floor(
          item.prices.price_recurring[this.priceValue]
        );
        item.prices.old_price_recurring[this.priceValue] = Math.floor(
          item.prices.old_price_recurring[this.priceValue]
        );
      });
       setTimeout(() => this.show = true, 500)
    },
    matchHeight() {
      let header = this.$refs.cardHeader
      let tv = this.$refs.tv
      let net = this.$refs.net

      // setting height for title
      header.forEach(h => {
        this.cardHeaderHeight.push(h.clientHeight)
        this.findHeighestValue(this.cardHeaderHeight)
        this.heighestHeader = this.heightValue
      });

      // setting height for tv category
      tv.forEach(h => {
        this.tvHeight.push(h.clientHeight)
        this.findHeighestValue(this.tvHeight)
        this.heighestTv = this.heightValue
      })

      // setting height for net category
      net.forEach(h => {
        this.netHeight.push(h.clientHeight)
        this.findHeighestValue(this.netHeight)
        this.heighestNet = this.heightValue
      })
    },
    // searching heighest value in elements
    findHeighestValue: function(array) {
      this.heightValue = Math.max.apply(Math, array)
      return this.heightValue
    }
  }
};
</script>

<style lang="scss" scoped>

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

#packages-page {
  .col-4 {
    display: table;
    margin-bottom: 2em;

    .card {
      background-color: #f8f4ec;
      border-radius: 10px;
      padding: 20px;
      border: none;

      .is-featured {
        color: #742d6c;
        font-style: italic;
      }

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

        .included {
          .category-img img {
            background: #742d6c;
            border-radius: 50%;
            height: 45px;
            width: 45px;
          }

          .included-list ul {
            margin-bottom: 0;
          }
        }

        .listItemHide {
          display: none;
        }

        .promotions {
          background: #ffffff;
          position: relative;
          min-height: 90px;
          padding-right: 10px;

          .promotion-img {

            img {
              position: absolute;
              top: -5px;
              left: 0;
              width: 90px;
              height: auto;
            }
          }

          .text {
            color: #742d6c;
            font-style: italic;
          }
        }
      }

      .card-footer {
        padding: 20px 0;
        background-color: transparent;

        .prices {
          .price-recurring,
          .old-price {
            color: #742d6c;
            font-style: italic;
          }

          .price-recurring {
            font-size: 33px;
          }

          .old-price {
            text-decoration: line-through #102542;
            font-size: 22px;
          }
        }

        .priceCenter {
          justify-content: center !important;
        }

        .btn-order {
          background: #742d6c;
          color: #ffffff;
          width: 100%;
          transition: 0.1s;
          border-radius: 10px;

          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }

  @media screen and (min-width: 1366px) {
    .col-4 {
      flex: 0 0 33.33333% !important;
      max-width: 33.33333% !important;
    }
  }

  @media screen and (max-width: 1365px) {
    .col-4 {
      margin: 2em 0;
      flex: none !important;
      max-width: 100% !important;

      .card-header,
      .included-list {
        height: 100% !important;
      }
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1365px) {
    .row {
      padding-right: 10em;
      padding-left: 10em;
    }
  }

  @media screen and (min-width: 320px) and (max-width: 767px) {
    .row {
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  @media screen and (max-width: 410px) {
    .promotion-img {
      width: 100%;
    }
  }
}
</style>