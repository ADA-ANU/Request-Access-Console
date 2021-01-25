import React from 'react';
import {observer} from 'mobx-react';
import {ProductListStore, ProductStore} from '../stores/productStore'
import {Button, Card, Descriptions, Popover} from 'antd';
import DishEditor from "./DishEditorModal";
import {ProductStatus} from "../stores/data.d";
import API_URL from '../config';
import apiagent from '../stores/apiagent'
import {RouteComponentProps} from "react-router-dom";
import NoPreview from '../resource/nopreview.png'
import printerStore from '../stores/printerStore';

interface ProductProps{
    product: ProductStore,
}

@observer
export default class ProductCard extends React.Component<ProductProps> {
    state={
        visible: false
    }

    handleVisible = (value:boolean)=>{
        this.setState({visible: value})
    }
    render() {
        const product = this.props.product
        return (
            <>
            <Card title={`${product.product.name}`} 
                hoverable
                cover={<img height={200} style={{ objectFit:'contain'}} alt="example" src={product.product.photo &&product.product.photo !==''?`${API_URL.ROOT_URL}${API_URL.IMAGE}/${product.product.photo}`: NoPreview} />}
                // extra={
                // <Popover placement="bottomLeft" content={<div><li><a href='#'>Delete Product</a></li></div>} trigger="click">
                //     <a href='#'>more</a>
                // </Popover>} 
                actions={[
                    <Button style={{backgroundColor:`${product.product.available === ProductStatus.available? '#cce4d0':'#FF6666'}`}}
                            block size="large" onClick={()=>product.updateProductStatus()}
                    >{product.product.available === ProductStatus.available?"":""}
                        {product.product.available ===ProductStatus.available?'Available':'Unavailable'}</Button>,
                    // <Icon type="edit" key="edit" />,
                    <Button block size="large" onClick={()=>this.setState({visible: true})}>Edit</Button>,
                    ]}
                  bodyStyle={{height: `calc(100% - 265px)`}}
                  style={{height: `calc(100% - 65px)`}}
            >
                
                <Descriptions bordered column={1} size='small'>
                    <Descriptions.Item label="Name">{product.product.name}</Descriptions.Item>
                    <Descriptions.Item label="English">{product.product.ename}</Descriptions.Item>
                    <Descriptions.Item label="Price">{product.product.price}</Descriptions.Item>
                    <Descriptions.Item label="Spicy Level">{product.product.flavor}</Descriptions.Item>
                    <Descriptions.Item label="Sequence">{product.product.seq}</Descriptions.Item>
                    <Descriptions.Item label="Ingredients">{product.product.ingredient}</Descriptions.Item>
                    <Descriptions.Item label="Type">{product.product.type} / {product.product.etype}</Descriptions.Item>
                    {/* <Descriptions.Item label="Sub Type">{product.product.subtype}</Descriptions.Item> */}
                    <Descriptions.Item label="Printer">{(printerStore.kitchenPrinter.get(product.product.printer)||{}).printerName}</Descriptions.Item>
                </Descriptions>

            </Card>
            <DishEditor product={product} visible={this.state.visible} handleVisible={this.handleVisible}/>
            </>
        );
      }
}