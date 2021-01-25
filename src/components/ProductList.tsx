import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ProductListStore, ProductStore } from '../stores/productStore'
import { inject, observer } from 'mobx-react';
import { List, Avatar, Row, Col, Tabs, Spin, Button } from 'antd';
import ProductCard from './ProductCard';
import DishEditor from "./DishEditorModal";
const { TabPane } = Tabs;
interface ProductListProps extends RouteComponentProps{
    productListStore: ProductListStore
}

@inject('productListStore')
@observer
export default class ProductList extends React.Component<ProductListProps> {

    render() {
        const { productList, productListLoading, tempProduct, modalVisible, isLoading, modalTitle } = this.props.productListStore
        const { productListStore} = this.props
        console.log(modalVisible)

        console.log()
        return (
            <div style={{ background: '#FFF', minHeight:200, padding: '20px 5%'}}>
                {/*style={{display: 'flex', flexFlow:'row wrap'}}*/}
                <Spin spinning={productListLoading} tip="Loading ... ">
                <Row style={{marginBottom: '10px'}}>
                    <Col xs={{ span: 3, offset: 21 }}>
                        <Button onClick={()=>productListStore.addProduct()}>New Dish</Button>
                    </Col>
                </Row>
                <Tabs>
                    {
                        productListStore.dishTypes.map((type, index)=>{
                            return(
                                <TabPane tab={type} key={''+index}>
                                    <Row gutter={[16, 16]} >
                                        {
                                            productList.filter(ele=>ele.product.type===type).map((product, index) => {
                                                return (
                                                    <Col key={index} xs={24} sm={24} md={8} lg={8} xl={6} xxl={6}>
                                                        <ProductCard product={product} />
                                                    </Col>
                                                )
                                            })
                                        }

                                    </Row>
                                </TabPane>
                            )
                        })
                    }

                </Tabs>

                </Spin>
                <DishEditor product={tempProduct} visible={modalVisible} handleVisible={()=>productListStore.cancelSave()} modalTitle={modalTitle} type='new'/>
            </div>
        );
    }
}