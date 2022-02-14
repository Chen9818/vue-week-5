import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'wei-z';

const app = createApp({
    data(){
        return{
            products:[],
            product:{},
			pagination: {},
            loadingStatus: {
                loadingItem: '',
            },
            cart:{}
        }
    },
    methods: {
        getProducts(page = 1) {
            const url = `${apiUrl}/api/${apiPath}/products?page=${page}`;
            axios.get(url).then((response) => {
                console.log(response);
                const {products,pagination} = response.data;
                console.log(pagination);
                this.products = products;
                this.pagination = pagination;
            }).catch((err) => {
                alert(err.data.message);
                console.log(err.data.message);
            });
        },
        getProduct(id) {
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.get(url).then((response) => {
                this.loadingStatus.loadingItem = '';
                console.log(response);
                this.product = response.data.product;
            //   window.location.href='one.html'
            //   this.$refs.userProductModal.openModal();
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        addToCart(id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            };
            // this.$refs.userProductModal.hideModal();
            axios.post(url, { data: cart }).then((response) => {
                alert(response.data.message);
                this.loadingStatus.loadingItem = '';
                this.getCart();
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url).then((response) => {
                this.cart = response.data.data;
            }).catch((err) => {
                alert(err.data.message);
            });
        },
    },
    mounted() {
        this.getProducts()
        this.getCart()
    },
})

// 分頁元件
app.component('pagination', {
	template: '#pagination',
	props: ['pages'],
	methods: {
		emitPages(item) {
			this.$emit('emit-pages', item);
		},
	},
});

app.mount('#app')