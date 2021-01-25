import React from 'react';
import {observer} from 'mobx-react';
import {ProductStore} from '../stores/productStore'
import {Button, Card, Descriptions, Popover, Modal} from 'antd';
import ProductForm from "./ProductForm";
import {ProductStatus} from "../stores/data.d";

interface ProductInfoProps{
    product: ProductStore,
    visible: boolean,
    handleVisible: Function
    modalTitle?: string,
    type?: string
}

@observer
export default class DishEditor extends React.Component<ProductInfoProps>{

    render(){
        const product = this.props.product
        const visible = this.props.visible
        const handleVisible = this.props.handleVisible
        const modalTitle = this.props.modalTitle!
        const type = this.props.type!
        return(
            <Modal
                title={modalTitle ||product.product.name}
                visible={visible}
                // onOk={()=>this.props.handleVisible(false)}
                onCancel={()=>this.props.handleVisible(false)}
                footer={null}
                mask={true}
                centered={true}
                width='80vw'
            >
                {/* <ProductForm product={product} visible={visible} handleVisible={handleVisible} type={type}/> */}

            </Modal>

        )
    }
}