import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import ParticipantsList from './ParticipantsList';
import isNull from 'validator/lib/isNull';
import isInt from 'validator/lib/isInt';
import ImageZone from './ImageZone';
import Superagent from 'superagent';
import Snackbar from 'material-ui/lib/snackbar';
import Ee from 'event-emitter';
import APIUtils from './APIUtils';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import CircularProgress from 'material-ui/lib/circular-progress';
import {browserHistory} from 'react-router';

const style = {
  float: 'left',
};

const styleBlock = {
  display:"inline-flex",
  'paddingLeft':'30px',
};
const styleImageWaiting = {
  position: 'absolute',
  width: 256,
  height: 256,
  paddingTop: 60,
  zIndex:-1,
};

const about = {
    '.about>label':{
        'left':0,
    },
};
const add = {
    float: 'left',
    width: 173,
}

let name="";
let surname="";
let description="";
let photoInfo="";
let year="";
let patronymic="";

let valid = false;

const RegisterParticipantForm = React.createClass({
  getInitialState : function() {
    return {
      nameErrorMessageText: "",
      surnameErrorMessageText: "",
      yearErrorMessageText: "",
      imageErrorMessageText:"",
      registerButtonDisabled:  true,
      addButtonDisabled: false,
      dialogOpen:false,
      loading:false,
    };
  },
  componentDidMount: function() {
    APIUtils.init=true;
    Ee.methods.on('workBinded', this.onWorkBinded);
  },

  toggleLoading: function() {
    this.setState({loading: !this.state.loading});
  },

  handleAddParticipant: function() {
    this.setState({addButtonDisabled:true});
    if (isNull(name)) {
      valid = false;
      this.setState({nameErrorMessageText:"Обязательно заполнить"});
      this.setState({addButtonDisabled:false});
      return;
    } else {
      valid = true;
      this.setState({nameErrorMessageText:""});
    }

    if (isNull(surname)) {
      valid = false;
      this.setState({surnameErrorMessageText:"Обязательно заполнить"});
      this.setState({addButtonDisabled:false});
      return;
    } else {
      valid = true;
      this.setState({surnameErrorMessageText:""});
    }

    if (isNull(year)) {
      valid = false;
      this.setState({yearErrorMessageText:"Обязательно заполнить"});
      this.setState({addButtonDisabled:false});
      return;
    } else if (!isInt(year.trim(), {min:1800, max:1945})){
      valid = false;
      this.setState({yearErrorMessageText:"Вы ввели "+year+" год!"});
      this.setState({addButtonDisabled:false});
      return;
    } else {
      valid = true;
      this.setState({yearErrorMessageText:""});
    }

    if (sessionStorage.getItem('idCompetitiveWork') === '' || sessionStorage.getItem("idCompetitiveWork") === null) {
      this.setState({open:true, message:'Загрузите файл!'});
      valid = false;
    }

    if (valid) {
      self = this;
        Superagent.post('/api/v1/participant/add')
        .field('idDeclarant', sessionStorage.getItem('idDeclarant'))
        .field('name',name)
        .field('surname',surname)
        .field('patronymic',patronymic)
        .field('year',year)
        .field('description',description)
        .field('idContribution', sessionStorage.getItem('idCompetitiveWork'))
        .field('photoInfo', photoInfo)
        .end(function(err, res) {
          if (res && res.body && res.body.success) {
            Ee.methods.emit(
              'workBindingReady',
              res.body.success.id,
              sessionStorage.getItem('idDeclarant'),
              sessionStorage.getItem('idCompetitiveWork')
              );
            Ee.methods.emit('test', {name:name,surname:surname,webPath:sessionStorage.getItem('webPath')});
            name = "";
            surname = "";
            if (self.state.registerButtonDisabled) self.setState({registerButtonDisabled:false});
          } else {
            self.setState({open:true, message:'Ой! Ошибка.'});
          }
        });
    } else {
      console.log("Unknown error");
    }
    this.setState({addButtonDisabled:false});
  },

  handleSubmit: function() {
    this.setState({registerButtonDisabled:true});
    Superagent.put('/api/v1/register/')
      .type('form')
      .send({idDeclarant: sessionStorage.getItem('idDeclarant')})
      .end(function(err, res) {
        if (res && res.body && res.body.success) {
          Ee.methods.emit('betsMade');
          self.setState({dialogOpen: true});
        } else {
          self.setState({open:true, error:'Ой! Ошибка.'});
        }
      });
  },

  handleCloseDialog: function() {
    browserHistory.push("/gallery");
  },

  handleNameChange : function(event) {
    name = event.target.value;
  },

  handleSurnameChange : function(event) {
    surname = event.target.value;
  },

  handleYearChange : function(event) {
    year = event.target.value;
  },
  handleDescriptionChange : function(event) {
    description = event.target.value;
  },
  handlePatronymicChange : function(event) {
    patronymic = event.target.value;
  },
  handlePhotoInfoChange : function(event) {
    photoInfo = event.target.value; //TODO Не предусмотрено API!
  },

  onDrop: function(files) {
    this.setState({
      files: files,
    });
  },

  onOpenClick: function() {
    this.refs.dropzone.open();
  },

  handleRequestClose : function() {
    this.setState({
      open: false,
    });
  },

  onWorkBinded: function() {
    name = "";
    surname = "";
    sessionStorage.removeItem('idCompetitiveWork');
    this.forceUpdate();
  },

  render: function() {
    const modalActions = [
      <FlatButton
        label="Ок"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
    ];
    return (
      <div className="section group">
        <div className="info-block-2 col tough span_1_of_3 paragraph_margined">
          <p>
            Жизнь в мирное время прекрасна, несмотря ни на какие трудности. Особенно хорошо это знают те, кому довелось пройти через войну. Каждый год они ждали и ждут 9 мая как самого важного для них праздника.
          </p>
          <p>
            У каждого из нас есть родные и близкие, которые внесли свою лепту в победу над агрессором, развязавшим самую страшную войну в истории. В преддверии празднования Дня Победы МТРК «Мир» запускает проект «Мир без войны».
          </p>
          <p>
            Давайте вместе соберем галерею фотопортретов фронтовиков и ветеранов тыла после их возвращения к обычной жизни. Присылайте снимки своих отцов и матерей, бабушек и дедушек, которые пережили войну и подарили мирную жизнь своим детям и внукам. Пусть их портреты станут напоминанием о том, как дорога каждому Победа, доставшаяся столь дорогой ценой.
          </p>
          <div style={{margin:50}}>
            <a href={'https://www.youtube.com/watch?v=SYVUmVBgRBw&feature=youtu.be'} target={'_blank'} >
              Как заполнять заявку
            < /a>
          < /div>
        < /div>
        <div className="col span_1_of_3" style={styleBlock}>
          <div>
            <TextField
                floatingLabelText="Фамилия*"
                errorText={this.state.surnameErrorMessageText}
                onChange={this.handleSurnameChange}
                style={style}
            / >
            <br / >
            <TextField
              floatingLabelText="Имя*"
              errorText={this.state.nameErrorMessageText}
              onChange={this.handleNameChange}
              name={name}
              style={style}
            / >
            <br / >
            <TextField
              floatingLabelText="Отчество"
              onChange={this.handlePatronymicChange}
              style={style}
            / >
            <br / >
            <TextField
              floatingLabelText="Год рождения*"
              errorText={this.state.yearErrorMessageText}
              onChange={this.handleYearChange}
              style={style}
            / >
            <br / >
              <TextField
              floatingLabelText="Информация о ветеране"
              className="about"
              onChange={this.handleDescriptionChange}
              multiLine={true}
              style={about}
            / >
            <br / >
              <TextField
              floatingLabelText="Информация о фото"
              multiLine={true}
              onChange={this.handlePhotoInfoChange}
              className="about"
              style={about}
            / >
            <br / >
            <br / >
              <div className="upload">
            <div style={styleImageWaiting}>
            {this.state.loading ?
              <CircularProgress size={2} /> : null
            }
            </ div>
            <ImageZone toggleLoading={this.toggleLoading} />
            <br / >
            <br / >
            <RaisedButton
              label="Добавить фото"
              onMouseDown={this.handleAddParticipant}
              style={add}
              disabled={this.state.addButtonDisabled}
            / >
            <br / >
            <br / >
            {this.state.sending ?
              <div>
                <CircularProgress />
              </ div> :
              <FlatButton
                disabled={this.state.registerButtonDisabled}
                label="Зарегистрировать"
                secondary={true}
                onMouseDown={this.handleSubmit}
                style={style}
              / >}
                  </div>
              {this.state.open ?
                  <Snackbar
                      open={this.state.open}
                      message={this.state.message}
                      action="Ok"
                      autoHideDuration={5000}
                      onRequestClose={this.handleRequestClose}
                  /> : null}
            <Dialog
              title="Успешная регистрация!"
              actions={modalActions}
              modal={true}
              open={this.state.dialogOpen}
            >
              <div className="info-block-3">
                Здравствуйте, Ваши фотографии приняты.
                Благодарим Вас за участие в нашей акции. В ближайшее время фотографии пройдут модерацию и будут опубликованы в нашей галерее. После публикации Вы получите уведомление и ссылку на фотографию.
                < /div>
            </Dialog>
          < /div>
        < /div>
        <div className="col tough span_1_of_3">
          <ParticipantsList / >
        < /div>
      < /div>
      );
  },
});

export default RegisterParticipantForm;
