import React from 'react';
import {browserHistory, Link} from 'react-router';
import ToGalleryBtn from './ToGalleryBtn';
import PhotoAPIUtils from './PhotoAPIUtils';

const Detail = React.createClass({
    componentDidMount:function(){
        PhotoAPIUtils.addRecieveInfoListener(this.getInfo);
        PhotoAPIUtils.getDetailInfo(this.props.params.id);
    },
    componentWillUnmount:function(){
        PhotoAPIUtils.removeRecieveInfoListener(this.getInfo);
    },
    getInitialState: function(){
      return {
          info:'',
      }
    },
    getInfo:function(info){
        this.setState({
            info:info,
        });
    },
    render: function() {
        if (this.state.info) {
            return <div className="detail-wrapper">
                <ToGalleryBtn />
                <div className="image-wrapper"><img className="detail-image" src={this.state.info.photo.webPath}/></div>
                <div className="detail">
                    <p className="full-name">{this.state.info.participant.surname} {this.state.info.participant.patronymic ? this.state.info.participant.patronymic : ''} {this.state.info.participant.name}</p>
                    <p className="year">{this.state.info.participant.year} г.р.</p>
                    <p className="story">{this.state.info.participant.description}</p>
                    <p className="story">{this.state.info.photo.description}</p>
                </div>
            </div>;
        } else {
            return false;
        }
    },
});
module.exports = Detail;