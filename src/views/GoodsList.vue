<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:;" class="default cur">Default</a>
                    <a href="javascript:;" class="price" @click="sortGoods">Price
                        <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
                            <use xlink:href="/static/svg.svg#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:;" class="filterby stopPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div id="filter" class="filter stopPop" :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:;" :class="{'cur':priceChecked == 'all'}"
                                   @click="setPriceFilter('all')">All</a></dd>
                            <dd v-for="(price, index) in priceFilter">
                                <a href="javascript:;" :class="{'cur':priceChecked == index}"
                                   @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li class='item' v-for="item in goodsList">
                                    <div class="pic">
                                        <a href="javascript:;">
                                            <img v-lazy="'/static/'+item.productImage">
                                        </a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                                 infinite-scroll-distance="10">
                                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-if="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">请先登录后再加入购物车</p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
            </div>
        </modal>
        <modal :mdShow="mdShowCart" @close="closeModal">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功!</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
                <router-link href="javascript:;" class="btn btn--red" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from "@/components/NavHeader"
    import NavFooter from '@/components/NavFooter'
    import NavBread from '@/components/NavBread'
    import Modal from '@/components/Modal'

    import axios from 'axios'

    export default {
        data() {
            return {
                goodsList: [],
                mdShow: false,
                mdShowCart: false,
                sortFlag: false,
                page: 1,
                pageSize: 8,
                // 滚动加载标识
                busy: false,
                loading: false,
                // 价格过滤
                priceFilter: [
                    {
                        startPrice: "0.00",
                        endPrice: "100.00"
                    },
                    {
                        startPrice: "100.00",
                        endPrice: "500.00"
                    },
                    {
                        startPrice: "500.00",
                        endPrice: "1000.00"
                    },
                    {
                        startPrice: "1000.00",
                        endPrice: "5000.00"
                    }
                ],
                priceChecked: 'all',
                filterBy: false,
            }
        },
        created() {
            this.getGoodsList();
        },
        methods: {
            // 获取物品列表
            getGoodsList(flag) {
                var vm = this;
                var params = {
                    page: vm.page,
                    pageSize: vm.pageSize,
                    sort: vm.sortFlag ? -1 : 1,
                    priceLevel: vm.priceChecked,
                }

                this.loading = true;

                axios.get("/goods", {
                    params: params,
                }).then((res) => {
                    var data = res.data;
                    if (data.status == "0") {
                        if (flag) {
                            this.goodsList = this.goodsList.concat(data.data.list);

                            if (data.data.count != this.pageSize) {
                                this.busy = true;
                            } else {
                                this.busy = false;
                            }
                        } else {
                            this.goodsList = data.data.list;
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = [];
                    }

                    this.loading = false;
                })
            },
            // 排序方式修改
            sortGoods() {
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },
            // 价格过滤
            setPriceFilter(index) {
                this.priceChecked = index;
                this.page = 1;
                this.getGoodsList();
            },
            // 下拉滚动
            loadMore() {
                this.busy = true;
                setTimeout(() => {
                    this.page++;
                    this.getGoodsList(true);
                }, 500)
            },
            addCart(productId) {
                axios.post("/goods/addCart", {
                    productId: productId
                }).then((res) => {
                    var res = res.data;
                    if (res.status == "0") {
                        this.mdShowCart = true;
                        this.$store.commit("updateCartCount", 1);
                    } else {
                        this.mdShow = true;
                    }
                })
            },
            closeModal() {
                this.mdShow = false;
                this.mdShowCart = false;
            },
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        }
    }
</script>
<style scoped>
    .btn {
        height: 40px;
        line-height: 40px;
    }

    .load-more {
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .sort-up {
        transform: rotate(180deg);
        transition: all .3s ease-out;
    }
</style>
