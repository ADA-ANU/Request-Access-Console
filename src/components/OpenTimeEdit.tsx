import React from 'react';
import { observer, inject } from 'mobx-react';
import { TimePicker,Checkbox, Spin, Row, Col, Empty,Modal} from 'antd';
import moment from 'moment'
import openTimeStore,{OpenTimeStore} from '../stores/openTimeStore'

interface OpenTimeProps{
    // authStore: AuthStore
    openTimeStore: OpenTimeStore
}
@inject('authStore')
@observer
export default class OpenTimeEdit extends React.Component<OpenTimeProps> {
    render() {
        const openTimeStore = this.props.openTimeStore
        const openDayList = openTimeStore.openDayList

        return (
            <Modal 
            width ={'70%'}
            centered={true}
            title='Edit Open Time' 
            visible={openTimeStore.openTimeEdit}
            onOk={()=>openTimeStore.submit()}
            onCancel={()=>openTimeStore.openTimeEditing()}
            >
                <Spin spinning={this.props.openTimeStore.isLoading}>
                <Row gutter={[16,16]} style={{marginLeft:'5%'}}>
                    {openDayList.map((day,key)=>{
                        return(
                        <Col key={key}>
                        <Checkbox checked={!!+day.open} onChange={()=>openTimeStore.saveOpenTime(day,'open','')}>{day.openDay}</Checkbox>
                            <Row gutter={[8,8]} style={{display:`${day.open? '' : 'none'}`}}>
                                <Col offset={2} >
                                <span style={{color:'gray',marginRight:'3%'}}>{'Morning'}</span>
                                    {'Start:'}
                                    <TimePicker 
                                    value={day.morningStart ? moment(day.morningStart,'HH:mm A') : moment('10:00','HH:mm A')} 
                                    disabled={!!+day.morningClose} 
                                    onChange={(e)=>{openTimeStore.saveOpenTime(day,'morningStart',moment(e!).format("HH:mm A"))}} 
                                    style={{marginLeft:'1%', marginRight:'1%'}} size={"small"} format={"HH:mm A"} minuteStep={10}/>
                                    {'End:'}
                                    <TimePicker 
                                    value={day.morningEnd ? moment(day.morningEnd,'HH:mm A') : moment('14:00','HH:mm A')} 
                                    disabled={!!+day.morningClose} 
                                    onChange={(e)=>{openTimeStore.saveOpenTime(day,'morningEnd',moment(e!).format("HH:mm A"))}} 
                                    style={{marginLeft:'1%', marginRight:'1%'}} size={"small"} format={"HH:mm A"} minuteStep={10}/>
                                    <Checkbox checked={!!+day.morningClose} onChange={()=>{openTimeStore.saveOpenTime(day,'morningClose','')}}>Close</Checkbox>
                                </Col>
                                
                                <Col offset={2}>
                                <span style={{color:'gray', marginRight:'3%'}}>{'Afternoon'}</span>
                                    {'Start:'}
                                    <TimePicker 
                                    value={day.afternoonStart ? moment(day.afternoonStart,'HH:mm') : moment('16:00','HH:mm')} 
                                    disabled={!!+day.afternoonClose} 
                                    onChange={(e)=>{openTimeStore.saveOpenTime(day,'afternoonStart',moment(e!).format("HH:mm"))}} 
                                    style={{marginLeft:'1%', marginRight:'1%'}} size={"small"} format={"HH:mm A"} minuteStep={10}/>
                                    {'End:'}
                                    <TimePicker 
                                    value={day.afternoonEnd ? moment(day.afternoonEnd,'HH:mm') : moment('21:00','HH:mm')} 
                                    disabled={!!+day.afternoonClose} 
                                    onChange={(e)=>{openTimeStore.saveOpenTime(day,'afternoonEnd',moment(e!).format("HH:mm"))}} 
                                    style={{marginLeft:'1%', marginRight:'1%'}} size={"small"} format={"HH:mm A"} minuteStep={10}/>
                                    <Checkbox checked={!!+day.afternoonClose} onChange={()=>{openTimeStore.saveOpenTime(day,'afternoonClose','')}}>Close</Checkbox>
                                </Col>  
                            </Row>         
                        </Col>
                        )
                    })}
                </Row>
                </Spin>
            </Modal>
        );
      }
}