import React from "react";
//import { Icon } from 'antd';
import { Form, Divider, Button, Select, Input, Row, Col, InputNumber,Popconfirm, message } from "antd";
import 'antd/es/spin/style/css';
import {AddSubDishType} from "../stores/data.d";
import {FormInstance} from "antd/lib/form";
//import {FormWrappedProps} from "antd/lib/form/interface";
//import FormInstance from 'antd/lib/form/Form';
//import { FormComponentProps } from "antd/lib/form/Form";

import {inject, observer} from "mobx-react";
import {ProductListStore, ProductStore} from "../stores/productStore";

interface Props{
    form: FormInstance
    handleNewSubDish: Function,
    handleSubdishChange: Function,
    subDishes: Array<AddSubDishType>,
    handleSubdishRemove: Function,
    dishId: number,
    product?: ProductStore
}

let id = 0;

// @inject('productStore')
@observer
export default class DynamicFieldSet extends React.Component<Props> {
    remove = (k:any, index: number) => {
        const { form } = this.props;

        if (this.props.subDishes.length>0){
            console.log("delete")
            if( k.dishExtraId !==null){
                console.log(k)
                //@ts-ignore
                this.props.product!.deleteExtraDish(k.dishExtraId).then(res=>{
                    //@ts-ignore
                        if( res.affectedRows ===1){
                            let sdishes = this.props.handleSubdishRemove(index)
                            let obj = {}
                            sdishes.map((dish:any, index:number)=>{
                                // @ts-ignore
                                obj[`name_${index}`] = dish.name
                                // @ts-ignore
                                obj[`ename_${index}`] = dish.ename
                                // @ts-ignore
                                obj[`price_${index}`] = dish.price
                            })
                            form.setFieldsValue(obj)
                        }
                    })
            }
            else{
                let sdishes = this.props.handleSubdishRemove(index)
                let obj = {}
                sdishes.map((dish:any, index:number)=>{
                    // @ts-ignore
                    obj[`name_${index}`] = dish.name
                    // @ts-ignore
                    obj[`ename_${index}`] = dish.ename
                    // @ts-ignore
                    obj[`price_${index}`] = dish.price
                })
                form.setFieldsValue(obj)
            }

        }

    };

    add = () => {
        const dish = {
            dishExtraId: null,
            dishId: this.props.dishId,
            name: "",
            ename: "",
            price: ""
        } as AddSubDishType
        this.props.handleNewSubDish(dish)
    };

    confirm=(k:any, index: number)=> {
        this.remove(k, index)
    }

    cancel=(e: any)=> {
        console.log(e);
        message.error('Click on No');
    }

    handleOnChange=(e:any)=>{
        console.log(e)
        let value = e.target.value
        let type = e.target.id.split('_')[2]
        let index = e.target.id.split('_')[3]
        if (value && type && index){
            this.props.handleSubdishChange(index, value, type)
        }

    }

    handleSubmit = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields()
        .then((values) => {
            const { keys, names } = values;
            console.log('Received values of form: ', values);
            console.log('Merged values:', keys.map((key:any) => names[key]));
        }).catch(err=> { console.log(err) })
    };


    render() {
        const { getFieldValue } = this.props.form;
        console.log(this.props.subDishes)
        // const formItemLayout = {
        //     labelCol: {
        //         xs: { span: 24 },
        //         sm: { span: 4 },
        //     },
        //     wrapperCol: {
        //         xs: { span: 24 },
        //         sm: { span: 20 },
        //     },
        // };
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 14, offset: 0
            },
        };
        const subFormItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 20, offset: 1
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        var abc = []
        //getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItem = (keys:any) =>{
            return (
                <div style={{display: 'inline'}}>

                </div>


            )
        }

        // @ts-ignore
        const formItems = this.props.subDishes.map((k:any, index:any) => (
            <div style={{display: 'inline'}} key={index}>
                <Form.Item
                    // : formItemLayoutWithOutLabel)
                    // index === 0 ?
                    {...(formItemLayout)}
                    label={`Dish Extra ${index+1}`}
                    required={false}
                    //key={index}
                >
                {/*    {getFieldDecorator(`${index}`,{*/}
                {/*        trigger: 'onChange',*/}
                {/*    rules: [{required: false, message: 'Dish name is needed!'}],*/}
                {/*    // initialValue: name*/}
                {/*})(<>*/}
                    <Form.Item
                            label={'Extra'}
                            //key={`name${index}`}
                            //required={true}
                            {...(subFormItemLayout)}
                        >
                            {/* {getFieldDecorator(`name_${index}`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                //trigger: 'onChange',
                                initialValue: k.name,
                                //valuePropName: 'defaultValue',
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Please input dish extra name.",
                                    },
                                ],
                                //style={{ width: '60%', marginRight: 8 }}
                            })(<Input
                                placeholder="Extra name"
                                style={{ width: '92%', marginRight: 8 }}
                                onChange={this.handleOnChange}
                                // value={k.name}
                            />)} */}
                        {/* <Popconfirm
                            title="Are you sure delete this task?"
                            onConfirm={()=>{this.confirm(k, index)}}
                            onCancel={this.cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            {/* <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                //onClick={() => this.remove(index)}
                            /> */}
                        {/*</Popconfirm> */}
                        </Form.Item>
                        <Form.Item
                            label={'Extra English Name'}
                            //key={`ename${index}`}
                            //required={true}
                            {...(subFormItemLayout)}
                        >
                            {/* {getFieldDecorator(`ename_${index}`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: k.ename,
                                rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input dish extra name",
                            },],
                        //style={{ width: '60%', marginRight: 8 }}
                            })(
                                <Input
                                    placeholder="dish extra English name"
                                    style={{ width: '92%', marginRight: 8 }}
                                    onChange={this.handleOnChange}
                                />
                            )} */}
                        </Form.Item>
                        <Form.Item
                            label={'Price'}
                            //key={`price${index}`}
                            //required={true}
                            {...(subFormItemLayout)}
                        >
                            {/* {getFieldDecorator(`price_${index}`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: k.price,
                                getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
                                    const convertedValue = Number(e.currentTarget.value);
                                    console.log(convertedValue)
                                    console.log(isNaN(convertedValue))
                                    if (isNaN(convertedValue)) {
                                        return Number(this.props.form.getFieldValue(`price_${index}`));
                                    } else {
                                        return convertedValue;
                                    }
                                },
                                rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    //type: "regexp",
                                    //type: "number",
                                    pattern: new RegExp(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/),
                                    message: "Please input dish extra price",
                                },
                                ],
                        //style={{ width: '60%', marginRight: 8 }}
                        })(
                            <Input
                                placeholder="dish extra price"
                                style={{ width: '92%', marginRight: 8 }}
                                onChange={this.handleOnChange}
                            />)} */}
                        </Form.Item>
                    {/*</>*/}
                    {/*)}*/}


                </Form.Item>
            </div>
        ));
        return (
            <div></div>
            // <Form onSubmit={this.handleSubmit}>
            //     {formItems}
            //     {/*{...formItemLayoutWithOutLabel}*/}

            //     <Row gutter={16}>
            //         <Col className="gutter-row" span={3} />
            //         <Col className="gutter-row" span={18}>
            //             <Form.Item

            //                 style={{textAlign: 'center'}}
            //                 //label={'d'}
            //             >
            //                 <Button
            //                     type="dashed"
            //                     onClick={this.add}
            //                     style={{ width: "60%"}}
            //                     //disabled={!props.required}
            //                 >
            //                     {/* <Icon type="plus" /> */}
            //                      Add Dish Extra/Side
            //                 </Button>
            //             </Form.Item>
            //         </Col>
            //     </Row>
            //     {/*<Button type="dashed" onClick={this.add} style={{ width: '60%' }}>*/}
            //     {/*    */}
            //     {/*</Button>*/}

            // </Form>
        );
    }
}