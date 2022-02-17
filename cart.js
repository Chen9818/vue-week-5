/* eslint-disable no-undef */
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'wei-z';

//主套件
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
//規則
const { required, email, min, max } = VeeValidateRules;
//多國語系
const { localize, loadLocaleFromURL } = VeeValidateI18n;

//定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

//加入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
	generateMessage: localize('zh_TW'),
});


const app = Vue.createApp({
	data(){
		return{
			products:[],
			product:{},
			pagination: {},
			loadingStatus: {
				loadingItem: '',
			},
			cart:{
				carts:[]
			},
			form: {
				user: {
					name: '',
					email: '',
					tel: '',
					address: '',
				},
				message: '',
			},
		};
	},
	components: {
		VForm: Form,
		VField: Field,
		ErrorMessage: ErrorMessage,
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
				this.product = response.data.product;
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
		updateCart(data) {
			this.loadingStatus.loadingItem = data.id;
			const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
			const cart = {
				product_id: data.product_id,
				qty: data.qty,
			};
			axios.put(url, { data: cart }).then((response) => {
				alert(response.data.message);
				this.loadingStatus.loadingItem = '';
				this.getCart();
			}).catch((err) => {
				alert(err.data.message);
				this.loadingStatus.loadingItem = '';
			});
		},
		removeCartItem(data) {
			const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
			this.loadingStatus.loadingItem = data.id;
			axios.delete(url).then((response) => {
				alert(response.data.message);
				this.loadingStatus.loadingItem = '';
				this.getCart();
			}).catch((err) => {
				alert(err.data.message);
			});
		},
		deleteAllCarts(data) {
			const url = `${apiUrl}/api/${apiPath}/carts`;
			this.loadingStatus.loadingItem = data;
			axios.delete(url).then((response) => {
				alert(response.data.message);
				this.loadingStatus.loadingItem = '';
				this.getCart();
			}).catch((err) => {
				ert(err.data.message);
			});
		},
		createOrder() {
			const url = `${apiUrl}/api/${apiPath}/order`;
			const order = this.form;
			axios.post(url, { data: order }).then((response) => {
				alert(response.data.message);
				this.$refs.form.resetForm();  //vee validate 的方法 form reset 
				this.getCart();
			}).catch((err) => {
				alert(err.data.message);
			});
		},
	},
	mounted() {
		this.getProducts();
		this.getCart();
	},
});

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

app.mount('#app');
