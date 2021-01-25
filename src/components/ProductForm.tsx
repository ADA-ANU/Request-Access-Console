import React from 'react';
import {inject, observer} from 'mobx-react';
import productStore, {ProductStore, ProductListStore} from '../stores/productStore'
import {
    Form,
    Select,
    InputNumber,
    Switch,
    Radio,
    Slider,
    Button,
    Upload,
    Rate,
    Checkbox,
    Row,
    Col,
    Input,
    message,
    notification
} from 'antd';
const { TextArea } = Input;
import API_URL from '../config';
import axios, {AxiosRequestConfig} from 'axios'
import apiagent from '../stores/apiagent'
import {ProductStatus, ProductType, AddSubDishType} from "../stores/data.d";
import {RouteComponentProps} from "react-router-dom";
import {UploadFile, UploadListType} from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import {action, toJS} from "mobx";
import {NotificationPlacement} from "antd/lib/notification";
import ProductCard from "./ProductCard";
//import DynamicFieldSet from "./dynamicFields";
import authStore, {AuthStore} from '../stores/authStore';
import printerStore, {PrinterStore} from '../stores/printerStore';

// interface ReturnFileType{
//     name: string
// }
interface ProductInfoProps{
    product?: ProductStore
    form: any,
    visible: boolean,
    handleVisible: Function,
    productListStore?: ProductListStore,
    authStore?: AuthStore,
    printerStore?: PrinterStore,
    type?: string
}
interface IState {
    fileList: Array<any>,
    uploading: boolean,
    product: ProductType,
    subDishes: Array<AddSubDishType>
}

@inject('productListStore', 'authStore', 'printerStore')
@observer
class ProductForm extends React.Component<ProductInfoProps, IState>{
    state: IState = {
        fileList: [],
        uploading: false,
        product: this.props.product!.product || new ProductStore({} as ProductType),
        subDishes: this.props.product!.product.dish_extra
    }

    handleCancel= ()=>{
        this.props.handleVisible(false)
        //this.state.subDishes = []
        this.props.form.resetFields()
        if (this.props.type ==='new'){
            this.state.subDishes = []
        }
    }

    handleNewSubDish = (dish: AddSubDishType)=>{
        console.log(dish)
        this.setState((state)=>{
            return {subDishes: [...state.subDishes, dish]}
        })
    }
    handleSubdishChange = (index: number, value: string, type: string)=>{
        const subDish = this.state.subDishes

        // @ts-ignore
        subDish[index][type] = value
        this.setState({subDishes: subDish})
    }
    handleSubdishRemove = (index: number)=>{
        let subDish = this.state.subDishes
        subDish.splice(index,1)
        console.log(subDish)
        this.setState({subDishes: subDish})
        return subDish
    }
    handleSubmit = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields((err:any, values:ProductType) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let product = this.state.product
                Object.keys(values).forEach(key => {
                    if(key ==='name'||key ==='ename'||key ==='price'|| key === 'flavor'|| key==='seq' ||key ==='type'||key ==='ingredient'||key ==='description'||key ==='printer')
                        {
                            // @ts-ignore
                            product[key] = values[key]
                        }
                });
                this.setState({product: product})
                this.handleUpload(product)
            }
        });
    };

    handleUpload = (product:ProductType) => {
        const { fileList } = this.state;
        const formData = new FormData();
        if(!product.shopId){
            product.shopId = this.props.authStore!.adminAccount.restaurantId
            product.available = 1
        }
        // @ts-ignore
        Object.keys(product).forEach(key => formData.append(key, product[key]));
        let sDishes = JSON.stringify(this.state.subDishes)
        console.log(sDishes)
        formData.append('subDishes', sDishes)
        if(fileList[0]){
            console.log("appended")
            formData.append('file', fileList[0]);
        }
        this.setState({
            uploading: true,
        });
        console.log(formData)
        this.props.product!.updateProduct(formData)
        //@ts-ignore
            .then(res=>{
                if (res === true){
                    this.handleCancel()
                    // window.location.reload()
                    return (message.success( `Successfully updated ${product.name}`))
                }
                //@ts-ignore
            }).catch(error => {
                console.log(error)
                if (error.status === 401) {
                    alert('Email or password is incorrect, please try again ... ')
                    this.handleCancel()
                }
                else {
                    alert("Update failed, please refesh page and try again ... ")
                    this.handleCancel()
                }
            }).finally(()=>{
                this.props.handleVisible(false)
                this.setState({uploading:false})
            })

    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const { authStore, printerStore } = this.props
        const { name, ename, type, ingredient, price, flavor, subtype, description, dishId, dish_extra, printer, seq } = this.props.product!.product
        console.log(toJS(dish_extra))
        console.log(toJS(this.state.subDishes))
        const dishTypes = this.props.productListStore!.dishTypes
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: (file: any) => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file: any) => {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                if (!isJPG && !isPNG) {
                    message.error('The file upload is not a valid image!');
                }
                else {
                    this.setState(state => ({
                        fileList: [file],
                    }));
                }
                return false;
            },
            //fileList,
            listType: 'picture' as UploadListType,
            multiple: false
        };
        return (
            <Form {...formItemLayout} onFinish={this.handleSubmit}>
                <Form.Item label="Dish Name">
                    {getFieldDecorator('name',{
                        rules: [{required: true, message: 'Dish name is needed!'}],
                        initialValue: name
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="English Name">
                    {getFieldDecorator('ename',{
                        rules: [{required: true, message: 'Dish English name is needed!'}],
                        initialValue: ename
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Dish Price">
                    {getFieldDecorator('price', {
                        rules: [{required: true, message: 'Dish price is needed!'}],
                        initialValue: price
                    })(<InputNumber />)}
                </Form.Item>
                <Form.Item label="Spicy Level">
                    {getFieldDecorator('flavor', {
                        rules: [{required: true, message: 'Spicy Level is needed!'}],
                        initialValue: flavor
                    })(
                        <Select placeholder="Please select a spicy level">
                            {
                                [...Array(5).keys()].map(i => {
                                    return (
                                        <Select.Option key={i} value={i}>{i}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Dish Type" hasFeedback>
                    {getFieldDecorator('type', {
                        rules: [{required: true, message: 'Please select dish type!'}],
                        initialValue: type
                    })(
                        <Select placeholder="Please select a dish type">
                            {
                                dishTypes.map((type, index)=>{
                                    return (
                                        <Select.Option key={index} value={type}>{type}</Select.Option>
                                    )
                                })
                            }
                        </Select>,
                    )}
                </Form.Item>
                {
                    authStore!.restaurantInfo.kitchenPrinter && 
                    <Form.Item label="Select Printer" hasFeedback>
                        {/* {console.log(this.props.product!.product)} */}
                        {getFieldDecorator('printer', {
                            // rules: [{required: true, message: 'Please select a printer to print this dish at kitchen'}],
                            initialValue: printer&&printerStore!.kitchenPrinter.get(printer)? printerStore!.kitchenPrinter.get(printer)!.printerName : ''
                        })(
                            <Select placeholder="Please select a printer to print this dish at kitchen">
                                {
                                    [...printerStore!.kitchenPrinter.values()].map((printer, index)=>{
                                        return (
                                            <Select.Option key={index} value={printer.printerId}>{printer.printerName}</Select.Option>
                                        )
                                    })
                                }
                            </Select>,
                        )}
                    </Form.Item>
                }
                <Form.Item label="Dish Seqence">
                    {getFieldDecorator('seq', {initialValue: seq})(<InputNumber />)}
                </Form.Item>
                {/*<Form.Item label="Dish Subtype" hasFeedback>*/}
                {/*    {getFieldDecorator('subtype', {*/}
                {/*        rules: [{required: false, message: 'Please select dish subtype!'}],*/}
                {/*        initialValue: subtype*/}
                {/*    })(*/}
                {/*        <Select placeholder="Please select a country">*/}
                {/*            <Select.Option value="china">China</Select.Option>*/}
                {/*            <Select.Option value="usa">U.S.A</Select.Option>*/}
                {/*        </Select>,*/}
                {/*    )}*/}
                {/*</Form.Item>*/}
                <Form.Item label="Dish Ingredients">
                    {getFieldDecorator('ingredient', {initialValue: ingredient||''})(<Input />)}
                </Form.Item>
                <Form.Item label="Dish Description">
                    {getFieldDecorator('description', {initialValue: description||''})(<TextArea rows={3} />)}
                </Form.Item>
                {/* <DynamicFieldSet
                    form={this.props.form}
                    handleNewSubDish={this.handleNewSubDish}
                    handleSubdishChange={this.handleSubdishChange}
                    subDishes={this.state.subDishes}
                    handleSubdishRemove={this.handleSubdishRemove}
                    dishId={dishId}
                    product={this.props.product}
                /> */}

                <Form.Item label="Dish Picture">
                    {getFieldDecorator('photo',
                    //     {
                    //     valuePropName: 'fileList',
                    //     getValueFromEvent: this.normFile,
                    // }
                    )(
                        <Upload.Dragger {...props} fileList={this.state.fileList}>
                            <p className="ant-upload-drag-icon">
                                {/* <Icon type="inbox" /> */}
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Only support single upload with one image file (JPG or PNG).</p>
                        </Upload.Dragger>,

                    )}
                </Form.Item>
                <Form.Item wrapperCol={{span: 6, offset: 9}}>
                    <Row justify="space-between" >
                        <Col flex='1'>
                            <Button onClick={this.handleCancel}>
                                cancel
                            </Button>
                        </Col>
                        <Col flex='1'>
                            <Button type="primary" htmlType="submit" loading={this.state.uploading}>
                                Submit
                            </Button>
                        </Col>
                    </Row>

                </Form.Item>
            </Form>
        );
    }
}

const WrappedForm = 'abc'
//Form.create<ProductInfoProps>({ name: 'validate_other' })(ProductForm);
export default WrappedForm