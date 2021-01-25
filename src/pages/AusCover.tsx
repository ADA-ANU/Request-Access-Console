import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import PriceImg from '../resource/price.png'


const { Header, Content, Footer } = Layout;

@inject('historyStore')
@observer
export default class Price extends React.Component {
    render(){
        return(
            <React.Fragment>
                <img src={PriceImg} alt="Price" style={{width: '100%'}}/>
            </React.Fragment>
        )
    }
}