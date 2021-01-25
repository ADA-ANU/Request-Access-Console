import { observable, action, computed, reaction } from 'mobx';
import {ProductType, OrderStatus, DishItemType, PrinterType} from './data'
import API_URL from '../config'
import apiagent from './apiagent'
import {ProductStatus} from "../stores/data.d";
import systemStore from './systemStore'
import authStore from './authStore'


export class ProductStore{
    @observable productLoading = false
    @observable product: ProductType
    @observable trigger = 1;

    constructor(product:any){
        this.product = product as ProductType
        if(!this.product.dish_extra){
            this.product.dish_extra = []
        }
    }
    @action updateProductStatus(){
        this.productLoading = true
        let availability = this.product.available === ProductStatus.available?ProductStatus.unavailable:ProductStatus.available
        apiagent.get(`${API_URL.UPDATE_DISH_AVAILABILITY}/${availability}/${this.product.dishId}`).then(action(res =>{
            console.log(res)
            this.product.available = availability
            //this.trigger = this.trigger + 1
        })).finally(()=>this.productLoading = false)
    }
    @action updateProduct(formData:FormData){
        this.productLoading = true
        return apiagent.post(API_URL.UPDATE_PRODUCT, formData, { headers: {'Content-Type': 'multipart/form-data' }})
        //@ts-ignore
            .then(action(res=>{
                //@ts-ignore
                this.product = res.product as ProductType
                return true
            })).finally(()=>this.productLoading = false)
    }
    @action deleteExtraDish(extraDishID: number){
        this.productLoading = true
        //@ts-ignore
        return apiagent.get(`${API_URL.DELETE_EXTRADISH}/${extraDishID}`)
            .then(action(res=>{
                //@ts-ignore
                if (res.affectedRows ===1) {
                    const newExtraDishes = this.product.dish_extra.filter(dish=>dish.dishExtraId !== extraDishID)
                    this.product.dish_extra = newExtraDishes
                }
                return res
            })).finally(()=>this.productLoading = false)
    }
}

export class ProductListStore{
    @observable productListLoading = false
    @observable productList: Array<ProductStore> = []
    @observable dishTypes: any[] = []
    @observable tempProduct: ProductStore = new ProductStore({} as ProductType)
    @observable modalVisible: boolean = false
    @observable isLoading: boolean = false
    @observable modalTitle: string = ''

    @action addProduct(){
        console.log(this.modalVisible)
        this.modalTitle = "Add Dish"
        this.tempProduct = new ProductStore({} as PrinterType)
        this.modalVisible = true
    }

    @action editProduct(product: ProductStore){
        this.modalTitle = 'Edit Dish'
        this.tempProduct = product
    }
    @action savePrinter(){
        this.modalVisible = false
        this.updateProduct(this.tempProduct)
    }
    @action cancelSave(){
        this.modalVisible = false
    }

    @action updateProduct(product: ProductStore){
        this.isLoading = true
        let tempProduct = product.product
        if(!tempProduct.shopId){
            tempProduct.shopId = authStore.adminAccount.restaurantId
            tempProduct.available = 1
        }
        apiagent.post(`${API_URL.UPDATE_PRINTER}`, tempProduct).then(action(info=>{
            console.log(info)

        })).finally(()=>this.isLoading=false)
    }
    @action getProudctList(restaurantId: number){
        this.productListLoading = true
        return apiagent.get(`${API_URL.PRODUCT_LIST}/${restaurantId}`).then(action(products=>{
            //@ts-ignore
            products.map(product=>this.productList.push(new ProductStore(product)))
        })).finally(()=>this.productListLoading=false)
    }
    @action getDishTypes(restaurantId: number){
        this.productListLoading = true
        return apiagent.get(`${API_URL.GET_DISH_TYPES}/${restaurantId}`).then(action(dishTypes=>{
            //@ts-ignore
            dishTypes.map(type=>this.dishTypes.push(type.type))
        })).finally(()=>this.productListLoading=false)
    }
}

export default new ProductListStore()
