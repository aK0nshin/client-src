import React from 'react';
import {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Superagent from 'superagent';
import Ee from 'event-emitter';

const style = {width:254,height:254,border:"2px dashed lightgrey"};

const infoStyle = {
  fontSize: 21,
  color: 'grey',
  position: 'absolute',
  width: 256,
  zIndex: -1,
};

const ImageZone = React.createClass({
  propTypes: {
    toggleLoading: PropTypes.func,
  },
  getInitialState: function() {
    return {
      files: [],
    };
  },

  componentDidMount: function() {
    Ee.methods.on('workBinded',this.onWorkBinded);
  },

  onDrop: function(files) {
    self = this;
    this.props.toggleLoading();
    Superagent.post('/api/v1/contribution/add/')
    .attach('image',files[0])
    .end(function(err, res) {
      if (res && res.body && res.body.length && res.body[0].success) {
        sessionStorage.setItem(
          'idCompetitiveWork', res.body[0].success.id
          );
        sessionStorage.setItem(
          'webPath', res.body[0].success.webPath
          );
        self.props.toggleLoading();
      } else {
        self.setState({open:true, error:'Ой! Ошибка.'});
      }
    });
    this.setState({
      files: files,
    });
  },

  onWorkBinded: function() {
    this.setState({files:[]});
  },

  render: function() {
    return (
      <div>
        <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false}
          accept={'image/*'}
          style={style}
        >
          <div style={infoStyle}>Кликните или перетащите сюда файл с рисунком</div>
          {this.state.files.length > 0 ? <div>
            <div>
              {this.state.files.map((file, index) =>
                <img
                  key={index} src={file.preview} style={{maxWidth:256,maxHeight:256}}
                /> )}
            </div>
          </div> : null}
        </Dropzone>
      </div>
    );
  },
});

export default ImageZone;
